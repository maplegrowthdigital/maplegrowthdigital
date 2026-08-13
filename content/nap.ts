/**
 * NAP — Name, Address, Phone. Single source of truth.
 *
 * Local SEO depends on the NAP shown on the page matching the LocalBusiness
 * structured data AND the Google Business Profile *character for character*.
 * Google treats mismatches as evidence the listing is unreliable, so the
 * footer and content/schema.ts both read from here rather than each holding
 * their own copy that can silently drift apart.
 *
 * If this changes, update the Google Business Profile in the same pass.
 */
export const nap = {
  name: "MapleGrowth Digital",
  streetAddress: "363 Lakeshore Rd E",
  addressLocality: "Mississauga",
  addressRegion: "ON",
  postalCode: "L5G 1H7",
  addressCountry: "Canada",
  telephone: "+1 (431) 726-1578",
  email: "info@maplegrowthdigital.ca",
} as const;

/** `tel:` href form — digits and a leading + only. */
export const telHref = `tel:${nap.telephone.replace(/[^+\d]/g, "")}`;

/** Single-line address, e.g. for meta descriptions or compact layouts. */
export const addressOneLine = `${nap.streetAddress}, ${nap.addressLocality}, ${nap.addressRegion} ${nap.postalCode}, ${nap.addressCountry}`;
