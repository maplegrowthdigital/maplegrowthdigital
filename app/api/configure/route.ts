import { NextRequest, NextResponse } from "next/server";
import { resend, resendConfig } from "../../../lib/resend";
import { configureLimit, clientIp } from "../../../lib/ratelimit";
import { verifyTurnstile } from "../../../lib/turnstile";

/**
 * POST /api/configure
 *
 * Body: {
 *   stage: { id, title } | null,
 *   goal: { id, title } | null,
 *   services: Array<{ id, title }>,
 *   budget: { id, title } | null,
 *   name: string,
 *   email: string,
 *   note: string,
 *   honeypot?: string,
 * }
 *
 * Validates input, formats an HTML email summarising the request, and
 * delivers it to WIZARD_TO_EMAIL via Resend.
 *
 * Tags applied on the email for Resend dashboard organisation:
 *   - source:configure-wizard
 *   - services-count:<n>
 *
 * Not cached. Public route (rate limiting + Turnstile come in Group C).
 */
export const dynamic = "force-dynamic";

interface IdTitle {
  id: string;
  title: string;
}
interface ConfigurePayload {
  stage?: IdTitle | null;
  goal?: IdTitle | null;
  services?: IdTitle[];
  budget?: IdTitle | null;
  name?: string;
  email?: string;
  note?: string;
  honeypot?: string;
  /** Cloudflare Turnstile token from the client widget. */
  turnstileToken?: string;
}

const isValidEmail = (s: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// Lightweight HTML escaper. We only emit user-controlled text inside text
// nodes (not attributes / URLs), so escaping &<>" is enough.
const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatHtml = (p: Required<ConfigurePayload>): string => {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#6b665e;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#1a1714;font-size:15px;line-height:1.5;">${value}</td>
    </tr>`;
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#faf6ed;padding:32px 16px;color:#1a1714;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e6dcc6;border-radius:14px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:22px;letter-spacing:-0.02em;">New configure-wizard submission</h1>
      <p style="margin:0 0 24px;color:#6b665e;font-size:14px;">From the MapleGrowth Digital homepage.</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", escapeHtml(p.name))}
        ${row("Email", `<a href="mailto:${escapeHtml(p.email)}" style="color:#c62828;text-decoration:none;">${escapeHtml(p.email)}</a>`)}
        ${row("Stage", escapeHtml(p.stage?.title || "—"))}
        ${row("Primary goal", escapeHtml(p.goal?.title || "—"))}
        ${row(
          "Services",
          p.services.length > 0
            ? p.services.map((s) => escapeHtml(s.title)).join(", ")
            : "—"
        )}
        ${row("Budget", escapeHtml(p.budget?.title || "—"))}
        ${row(
          "Note",
          p.note
            ? `<div style="white-space:pre-wrap;">${escapeHtml(p.note)}</div>`
            : "—"
        )}
      </table>
      <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #f2ead9;color:#6b665e;font-size:12px;">
        Reply directly to this email to respond to ${escapeHtml(p.name)}.
      </p>
    </div>
  </div>`;
};

export async function POST(req: NextRequest) {
  let body: ConfigurePayload;
  try {
    body = (await req.json()) as ConfigurePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 1. Honeypot — silently 200 so bots learn nothing.
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2. Rate limit by IP — 5 submissions per hour.
  const ip = clientIp(req);
  const limit = await configureLimit.limit(ip);
  if (!limit.success) {
    return NextResponse.json(
      {
        error: "Too many submissions. Please try again in an hour.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.reset),
        },
      }
    );
  }

  // 3. Turnstile CAPTCHA verification.
  const cap = await verifyTurnstile(body.turnstileToken, ip);
  if (!cap.ok) {
    return NextResponse.json(
      { error: "CAPTCHA verification failed. Please refresh and try again." },
      { status: 400 }
    );
  }

  // Validation
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const note = (body.note ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Please tell us your name." },
      { status: 400 }
    );
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const services = Array.isArray(body.services) ? body.services : [];
  const payload: Required<ConfigurePayload> = {
    stage: body.stage ?? null,
    goal: body.goal ?? null,
    services,
    budget: body.budget ?? null,
    name,
    email,
    note,
    honeypot: "",
    // Already verified above — kept for the Required<> shape only.
    turnstileToken: "",
  };

  if (!resendConfig.hasApiKey) {
    return NextResponse.json(
      { error: "Submission is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const subject = `[Wizard] ${name} — ${
      payload.goal?.title || "configure request"
    }`;
    const result = await resend.emails.send({
      from: resendConfig.from,
      to: resendConfig.wizardTo,
      replyTo: email,
      subject,
      html: formatHtml(payload),
      tags: [
        { name: "source", value: "configure-wizard" },
        {
          name: "services-count",
          value: String(services.length),
        },
      ],
    });

    if (result.error) {
      return NextResponse.json(
        {
          error: "We couldn't send your request. Please try again.",
          upstream: {
            name: result.error.name,
            message: result.error.message,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "We couldn't send your request. Please try again.",
        upstream: {
          name: "exception",
          message: err instanceof Error ? err.message : String(err),
        },
      },
      { status: 502 }
    );
  }
}
