import "server-only";
import { Resend } from "resend";

/**
 * Server-only Resend client + configuration.
 *
 * The `"server-only"` import guard above will produce a build error if
 * any client component imports this file directly. All Resend usage
 * goes through API routes only.
 *
 * Env vars (see .env.example):
 *   RESEND_API_KEY      — required at runtime; routes return 503 if absent
 *   RESEND_AUDIENCE_ID  — required by the newsletter route
 *   RESEND_FROM         — verified sender, e.g. "MapleGrowth <no-reply@…>"
 *   WIZARD_TO_EMAIL     — recipient for wizard submissions (info@…)
 */

const apiKey = process.env.RESEND_API_KEY ?? "";

// Construct even without a key so the module exports stay stable; runtime
// calls will fail clearly if the key is missing.
export const resend = new Resend(apiKey);

export const resendConfig = {
  hasApiKey: Boolean(apiKey),
  from: process.env.RESEND_FROM ?? "MapleGrowth Digital <onboarding@resend.dev>",
  audienceId: process.env.RESEND_AUDIENCE_ID ?? "",
  wizardTo: process.env.WIZARD_TO_EMAIL ?? "info@maplegrowthdigital.ca",
} as const;
