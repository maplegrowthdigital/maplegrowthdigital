"use client";

import { useEffect, useState } from "react";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const FONT_PATTERN = /^[a-zA-Z0-9\s,"'\/\-:\(\)_]+$/;

export function DynamicStyles() {
  const [brandColor, setBrandColor] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState<string | null>(null);
  const [headingFont, setHeadingFont] = useState<string | null>(null);
  const [bodyFont, setBodyFont] = useState<string | null>(null);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const currentBrand = styles.getPropertyValue("--brand-500").trim();
    const currentButton = styles.getPropertyValue("--button-primary").trim();
    const currentHeading = styles.getPropertyValue("--font-heading").trim();
    const currentBody = styles.getPropertyValue("--font-body").trim();

    if (currentBrand) setBrandColor(currentBrand);
    if (currentButton) setButtonColor(currentButton);
    if (currentHeading) setHeadingFont(currentHeading);
    if (currentBody) setBodyFont(currentBody);

    const fetchTheme = async () => {
      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await res.json();
        const liveStyles = getComputedStyle(document.documentElement);
        const liveBrand = liveStyles.getPropertyValue("--brand-500").trim();
        const liveButton = liveStyles
          .getPropertyValue("--button-primary")
          .trim();
        const liveHeading = liveStyles.getPropertyValue("--font-heading").trim();
        const liveBody = liveStyles.getPropertyValue("--font-body").trim();

        const brandSettings = (data.brand ?? {}) as Record<string, unknown>;
        const fallbackSettings = (data.settings ?? {}) as Record<string, unknown>;

        const takeHex = (value: unknown): string | null => {
          if (typeof value !== "string") return null;
          const trimmed = value.trim();
          return HEX_COLOR.test(trimmed) ? trimmed : null;
        };

        const takeFont = (value: unknown): string | null => {
          if (typeof value !== "string") return null;
          const trimmed = value.trim();
          if (!trimmed) return null;
          return FONT_PATTERN.test(trimmed) ? trimmed : null;
        };

        const nextBrand =
          takeHex(brandSettings.brandColor) ??
          takeHex(fallbackSettings.brandColor);
        const nextButton =
          takeHex(brandSettings.primaryButtonColor) ??
          takeHex(fallbackSettings.primaryButtonColor);
        const nextHeading =
          takeFont(brandSettings.headingFontFamily) ??
          takeFont(fallbackSettings.headingFontFamily);
        const nextBody =
          takeFont(brandSettings.bodyFontFamily) ??
          takeFont(fallbackSettings.bodyFontFamily);
        const legacyFont =
          takeFont(brandSettings.fontFamily) ??
          takeFont(fallbackSettings.fontFamily);

        if (nextBrand && nextBrand !== liveBrand) {
          setBrandColor(nextBrand);
        }

        const resolvedButton = nextButton || nextBrand || liveBrand;
        if (resolvedButton && resolvedButton !== liveButton) {
          setButtonColor(resolvedButton);
        } else if (!resolvedButton && liveButton) {
          setButtonColor(liveBrand || liveButton);
        }

        const resolvedHeading = nextHeading ?? legacyFont;
        if (resolvedHeading && resolvedHeading !== liveHeading) {
          setHeadingFont(resolvedHeading);
        } else if (
          !resolvedHeading &&
          !brandSettings.headingFontFamily &&
          !fallbackSettings.headingFontFamily &&
          !legacyFont
        ) {
          setHeadingFont(null);
        }

        const resolvedBody = nextBody ?? legacyFont;
        if (resolvedBody && resolvedBody !== liveBody) {
          setBodyFont(resolvedBody);
        } else if (
          !resolvedBody &&
          !brandSettings.bodyFontFamily &&
          !fallbackSettings.bodyFontFamily &&
          !legacyFont
        ) {
          setBodyFont(null);
        }
      } catch (error) {
        console.log("Could not fetch dynamic theme, using current");
      }
    };

    if (!currentBrand || !currentButton || !currentHeading || !currentBody) {
      fetchTheme();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "brandColorUpdate") {
        fetchTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (brandColor) {
      const current = getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-500")
        .trim();
      if (current !== brandColor) {
        document.documentElement.style.setProperty("--brand-500", brandColor);
      }
    }
  }, [brandColor]);

  useEffect(() => {
    if (buttonColor) {
      const current = getComputedStyle(document.documentElement)
        .getPropertyValue("--button-primary")
        .trim();
      if (current !== buttonColor) {
        document.documentElement.style.setProperty(
          "--button-primary",
          buttonColor
        );
      }
    }
  }, [buttonColor]);

  useEffect(() => {
    const root = document.documentElement;
    if (headingFont) {
      const current = getComputedStyle(root)
        .getPropertyValue("--font-heading")
        .trim();
      if (current !== headingFont) {
        root.style.setProperty("--font-heading", headingFont);
      }
    } else {
      root.style.removeProperty("--font-heading");
    }
  }, [headingFont]);

  useEffect(() => {
    const root = document.documentElement;
    if (bodyFont) {
      const current = getComputedStyle(root)
        .getPropertyValue("--font-body")
        .trim();
      if (current !== bodyFont) {
        root.style.setProperty("--font-body", bodyFont);
      }
    } else {
      root.style.removeProperty("--font-body");
    }
  }, [bodyFont]);

  return null; // This component doesn't render anything
}
