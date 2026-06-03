import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic — verifies which Resend env vars the running
 * function actually sees. NEVER exposes the full key value.
 *
 * Visit https://maplegrowthdigital.ca/api/debug-resend and compare the
 * key prefix/suffix shown here to the one in your .env.local. Mismatch =
 * the key in Vercel for Production is wrong or stale.
 *
 * 🚨 DELETE THIS FILE after verifying — even partial-key exposure is
 * worth removing once it's served its purpose.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.RESEND_API_KEY ?? "";
  const audienceId = process.env.RESEND_AUDIENCE_ID ?? "";
  const from = process.env.RESEND_FROM ?? "";
  const wizardTo = process.env.WIZARD_TO_EMAIL ?? "";

  return NextResponse.json({
    resendApiKey: {
      isSet: Boolean(key),
      length: key.length,
      prefix: key.slice(0, 7), // e.g. "re_abcd"
      suffix: key.slice(-4),
      startsWithRe: key.startsWith("re_"),
      hasLeadingWhitespace: key !== key.trimStart(),
      hasTrailingWhitespace: key !== key.trimEnd(),
      hasNonAsciiChars: /[^\x20-\x7E]/.test(key),
    },
    resendAudienceId: {
      isSet: Boolean(audienceId),
      length: audienceId.length,
      prefix: audienceId.slice(0, 8),
    },
    resendFrom: {
      isSet: Boolean(from),
      value: from, // safe to expose — it's the visible From address
    },
    wizardToEmail: {
      isSet: Boolean(wizardTo),
      value: wizardTo, // safe to expose — Rohan's own email
    },
    runtime: {
      vercelEnv: process.env.VERCEL_ENV ?? "(not set — local?)",
      nodeEnv: process.env.NODE_ENV ?? "(not set)",
    },
  });
}
