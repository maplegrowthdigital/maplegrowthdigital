import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env, isValidEmail } from "../../../lib/env";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

const TO_ADDRESS = env.contactFormTo;

const FALLBACK_FROM_ADDRESS = "MapleGrowth Digital <onboarding@resend.dev>";

const PRIMARY_FROM_ADDRESS =
  env.contactFormFrom ?? FALLBACK_FROM_ADDRESS;

// Basic in-memory rate limiting per IP (best-effort, resets on deploy)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max requests per window per IP
const rateLimitStore = new Map<string, number[]>();

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = rateLimitStore.get(ip)?.filter((t) => t > windowStart) ?? [];
  if (hits.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateLimitStore.set(ip, hits);
  return false;
}

type FormValues = Record<string, unknown>;

function coerceString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FIELD_LENGTH = 1000;

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

async function verifyCaptcha(token: string | undefined) {
  const secret = process.env.CAPTCHA_SECRET;
  const verifyUrl =
    process.env.CAPTCHA_VERIFY_URL ??
    "https://www.google.com/recaptcha/api/siteverify";

  // If no secret is configured, allow by default (hook is optional)
  if (!secret) return { success: true as const };

  if (!token) {
    return { success: false as const, error: "captcha_required" };
  }

  try {
    const res = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    if (!res.ok) {
      return { success: false as const, error: "captcha_unavailable" };
    }

    const data = (await res.json()) as { success?: boolean };
    if (!data?.success) {
      return { success: false as const, error: "captcha_failed" };
    }
    return { success: true as const };
  } catch (error) {
    console.error("Captcha verification failed", error);
    return { success: false as const, error: "captcha_error" };
  }
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

  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = (await request.json()) as {
      values?: FormValues;
      context?: string;
      captchaToken?: string;
    };

    const values = body?.values;
    if (!values || typeof values !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload." },
        { status: 400 }
      );
    }

    const name = coerceString(values.name);
    const email = coerceString(values.email);
    const message =
      coerceString(values.message) || coerceString(values.details);
    const context =
      typeof body?.context === "string"
        ? body.context.slice(0, MAX_FIELD_LENGTH)
        : "Contact Form";

    // Optional CAPTCHA verification hook (skips when secret not set)
    const captchaCheck = await verifyCaptcha(body?.captchaToken);
    if (!captchaCheck.success) {
      const code =
        captchaCheck.error === "captcha_required"
          ? 400
          : captchaCheck.error === "captcha_failed"
          ? 403
          : 503;
      return NextResponse.json(
        {
          success: false,
          error: "CAPTCHA verification failed. Please try again.",
          code: captchaCheck.error,
        },
        { status: code }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { success: false, error: "Input too long. Please shorten your message." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const safeEntries: Record<string, string> = {};
    for (const [key, raw] of Object.entries(values)) {
      const value = Array.isArray(raw)
        ? raw.join(", ")
        : typeof raw === "string"
        ? raw.trim()
        : raw == null
        ? ""
        : String(raw).slice(0, MAX_FIELD_LENGTH);

      if (!value) continue;

      const label = key
        .split(/[_-]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
      safeEntries[label] = value;
    }

    const subject = `New inquiry: ${context}`;
    const replyTo = isValidEmail(email) ? email : undefined;

    const payload = {
      to: [TO_ADDRESS],
      ...(replyTo ? { reply_to: replyTo } : {}),
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
      const message = String(error?.message ?? "").toLowerCase();
      const shouldRetry =
        message.includes("domain") ||
        message.includes("not verified") ||
        message.includes("invalid from") ||
        message.includes("does not match a verified");

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
      console.error("Failed to send contact email", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to deliver message.",
          details: error?.message ?? null,
        },
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
