# MapleGrowth Digital — Project Notes for Claude

## What this project is

The website for **MapleGrowth Digital**, a Canadian growth marketing agency.

- **Production stack**: Next.js App Router (TypeScript), content driven by `content/data.json` and case studies as TypeScript files in `content/case-studies/`.
- **Brand voice + service list + contact info**: lives in `content/data.json`. Read it before writing any new homepage / marketing copy.

## Active workstream: homepage rebuild

A new homepage is being prototyped in **vanilla HTML / CSS / JS** inside `design-prototype/` (gitignored), to be ported into the Next.js app once finalized.

**⭐ Before doing any homepage / TidyCal / prototype-related work, read:**

```
memory-bank/HOMEPAGE_REBUILD.md
```

That file is the source of truth for:
- All sections built and how each one works
- The design system (colors, type, spacing, motion tokens)
- Animation patterns + a critical ScrollTrigger refresh bugfix
- The custom TidyCal booking widget (mock service + state machine)
- The detailed plan for porting the TidyCal API integration to Next.js proxy routes
- What's still on the roadmap (Round 3: pricing/wizard/calculator; Round 4: DrawSVG/theme/locale)

The `memory-bank/` directory is gitignored — these notes stay local.

## Conventions

- **Don't run `npm install` or commit lockfile changes** without being asked.
- **Don't commit changes** unless explicitly requested. The user reviews everything.
- **Don't push** unless explicitly requested. Definitely don't force-push to `main` without explicit confirmation (and even then, only with `--force-with-lease`).
- **`design-prototype/` and `memory-bank/`** are gitignored — never untracked-add them.
- When working in `design-prototype/`, **always use the design tokens** in `css/tokens.css`. Don't hardcode colors, type sizes, or spacing.
- **Backup before destructive prototype changes**: snapshot to `design-prototype/_backup-pre-*` first.
- The brand accent is **`#C62828`** — final.
- The `mgd:` prefix is used for all `localStorage` / `sessionStorage` keys.

## File map (high-level)

```
app/                    # Next.js App Router pages (production site)
components/             # React components used by the production site
content/
├── data.json           # All homepage copy, services, stats, contact info
└── case-studies/       # One TS file per case study
design-prototype/       # NEW homepage prototype (HTML/CSS/JS, gitignored)
memory-bank/            # Local project notes (gitignored)
├── HOMEPAGE_REBUILD.md # Read this before homepage work
public/                 # Static assets
```

## Sensitive / never commit

These are listed in `.gitignore` for a reason:
- `.env*` files
- `DATABASE.md`, `SETUP.md`, `SEO_PLAYBOOK.md`
- `test-smtp.js`
- `public/uploads/`
- `memory-bank/`
- `design-prototype/`
