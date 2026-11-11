// The marks, drawn once. The favicon (app/icon.svg), the home-screen icon,
// the link preview and the logo on the page all use these.
//
// NOT PICKED YET. The founder picks from docs/design/logos.html. Until then
// the app ships option A so the build can run; DESIGN.md says so.
//
// An SVG string cannot read CSS variables, so these hex values copy the
// tokens in app/globals.css. Change both together.

export const colors = {
  paper: "#F3F6F4",
  ink: "#13262B",
  inkMuted: "#51646A",
  brand: "#0E6B66",
  gap: "#A85A12",
} as const;

/** Product mark, option A "Slot filled": a calendar page with a check. */
export const PRODUCT_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${colors.brand}"/><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8.5" width="18" height="16" rx="3"/><path d="M7 13.5h18M12 6v4M20 6v4"/><path d="m12.5 19 2.5 2.5 4.5-4.5"/></g></svg>`;

/** The Sample Business's own mark: a small pine on ink. */
export const PINEWHISTLE_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${colors.ink}"/><path d="M16 6 10 14h3.5L9 20.5h14L18.5 14H22Z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><path d="M16 20.5V26" stroke="${colors.paper}" stroke-opacity=".7" stroke-width="2.2" stroke-linecap="round"/></svg>`;
