import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey =
  process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const TO_ADDRESS =
  process.env.CONTACT_FORM_TO ?? "maplegrowthdigital@gmail.com";
const FROM_ADDRESS =
  process.env.CONTACT_FORM_FROM ?? "MapleGrowth Digital <no-reply@maplegrowthdigital.ca>";

type FormValues = Record<string, unknown>;

function coerceString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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

  try {
    const body = (await request.json()) as {
      values?: FormValues;
      context?: string;
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

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
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
        : String(raw);

      if (!value) continue;

      const label = key
        .split(/[_-]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
      safeEntries[label] = value;
    }

    const subject = `New inquiry: ${body?.context ?? "Contact Form"}`;
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      replyTo: email,
      subject,
      html: formatHtml(safeEntries),
      text: formatPlaintext(safeEntries),
    });

    if (error) {
      console.error("Failed to send contact email", error);
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
