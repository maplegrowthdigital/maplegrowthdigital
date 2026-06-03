/** @type {import('tailwindcss').Config} */
module.exports = {
  // Theme switching is driven by [data-theme="light"] on <html> — keeps Tailwind's
  // own dark mode out of the way of our token-based approach.
  darkMode: ['variant', '[data-theme="light"] &'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand accent (preserved — matches existing button-primary references)
        brand: {
          500: '#C62828',
        },
        neutral: {
          950: '#0b0b0b',
        },

        // === MGD design tokens (theme-aware via CSS variables) ===
        // Background surfaces
        ink:       'var(--ink)',
        'ink-2':   'var(--ink-2)',
        'ink-3':   'var(--ink-3)',
        'surface-deep':        'var(--surface-deep)',
        'surface-deep-2':      'var(--surface-deep-2)',
        'surface-accent':      'var(--surface-accent)',
        'surface-accent-deep': 'var(--surface-accent-deep)',

        // Text colors — using rgb(... / <alpha-value>) lets `text-paper/72` work
        paper: 'rgb(var(--paper-rgb-channels) / <alpha-value>)',

        muted:   'var(--muted)',
        rule:    'var(--rule)',

        accent:        'var(--accent)',
        'accent-2':    'var(--accent-2)',
        'accent-soft': 'var(--accent-soft)',

        // Decorative tints
        rose:   'var(--rose)',
        amber:  'var(--amber)',
        forest: 'var(--forest)',
      },
      fontFamily: {
        // Existing aliases (preserved for older components)
        sans: [
          "var(--font-body)",
          "var(--font-body-default)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        heading: [
          "var(--font-heading)",
          "var(--font-heading-default)",
          "var(--font-body)",
          "sans-serif",
        ],

        // === MGD new aliases — used by the revamped homepage ===
        display: [
          "var(--font-display)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        body: [
          "var(--font-sans-mgd)",
          "var(--font-body)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        'content-max': '1320px',
      },
      borderRadius: {
        'mgd-sm': '6px',
        'mgd-md': '14px',
        'mgd-lg': '22px',
      },
      transitionTimingFunction: {
        'mgd-out':    'cubic-bezier(0.22, 1, 0.36, 1)',
        'mgd-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        'mgd-fast': '250ms',
        'mgd':      '500ms',
        'mgd-slow': '900ms',
      },
      spacing: {
        // Map sp-1 → sp-10 tokens to Tailwind spacing scale.
        // Use as `p-sp-5`, `gap-sp-4`, etc.
        'sp-1': '0.25rem',
        'sp-2': '0.5rem',
        'sp-3': '0.75rem',
        'sp-4': '1rem',
        'sp-5': '1.5rem',
        'sp-6': '2rem',
        'sp-7': '3rem',
        'sp-8': '4rem',
        'sp-9': '6rem',
        'sp-10': '8rem',
      },
    },
  },
  plugins: [],
};
