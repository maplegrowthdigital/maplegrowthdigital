# Security Vulnerability Analysis Report

**Project:** MapleGrowth Digital  
**Analysis Date:** December 1, 2025  
**Analyzed Version:** Current main branch  
**Analysis Type:** Comprehensive Security Audit

---

## Executive Summary

This report documents security vulnerabilities identified in the MapleGrowth Digital website codebase. The analysis covers dependency vulnerabilities, code-level security issues, missing security configurations, and potential attack vectors.

**Critical Findings:** 2  
**High Severity:** 3  
**Medium Severity:** 5  
**Low Severity:** 3  
**Informational:** 4

---

## Table of Contents

1. [Critical Vulnerabilities](#1-critical-vulnerabilities)
2. [High Severity Vulnerabilities](#2-high-severity-vulnerabilities)
3. [Medium Severity Vulnerabilities](#3-medium-severity-vulnerabilities)
4. [Low Severity Vulnerabilities](#4-low-severity-vulnerabilities)
5. [Informational Findings](#5-informational-findings)
6. [Remediation Summary](#6-remediation-summary)
7. [Security Best Practices](#7-security-best-practices)

---

## 1. Critical Vulnerabilities

### 1.1 Authorization Bypass in Next.js Middleware (GHSA-f82v-jwr5-mffw)

**Severity:** Critical (CVSS 9.1)  
**CVE:** Not yet assigned  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-285 (Improper Authorization), CWE-863 (Incorrect Authorization)

**Description:**  
Next.js versions 14.0.0 through 14.2.24 contain an authorization bypass vulnerability in middleware that could allow attackers to bypass authentication and authorization checks.

**Attack Vector:**  
- Network accessible
- No privileges required
- Attackers can potentially access protected routes and resources

**Impact:**  
- Confidentiality: HIGH
- Integrity: HIGH
- Availability: NONE

**Remediation:**  
Update Next.js to version 14.2.25 or later:
```bash
npm install next@14.2.33
```

**References:**  
- https://github.com/advisories/GHSA-f82v-jwr5-mffw

---

### 1.2 No Rate Limiting on Contact Form API

**Severity:** Critical  
**Affected Component:** `/app/api/contact/route.ts`  
**CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling)

**Description:**  
The contact form API endpoint (`/api/contact`) has no rate limiting implemented, making it vulnerable to abuse through:
- Email bombing attacks
- Resource exhaustion
- Service disruption
- Spam campaigns using the contact form

**Attack Vector:**  
- Publicly accessible endpoint
- No authentication required
- No request throttling
- Could be automated with simple scripts

**Impact:**  
- Excessive email sending costs via Resend API
- Service degradation or denial of service
- Reputation damage if used for spam
- Resource exhaustion

**Current Code (Vulnerable):**
```typescript
export async function POST(request: Request) {
  if (!resend) {
    // ... error handling
  }
  
  // Direct processing without rate limiting
  const body = await request.json();
  // ... send email
}
```

**Remediation:**  
1. Implement rate limiting (e.g., 5 requests per 15 minutes per IP)
2. Add CAPTCHA verification (e.g., reCAPTCHA, hCaptcha)
3. Consider implementing honeypot fields
4. Add request validation and sanitization

**Example Solution:**
```typescript
// Option 1: Use middleware with rate limiting library
import rateLimit from 'express-rate-limit';

// Option 2: Use Vercel's edge config for rate limiting
// Option 3: Implement token bucket algorithm manually
```

---

## 2. High Severity Vulnerabilities

### 2.1 Next.js Cache Poisoning (GHSA-gp8f-8m3g-qvj9)

**Severity:** High (CVSS 7.5)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-349 (Acceptance of Extraneous Untrusted Data), CWE-639 (Insecure Direct Object Reference)

**Description:**  
Next.js versions 14.0.0 through 14.2.9 are vulnerable to cache poisoning attacks that could lead to denial of service.

**Impact:**  
- Availability: HIGH
- Could cause service disruption

**Remediation:**  
Update Next.js to version 14.2.10 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-gp8f-8m3g-qvj9

---

### 2.2 Next.js Authorization Bypass (GHSA-7gfc-8cq8-jh5f)

**Severity:** High (CVSS 7.5)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-285 (Improper Authorization), CWE-863 (Incorrect Authorization)

**Description:**  
Next.js versions 9.5.5 through 14.2.14 contain an authorization bypass vulnerability.

**Impact:**  
- Confidentiality: HIGH
- Unauthorized access to protected resources

**Remediation:**  
Update Next.js to version 14.2.15 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-7gfc-8cq8-jh5f

---

### 2.3 Missing Security Headers

**Severity:** High  
**Affected Component:** Next.js configuration  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Description:**  
The application lacks essential HTTP security headers that protect against common web attacks:

**Missing Headers:**
1. **Content-Security-Policy (CSP)**: No CSP headers to prevent XSS attacks
2. **X-Frame-Options**: Not set, allowing clickjacking attacks
3. **X-Content-Type-Options**: Not set, allowing MIME sniffing attacks
4. **Referrer-Policy**: Not configured
5. **Permissions-Policy**: Not configured
6. **Strict-Transport-Security (HSTS)**: Not configured

**Attack Vectors:**
- Cross-Site Scripting (XSS)
- Clickjacking
- MIME sniffing attacks
- Information disclosure via referrer

**Impact:**  
- Increased attack surface
- Vulnerability to XSS, clickjacking, and other attacks
- Potential data leakage

**Remediation:**  
Add security headers via `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://www.google-analytics.com",
              "frame-src 'self' https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 3. Medium Severity Vulnerabilities

### 3.1 Next.js SSRF via Improper Redirect Handling (GHSA-4342-x723-ch2f)

**Severity:** Medium (CVSS 6.5)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-918 (Server-Side Request Forgery)

**Description:**  
Next.js versions 0.9.9 through 14.2.31 are vulnerable to SSRF attacks via improper middleware redirect handling.

**Impact:**  
- Confidentiality: HIGH
- Integrity: LOW

**Remediation:**  
Update Next.js to version 14.2.32 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-4342-x723-ch2f

---

### 3.2 Next.js Cache Key Confusion (GHSA-g5qg-72qw-gw5v)

**Severity:** Medium (CVSS 6.2)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-524 (Information Exposure Through Caching)

**Description:**  
Cache key confusion vulnerability in image optimization API routes affecting Next.js 0.9.9 through 14.2.30.

**Impact:**  
- Confidentiality: HIGH
- Information exposure through cache

**Remediation:**  
Update Next.js to version 14.2.31 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-g5qg-72qw-gw5v

---

### 3.3 Input Validation Issues in Contact Form

**Severity:** Medium  
**Affected Component:** `/app/api/contact/route.ts`  
**CWE:** CWE-20 (Improper Input Validation)

**Description:**  
The contact form performs basic validation but has several issues:

1. **Email validation is weak**: Simple regex that may not catch all invalid emails
2. **No maximum length validation**: Could lead to buffer overflow or DoS
3. **No content sanitization**: While HTML escaping is implemented, input could contain malicious content
4. **No header injection protection**: Email subject could be manipulated

**Vulnerable Code:**
```typescript
const email = coerceString(values.email);
// Simple validation only
if (!name || !email || !message) {
  return NextResponse.json(
    { success: false, error: "Name, email, and message are required." },
    { status: 400 }
  );
}
```

**Attack Vectors:**
- Email header injection
- Extremely long inputs causing memory issues
- Special characters in subject line

**Remediation:**
1. Add comprehensive input validation:
```typescript
// Email validation
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
}

// Length validation
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

if (name.length > MAX_NAME_LENGTH || 
    email.length > MAX_EMAIL_LENGTH || 
    message.length > MAX_MESSAGE_LENGTH) {
  return NextResponse.json({ success: false, error: "Input too long" }, { status: 400 });
}

// Prevent header injection
if (email.includes('\n') || email.includes('\r')) {
  return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
}
```

---

### 3.4 Denial of Service via Image Optimization (GHSA-g77x-44xx-532m)

**Severity:** Medium (CVSS 5.9)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-674 (Uncontrolled Recursion)

**Description:**  
DoS condition in Next.js image optimization affecting versions 10.0.0 through 14.2.6.

**Impact:**  
- Availability: HIGH

**Remediation:**  
Update Next.js to version 14.2.7 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-g77x-44xx-532m

---

### 3.5 Next.js Content Injection in Image Optimization (GHSA-xv57-4mr9-wg8v)

**Severity:** Medium (CVSS 4.3)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-20 (Improper Input Validation)

**Description:**  
Content injection vulnerability in image optimization affecting Next.js 0.9.9 through 14.2.30.

**Impact:**  
- Integrity: LOW
- User interaction required

**Remediation:**  
Update Next.js to version 14.2.31 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-xv57-4mr9-wg8v

---

## 4. Low Severity Vulnerabilities

### 4.1 Next.js Race Condition to Cache Poisoning (GHSA-qpjv-v59x-3qc4)

**Severity:** Low (CVSS 3.7)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-362 (Concurrent Execution using Shared Resource)

**Description:**  
Race condition vulnerability in Next.js cache affecting versions 0.9.9 through 14.2.23.

**Impact:**  
- Confidentiality: LOW
- High complexity to exploit

**Remediation:**  
Update Next.js to version 14.2.24 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-qpjv-v59x-3qc4

---

### 4.2 Information Exposure in Next.js Dev Server (GHSA-3h52-269p-cp9r)

**Severity:** Low  
**Affected Component:** Next.js 14.2.5 (Development mode only)  
**CWE:** CWE-1385 (Missing Origin Validation)

**Description:**  
Information exposure in Next.js development server due to lack of origin verification affecting versions 13.0 through 14.2.29.

**Impact:**  
- Development environment only
- Information disclosure possible

**Remediation:**  
- Update Next.js to version 14.2.30 or later (included in 14.2.33 update)
- This primarily affects development environments
- Ensure production builds are used in deployment

**References:**  
- https://github.com/advisories/GHSA-3h52-269p-cp9r

---

### 4.3 DoS with Server Actions (GHSA-7m27-7ghc-44w9)

**Severity:** Low (CVSS 5.3)  
**Affected Component:** Next.js 14.2.5  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Description:**  
Next.js versions 14.0.0 through 14.2.20 allow denial of service via Server Actions.

**Impact:**  
- Availability: LOW

**Remediation:**  
Update Next.js to version 14.2.21 or later (included in 14.2.33 update).

**References:**  
- https://github.com/advisories/GHSA-7m27-7ghc-44w9

---

## 5. Informational Findings

### 5.1 Potentially Unsafe Use of dangerouslySetInnerHTML

**Severity:** Informational  
**Affected Components:** Multiple files  
**CWE:** CWE-79 (Cross-site Scripting)

**Description:**  
The codebase uses `dangerouslySetInnerHTML` in several locations for rendering JSON-LD schemas and inline styles. While the current usage appears safe (using `JSON.stringify()` and static configuration), this pattern requires careful monitoring.

**Affected Files:**
- `app/layout.tsx` - CSS variables and JSON-LD schema
- `components/Analytics.tsx` - Google Analytics/GTM scripts
- `components/BreadcrumbSchema.tsx` - JSON-LD breadcrumbs
- Various page files - JSON-LD schemas

**Current Implementation (Safe):**
```typescript
// Safe usage - data is from static configuration
dangerouslySetInnerHTML={{ __html: JSON.stringify(config.schema) }}

// Safe usage - CSS variables from configuration
dangerouslySetInnerHTML={{
  __html: `:root { 
    --brand-500: ${brandColor}; 
  }`,
}}
```

**Risks:**
- If configuration sources become user-controllable, XSS risk
- If JSON.stringify is removed, XSS risk
- Future developers may copy pattern unsafely

**Recommendations:**
1. Add comments explaining why these uses are safe
2. Consider using Next.js Script component for analytics
3. Document that brandColor and other config values must be validated
4. Add ESLint rule to flag new `dangerouslySetInnerHTML` usage

**Example Safe Pattern:**
```typescript
// SAFE: config is static and validated
// CSS color values are from trusted configuration file
dangerouslySetInnerHTML={{
  __html: `:root { --brand-500: ${brandColor}; }`,
}}
```

---

### 5.2 No Environment Variable Validation

**Severity:** Informational  
**Affected Component:** Application configuration  
**CWE:** CWE-1188 (Insecure Default Initialization)

**Description:**  
Environment variables are used without validation or type checking:
- `RESEND_API_KEY` / `NEXT_PUBLIC_RESEND_API_KEY`
- `CONTACT_FORM_TO`
- `CONTACT_FORM_FROM`
- Google Analytics IDs

**Current Code:**
```typescript
const resendApiKey =
  process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
```

**Risks:**
- Missing required variables may cause runtime errors
- Invalid format variables could cause unexpected behavior
- NEXT_PUBLIC_ prefix exposes API key to client (potential leak)

**Recommendations:**
1. Create environment variable validation at startup:
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_FORM_TO: z.string().email(),
  CONTACT_FORM_FROM: z.string().optional(),
  // ... other vars
});

export const env = envSchema.parse(process.env);
```

2. Never use `NEXT_PUBLIC_` prefix for API keys
3. Add .env.example file with all required variables
4. Document all environment variables in README

---

### 5.3 No HTTPS Enforcement

**Severity:** Informational  
**Affected Component:** Application configuration  
**CWE:** CWE-311 (Missing Encryption)

**Description:**  
The application does not enforce HTTPS at the application level. While this may be handled by the hosting platform (Vercel, etc.), it should be explicitly configured.

**Recommendations:**
1. Add HSTS header (included in remediation for 2.3)
2. Ensure hosting platform enforces HTTPS
3. Add canonical URLs with HTTPS protocol
4. Consider using `helmet` or similar middleware

---

### 5.4 Glob Package Vulnerability (Non-Exploitable)

**Severity:** Informational  
**Affected Component:** glob@10.4.5 (indirect dependency)  
**CWE:** CWE-78 (OS Command Injection)

**Description:**  
The `glob` package has a command injection vulnerability (GHSA-5j98-mcp5-4vw2), but this is:
- An indirect dependency (via Next.js or other packages)
- Only exploitable via CLI usage with `-c`/`--cmd` flags
- Not used in this application's runtime code

**Impact:**  
- Negligible for this application
- CLI vulnerability only
- No effects on running application

**Remediation:**  
While not critical, can be fixed with:
```bash
npm audit fix
```

**References:**  
- https://github.com/advisories/GHSA-5j98-mcp5-4vw2

---

## 6. Remediation Summary

### Immediate Actions (Critical/High Priority)

1. **Update Next.js** (Fixes 10 vulnerabilities):
```bash
npm install next@14.2.33
npm audit fix
```

2. **Implement Rate Limiting** on contact form:
   - Option A: Use Vercel Edge Config + Middleware
   - Option B: Use Upstash Redis for rate limiting
   - Option C: Implement token bucket algorithm
   - Add CAPTCHA (reCAPTCHA or hCaptcha)

3. **Add Security Headers** in `next.config.mjs`:
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security
   - Referrer-Policy
   - Permissions-Policy

### Medium Priority Actions

4. **Improve Input Validation**:
   - Add length limits on all form fields
   - Strengthen email validation
   - Add header injection protection
   - Sanitize all user inputs

5. **Environment Variable Validation**:
   - Create validation schema
   - Add .env.example file
   - Document all required variables
   - Remove NEXT_PUBLIC_ from sensitive keys

### Low Priority Actions

6. **Code Quality**:
   - Add comments to `dangerouslySetInnerHTML` usage
   - Consider using Next.js Script component
   - Add ESLint rules for security patterns

7. **Documentation**:
   - Document security considerations
   - Create security policy
   - Add contribution guidelines with security section

---

## 7. Security Best Practices

### Development Practices

1. **Regular Dependency Updates**:
```bash
# Check for updates weekly
npm outdated
npm audit

# Update dependencies
npm update
npm audit fix
```

2. **Pre-commit Hooks**:
   - Run `npm audit` before commits
   - Lint for security issues
   - Check for secrets in code

3. **Security Testing**:
   - Regular penetration testing
   - Automated security scanning in CI/CD
   - OWASP ZAP or similar tools

### Deployment Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate API keys regularly

2. **Monitoring**:
   - Monitor API usage for anomalies
   - Set up alerts for failed authentication
   - Track rate limit violations

3. **Incident Response**:
   - Define security incident response plan
   - Keep dependencies updated
   - Subscribe to security advisories

### Code Review Checklist

- [ ] No secrets in code
- [ ] All inputs validated
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Dependencies up to date
- [ ] Error messages don't leak sensitive info
- [ ] Authentication/authorization properly implemented
- [ ] HTTPS enforced
- [ ] XSS prevention in place
- [ ] SQL injection prevention (if applicable)
- [ ] CSRF protection enabled

---

## Appendix A: Vulnerability Counts by Package

| Package | Critical | High | Medium | Low | Total |
|---------|----------|------|--------|-----|-------|
| Next.js | 1 | 2 | 5 | 2 | 10 |
| Custom Code | 1 | 1 | 1 | 0 | 3 |
| glob (indirect) | 0 | 1 | 0 | 0 | 1 |
| **Total** | **2** | **4** | **6** | **2** | **14** |

---

## Appendix B: CVSS Score Distribution

| Severity | CVSS Range | Count |
|----------|------------|-------|
| Critical | 9.0-10.0 | 2 |
| High | 7.0-8.9 | 3 |
| Medium | 4.0-6.9 | 5 |
| Low | 0.1-3.9 | 3 |
| Informational | N/A | 4 |

---

## Appendix C: References

### Security Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/app/building-your-application/configuring/security-headers
- GitHub Advisory Database: https://github.com/advisories
- CWE Database: https://cwe.mitre.org/
- CVSS Calculator: https://www.first.org/cvss/calculator/3.1

### Tools

- npm audit: Built-in npm security auditing
- Snyk: https://snyk.io/
- OWASP ZAP: https://www.zaproxy.org/
- Dependabot: GitHub's automated dependency updates

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-01 | Security Audit | Initial comprehensive security analysis |

---

**Note:** This report should be treated as confidential and shared only with authorized personnel. Vulnerabilities should be addressed before public disclosure.
