import { ImageResponse } from "next/og";
import { PRODUCT_MARK_SVG } from "@/lib/brand";

// The home-screen icon, drawn from the same mark as the favicon. Never a
// hand-made PNG (DEMO-STANDARD.md). The phone rounds the corners.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const square = PRODUCT_MARK_SVG.replace('rx="8"', 'rx="0"');
  const src = `data:image/svg+xml,${encodeURIComponent(square)}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
