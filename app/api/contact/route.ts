import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const TO_ADDRESS =
  process.env.CONTACT_FORM_TO ?? "info@maplegrowthdigital.ca";

const FALLBACK_FROM_ADDRESS = "MapleGrowth Digital <onboarding@resend.dev>";

const PRIMARY_FROM_ADDRESS =
  process.env.CONTACT_FORM_FROM ?? FALLBACK_FROM_ADDRESS;

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

const MAX_PAYLOAD_BYTES = 16 * 1024;
const FIELD_LIMITS: Record<string, number> = {
  name: 100,
  email: 254,
  company: 150,
  website: 500,
  services: 50,
  budget: 50,
  message: 5000,
  details: 5000,
};
const DEFAULT_FIELD_LIMIT = 1000;
const CONTEXT_LIMIT = 200;

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MIN_RENDER_AGE_MS = 1500;
const MAX_RENDER_AGE_MS = 6 * 60 * 60 * 1000;

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

type FormValues = Record<string, unknown>;

const rateLimitBuckets = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateLimitBuckets.get(ip) ?? []).filter((t) => t > cutoff);

  if (hits.length >= RATE_LIMIT_MAX) {
    const oldest = hits[0]!;
    return { ok: false, retryAfter: Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000) };
  }

  hits.push(now);
  rateLimitBuckets.set(ip, hits);

  if (rateLimitBuckets.size > 5000) {
    for (const [key, value] of rateLimitBuckets) {
      const fresh = value.filter((t) => t > cutoff);
      if (fresh.length === 0) rateLimitBuckets.delete(key);
      else rateLimitBuckets.set(key, fresh);
    }
  }

  return { ok: true, retryAfter: 0 };
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed", err);
    return false;
  }
}

function coerceString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasControlChars(value: string): boolean {
  return /[\r\n\x00]/.test(value);
}

function formatPlaintext(values: Record<string, string>): string {
  const lines = [
    "You received a new contact request:",
    "",
    ...Object.entries(values).map(([label, value]) => `${label}: ${value}`),
  ];
  return lines.join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatHtml(values: Record<string, string>) {
  const rows = Object.entries(values)
    .map(
      ([label, value]) => `
        <tr>
          <th style="text-align:left;padding:4px 12px 4px 0;font-weight:600;">${escapeHtml(
            label
          )}</th>
          <td style="padding:4px 0;">${escapeHtml(value).replace(
            /\n/g,
            "<br />"
          )}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
        <h2 style="margin-top:0;margin-bottom:16px;">New contact request</h2>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  if (!resend) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      {
        success: false,
        error:
          "Email service is not configured. Confirm RESEND_API_KEY is set on the server.",
      },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { success: false, error: "Payload too large." },
      { status: 413 }
    );
  }

  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  try {
    const rawText = await request.text();
    if (rawText.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload too large." },
        { status: 413 }
      );
    }

    let body: { values?: FormValues; context?: string; _hp?: string; _ts?: number; _captcha?: string };
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid payload." },
        { status: 400 }
      );
    }

    if (typeof body?._hp === "string" && body._hp.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    if (typeof body?._ts === "number" && Number.isFinite(body._ts)) {
      const age = Date.now() - body._ts;
      if (age < MIN_RENDER_AGE_MS || age > MAX_RENDER_AGE_MS) {
        return NextResponse.json({ success: true });
      }
    }

    if (TURNSTILE_SECRET) {
      const ok = await verifyTurnstile(String(body?._captcha ?? ""), ip);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Captcha verification failed." },
          { status: 400 }
        );
      }
    }

    const values = body?.values;
    if (!values || typeof values !== "object" || Array.isArray(values)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload." },
        { status: 400 }
      );
    }

    const name = coerceString(values.name);
    const email = coerceString(values.email);
    const message =
      coerceString(values.message) || coerceString(values.details);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email) || email.length > FIELD_LIMITS.email!) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (hasControlChars(name) || hasControlChars(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid characters detected." },
        { status: 400 }
      );
    }

    const safeEntries: Record<string, string> = {};
    for (const [key, raw] of Object.entries(values)) {
      if (key.startsWith("_")) continue;

      const cap = FIELD_LIMITS[key] ?? DEFAULT_FIELD_LIMIT;
      let value: string;

      if (Array.isArray(raw)) {
        value = raw.map((v) => String(v ?? "")).join(", ");
      } else if (typeof raw === "string") {
        value = raw.trim();
      } else if (raw == null) {
        value = "";
      } else {
        value = String(raw);
      }

      if (!value) continue;
      if (value.length > cap) {
        return NextResponse.json(
          { success: false, error: `Field "${key}" exceeds ${cap} characters.` },
          { status: 400 }
        );
      }

      if (key !== "message" && key !== "details" && hasControlChars(value)) {
        return NextResponse.json(
          { success: false, error: `Field "${key}" contains invalid characters.` },
          { status: 400 }
        );
      }

      const label = key
        .split(/[_-]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
      safeEntries[label] = value;
    }

    const rawContext = coerceString(body?.context).slice(0, CONTEXT_LIMIT);
    const safeContext = rawContext.replace(/[\r\n]+/g, " ") || "Contact Form";
    const subject = `New inquiry: ${safeContext}`;

    const payload = {
      to: [TO_ADDRESS],
      reply_to: email,
      subject,
      html: formatHtml(safeEntries),
      text: formatPlaintext(safeEntries),
    };

    let fromAddress = PRIMARY_FROM_ADDRESS;
    let { error } = await resend.emails.send({
      from: fromAddress,
      ...payload,
    });

    if (error && fromAddress !== FALLBACK_FROM_ADDRESS) {
      const errMsg = String(error?.message ?? "").toLowerCase();
      const shouldRetry =
        errMsg.includes("domain") ||
        errMsg.includes("not verified") ||
        errMsg.includes("invalid from") ||
        errMsg.includes("does not match a verified");

      if (shouldRetry) {
        console.warn(
          "Resend send failed with configured from address; retrying with fallback.",
          { error }
        );
        fromAddress = FALLBACK_FROM_ADDRESS;
        ({ error } = await resend.emails.send({
          from: fromAddress,
          ...payload,
        }));
      }
    }

    if (error) {
      console.error("Failed to send contact email via Resend", error);
      return NextResponse.json(
        { success: false, error: "Failed to deliver message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
