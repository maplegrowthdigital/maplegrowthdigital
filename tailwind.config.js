/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#C62828'
        },
        // Optional neutrals tweak for better dark mode
        neutral: {
          950: '#0b0b0b'
        }
      },
      fontFamily: {
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
      },
    },
  },
  plugins: [],
}
