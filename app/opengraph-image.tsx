import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { colors, PRODUCT_MARK_SVG } from "@/lib/brand";
import { siteName } from "@/lib/site";

// The link-preview card, drawn by the app in its own look (DEMO-STANDARD.md):
// the headline on lavender, and a dark phone with the new time being booked.
export const alt = `${siteName}. Fewer empty chairs: reminders, new times after a no-show, and the open slot filled from a waitlist.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "app/_og");
const [display, body400, body600] = await Promise.all([
  readFile(join(fontDir, "outfit-700.woff")),
  readFile(join(fontDir, "outfit-400.woff")),
  readFile(join(fontDir, "outfit-600.woff")),
]);

const mark = `data:image/svg+xml,${encodeURIComponent(PRODUCT_MARK_SVG)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: colors.paper,
          color: colors.ink,
          fontFamily: "Outfit",
          padding: "64px 72px",
          borderBottom: `12px solid ${colors.brand}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={56} height={56} alt="" />
            <div style={{ fontSize: 34, fontWeight: 600 }}>{siteName}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 44, fontFamily: "Outfit", fontWeight: 700, fontSize: 84, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
            <span>Fewer empty</span>
            <span>chairs.</span>
          </div>
          <div style={{ marginTop: 26, fontSize: 28, color: colors.inkMuted, maxWidth: 560 }}>
            Reminders, a new time after a no-show, and the open slot filled from your waitlist.
          </div>
          <div style={{ display: "flex", marginTop: "auto" }}>
            <div style={{ display: "flex", padding: "14px 28px", borderRadius: 6, background: colors.brand, color: colors.ink, fontSize: 26, fontWeight: 600 }}>
              Try the demo · no signup
            </div>
          </div>
        </div>
        <div style={{ display: "flex", width: 280, marginLeft: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 280, height: 500, borderRadius: 6, background: colors.ink, padding: "36px 22px", gap: 14, color: "#fff", fontSize: 20 }}>
            <div style={{ display: "flex", color: "#B9B3DC", fontWeight: 600, fontSize: 18 }}>Tue 10:15 AM</div>
            <div style={{ display: "flex", background: colors.brand, color: colors.ink, borderRadius: 6, padding: "14px 16px", lineHeight: 1.3 }}>
              We missed you today. Want a new time?
            </div>
            <div style={{ display: "flex", alignSelf: "flex-end", background: "#362F5C", borderRadius: 6, padding: "12px 16px" }}>Thu 2:30 PM</div>
            <div style={{ display: "flex", marginTop: "auto", background: colors.paper, color: colors.ink, borderRadius: 6, padding: "14px 16px", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 18 }}>Open chair filled</span>
              <span style={{ fontSize: 16, color: colors.inkMuted }}>From the waitlist · 10:45 AM</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: display, weight: 700, style: "normal" },
        { name: "Outfit", data: body400, weight: 400, style: "normal" },
        { name: "Outfit", data: body600, weight: 600, style: "normal" },
      ],
    },
  );
}
