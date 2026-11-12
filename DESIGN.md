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
- Demo: from 1024px, the phone (fixed 22rem wide) on the left and the front desk on the right. Below 1024px, two tabs, "Patient's phone" and "Front desk"; the desk tab shows an amber dot when something changes there.
- Touch targets are at least 44px.

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
