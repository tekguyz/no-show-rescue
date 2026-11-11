// The product's public address and the words every link preview uses.
// The product has a plain name, never TEKGUYZ (DEMO-STANDARD.md). The demo
// plays a made-up Sample Business: see lib/demo/business.ts.

export const siteName = "No-Show Rescue";
export const siteTagline = "Fewer empty chairs.";
export const siteDescription =
  "Patients get a reminder before a visit. A no-show gets a new time offered by text, the open slot is offered to your waitlist, and happy patients are asked for a review. Try the one-click demo.";

/**
 * The address search engines and link previews should use. On Vercel this is
 * the project's production domain; locally it is localhost.
 */
export function siteUrl(): URL {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(production ? `https://${production}` : "http://localhost:3000");
}
