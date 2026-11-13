---
name: No-Show Rescue
description: A lavender front desk. A dark patient phone on the left, the practice's schedule on the right, and one coral that means "the practice acted".
colors:
  paper: "#ECE8FB"
  surface: "#F7F5FF"
  sunk: "#DFD9F5"
  line: "#C8C1E8"
  ink: "#221D3F"
  ink-muted: "#565071"
  brand: "#FF5B4A"
  brand-deep: "#FF7B6D"
  brand-soft: "#FFCFC8"
  gap: "#A8200F"
  gap-soft: "#FDE1DC"
  night: "#221D3F"
  night-raised: "#362F5C"
  on-night: "#F7F5FF"
  on-night-muted: "#B9B3DC"
typography:
  display: { fontFamily: "Outfit", fontSize: "2.75rem (4rem from 1024px)", fontWeight: 700, lineHeight: 1.02 }
  headline: { fontFamily: "Outfit", fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.12 }
  title: { fontFamily: "Outfit", fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.3 }
  body: { fontFamily: "Outfit", fontSize: "1rem", fontWeight: 400, lineHeight: 1.55 }
  label: { fontFamily: "Outfit", fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.4 }
  micro: { fontFamily: "Outfit", fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.35 }
---

# Design rules

The rulebook for every screen. Tokens live in `app/globals.css`; hex copies for drawn images live in `lib/brand.ts`. Change this file first.

## The look (decided 2026-11-13, tekguyz/no-show-rescue#5)

Picked against `claude-config/LOOKS.md`. Closest row: the old teal version of this demo; it differs in all five columns.

| Column | Pick |
|---|---|
| Ground | Pale lavender `#ece8fb`; panels `#f7f5ff`; text `#221d3f` |
| Accent | Coral `#ff5b4a`, for the one main action and filled-slot moments |
| Display font | Outfit, 600 and 700 |
| Body font | Outfit, 400 (one family for the whole demo) |
| Shape | 6px corners. Secondary buttons outlined (2px, text color); the main action filled coral. Panels outlined 1.5px instead of shadowed. No pill buttons |

## The idea

A patient's phone is drawn in **night** colors, because it is a phone in a pocket. The practice's front desk is drawn on calm **lavender**. The demo moves a single appointment from one to the other.

## Color

1. **Coral** (`brand`) is a fill, never text: the main button, the reply bubbles, a rebooked or filled visit. Text on coral is `ink` (5.2:1). Coral on lavender is under 3:1, so it never carries meaning alone there.
2. **Gap red** (`gap`, a deep coral) means one thing: an empty chair. A no-show, an open slot. Never decoration.
3. Everything else is ink on lavender. No gradients, no shadows, no other accents.
4. Light theme only. The phone is dark ink because it is a phone, not a dark mode.
5. Contrast checked 2026-11-13, all text pairs at least 5.2:1 (WCAG AA).

## Type

Outfit only: 700 for display, headline and title; 600 for labels; 400 for body. Six sizes only, as tokens: `text-display`, `text-headline`, `text-title`, `text-body`, `text-label`, `text-micro`. Tailwind's own sizes are off.

## Shape

6px corners on everything (`rounded-md`), including the phone. Panels are outlined 1.5px in `ink`; row dividers use `line`. Secondary buttons are outlined 2px in `ink`. The main action is filled coral. No pill buttons, no shadows. Round only a status dot.

## Layout

- Landing page: one column up to 1024px, a max width of 72rem. 16px side gutter on phones.
- Demo: from 1024px, the phone (fixed 22rem wide) on the left and the front desk on the right. Below 1024px, two tabs, "Patient's phone" and "Front desk"; the desk tab shows a red dot when something changes there.
- Touch targets are at least 44px.

## Logo

**Option A, "Slot filled"** (picked by the founder 2026-11-11 from `docs/design/logos.html`): a calendar page with an ink check, on coral. `PRODUCT_MARK_SVG` in `lib/brand.ts`, `app/icon.svg` and `docs/banner.svg` already ship it.

The Sample Business, Pinewhistle Dental, has its own mark (`PINEWHISTLE_MARK_SVG`): a small pine on ink. It shows only inside the demo.

## Motion

Motion shows a change of state, nothing else:

1. A new message arrives: a 320ms rise and fade in.
2. The open chair is filled: a hairline draws from the left under the row, once.

Under `prefers-reduced-motion: reduce` both are off and nothing is hidden. Content is visible by default.

## Demo banner

A thin ink-on-lavender bar at the top of every demo screen: "You are in the demo. Nothing is sent to anyone." with Reset demo, Leave the demo and "Built by TEKGUYZ". It carries `data-demo-banner` so `tools/capture` hides it.
