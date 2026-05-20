const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const DEFAULT_CONTACT_EMAIL = "maplegrowthdigital@gmail.com";

export function isValidEmail(email: string) {
  if (!email || email.length > 254) return false;
  if (email.includes("\r") || email.includes("\n")) return false;
  return EMAIL_REGEX.test(email);
}

function warn(message: string, extra?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message, extra || {});
  }
}

const contactFormTo =
  process.env.CONTACT_FORM_TO?.trim() || DEFAULT_CONTACT_EMAIL;

if (!isValidEmail(contactFormTo)) {
  warn("CONTACT_FORM_TO is invalid; falling back to default.");
}

const resendApiKey =
  process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY || "";

if (!resendApiKey) {
  warn("RESEND_API_KEY is not set. Contact form email delivery will fail.");
}

if (process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  warn("Avoid exposing RESEND API keys via NEXT_PUBLIC_RESEND_API_KEY.");
}

export const env = {
  resendApiKey,
  contactFormTo: isValidEmail(contactFormTo)
    ? contactFormTo
    : DEFAULT_CONTACT_EMAIL,
  contactFormFrom:
    process.env.CONTACT_FORM_FROM ||
    process.env.RESEND_FROM_ADDRESS ||
    undefined,
  captchaSecret: process.env.CAPTCHA_SECRET,
  captchaVerifyUrl: process.env.CAPTCHA_VERIFY_URL,
};
