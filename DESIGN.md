---
name: No-Show Rescue
description: The front desk, calm and green. A dark patient phone on the left, the practice's schedule on paper on the right, and one amber that only means "an empty chair".
colors:
  paper: "#F3F6F4"
  surface: "#FFFFFF"
  sunk: "#E6ECE9"
  line: "#D2DCD7"
  ink: "#13262B"
  ink-muted: "#51646A"
  brand: "#0E6B66"
  brand-deep: "#0A524E"
  brand-soft: "#DCEFEC"
  gap: "#A85A12"
  gap-soft: "#F8E8D6"
  night: "#13262B"
  night-deep: "#0B181B"
  night-raised: "#1F3A41"
  on-night: "#F3F6F4"
  on-night-muted: "#A6BCC0"
typography:
  display: { fontFamily: "Bricolage Grotesque", fontSize: "2.75rem (4rem from 1024px)", fontWeight: 700, lineHeight: 1.02 }
  headline: { fontFamily: "Bricolage Grotesque", fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.12 }
  title: { fontFamily: "Bricolage Grotesque", fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.3 }
  body: { fontFamily: "Schibsted Grotesk", fontSize: "1rem", fontWeight: 400, lineHeight: 1.55 }
  label: { fontFamily: "Schibsted Grotesk", fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.4 }
  micro: { fontFamily: "Schibsted Grotesk", fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.35 }
---

# Design rules

The rulebook for every screen. Tokens live in `app/globals.css`; hex copies for drawn images live in `lib/brand.ts`. Change this file first. It reuses the system of the sibling demo, Missed Call Follow-Up (two worlds, one phone and one office), with its own colors.

## The idea

A patient's phone is drawn in **night** colors, because it is a phone in a pocket. The practice's front desk is drawn on calm **paper**. The demo moves a single appointment from one to the other.

## Color

1. **Brand teal** (`brand`) means the practice has acted: the reply bubbles, the main button, a rebooked or filled visit.
2. **Gap amber** (`gap`) means one thing: an empty chair. A no-show, an open slot. Never decoration.
3. Everything else is ink on paper. No gradients on the page, no other accent colors.
4. Light theme only. The phone is dark because it is a phone, not a dark mode.

## Type

Bricolage Grotesque for display, headline and title. Schibsted Grotesk for everything else. Six sizes only, as tokens: `text-display`, `text-headline`, `text-title`, `text-body`, `text-label`, `text-micro`. Tailwind's own sizes are off.

## Layout

- Landing page: one column up to 1024px, a max width of 72rem. 16px side gutter on phones.
- Demo: from 1024px, the phone (sized to the window, see Phone frame) on the left and the front desk on the right. Below 1024px, two tabs, "Patient's phone" and "Front desk"; the desk tab shows an amber dot when something changes there.
- Touch targets are at least 44px.

## Shape

Outlined (assigned 2026-11-13, tekguyz/no-show-rescue#10, so the demos stop sharing one template). `app/__tests__/guards.test.ts` pins it.

1. **4px corners** (`rounded`) on buttons, panels, tags and the step row. No `rounded-xl`, `rounded-2xl` or larger, no pill buttons.
2. **Only the main action is filled:** "Try the demo" (teal) and the demo clock's skip button (ink). Every other button is a 1.5px outline with no fill: the patient's reply buttons, "Leave a review", the view tabs.
3. **Panels are outlined, not white cards:** a 1px `line` border on paper, no fill. The landing page's "How it works" band keeps its full-width `surface` fill; it is a band, not a card.
4. **No shadows** anywhere. Depth comes from the outline.
5. Round stays only where a thing is round in life: the practice's avatar, the amber "something changed" dot, the phone's island, home bar and device corners, and message bubbles.

Button looks live once, in `components/buttons.ts`.

## Phone frame

`components/phone-frame.tsx`, used by the demo's phone and the landing page's still picture (`claude-config/LOOKS.md`, "Phone and browser frames").

- A device, not a box: a 3px `night-line` edge band with side buttons, a `night-deep` bezel, rounded device corners, a status bar with the time (from the demo clock), an island, signal, wifi and battery, and a home bar.
- The messages header is the app's own: a back arrow, the Pinewhistle mark as the avatar, the practice name and "Text message".
- Real proportions, 9:19.5. The `.phone-fit` class in `app/globals.css` sets its height from the window (`clamp(32rem, 100dvh - 18rem, 47.5rem)` from 1024px) and its width from the ratio, so it never runs off the bottom at 1440 x 900; the thread scrolls inside it.
- Colors are the night tokens only. Bubbles keep soft message corners; the reply buttons below them are outlined at 4px.

## Logo

**Option A, "Slot filled"** (picked by the founder 2026-11-11 from `docs/design/logos.html`): a calendar page with a check, on teal. `PRODUCT_MARK_SVG` in `lib/brand.ts`, `app/icon.svg` and `docs/banner.svg` already ship it.

The Sample Business, Pinewhistle Dental, has its own mark (`PINEWHISTLE_MARK_SVG`): a small pine on ink. It shows only inside the demo.

## Motion

Motion shows a change of state, nothing else:

1. A new message arrives: a 320ms rise and fade in.
2. The open chair is filled: a hairline draws from the left under the row, once.

Under `prefers-reduced-motion: reduce` both are off and nothing is hidden. Content is visible by default.

## Demo banner

A thin ink-on-sunk bar at the top of every demo screen: "You are in the demo. Nothing is sent to anyone." with Reset demo, Leave the demo and "Built by TEKGUYZ". It carries `data-demo-banner` so `tools/capture` hides it.
