export const brand = {
  // Logo configuration
  logoUrl: "/maplegrowth-logo.svg",

  // Brand colors
  brandColor: "#C62828", // Primary brand color
  primaryButtonColor: "", // Leave empty to use brand color

  // Typography
  headingFontFamily: "", // Leave empty for default Montserrat
  bodyFontFamily: "", // Leave empty for default Open Sans

  // Brand presets for easy switching
  colorPresets: [
    {
      name: "Crimson (Default)",
      value: "#C62828",
      description: "Bold crimson default — energetic and confident",
    },
    {
      name: "Blue",
      value: "#3b82f6",
      description: "Professional blue - trusted and reliable",
    },
    {
      name: "Green",
      value: "#10b981",
      description: "Fresh green - perfect for eco/health brands",
    },
    {
      name: "Purple",
      value: "#8b5cf6",
      description: "Modern purple - tech and innovation focused",
    },
    {
      name: "Teal",
      value: "#14b8a6",
      description: "Sophisticated teal - modern and professional",
    },
  ],
} as const;
