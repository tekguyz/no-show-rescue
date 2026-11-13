// The drawn phone (DESIGN.md, Phone frame). A device, not a box: a thin
// edge band, side buttons, a black bezel, rounded device corners, a status
// bar with the time and an island, and a home indicator. The demo's phone
// and the landing page's still picture share it. Size comes from the
// caller (`className`); the frame keeps the 9:19.5 screen inside.

import type { ReactNode } from "react";
import { PINEWHISTLE_MARK_SVG } from "@/lib/brand";
import { business } from "@/lib/demo/business";

type Props = { time: string; className?: string; children: ReactNode };

export function PhoneFrame({ time, className = "", children }: Props) {
  return (
    <div className={`relative shrink-0 rounded-[3.25rem] bg-night-line p-[3px] ${className}`}>
      <span aria-hidden className="absolute top-[17%] -left-[2px] h-[5%] w-[3px] rounded-l-[2px] bg-night-line" />
      <span aria-hidden className="absolute top-[25%] -left-[2px] h-[8%] w-[3px] rounded-l-[2px] bg-night-line" />
      <span aria-hidden className="absolute top-[35%] -left-[2px] h-[8%] w-[3px] rounded-l-[2px] bg-night-line" />
      <span aria-hidden className="absolute top-[27%] -right-[2px] h-[11%] w-[3px] rounded-r-[2px] bg-night-line" />
      <div className="h-full rounded-[calc(3.25rem-3px)] bg-night-deep p-[9px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.6rem] bg-night text-on-night">
          <StatusBar time={time} />
          {children}
          <span aria-hidden className="mx-auto mt-auto mb-2 block h-[5px] w-[34%] shrink-0 rounded-full bg-on-night/80" />
        </div>
      </div>
    </div>
  );
}

// Signal, wifi and battery. Static, so built once.
const statusIcons = (
  <span className="flex w-14 items-center justify-end gap-1.5">
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="7" width="3" height="4" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M1 3.8a9.2 9.2 0 0 1 13 0M3.4 6.3a5.8 5.8 0 0 1 8.2 0" />
      <circle cx="7.5" cy="9.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
      <rect x="0.6" y="0.6" width="20.3" height="10.8" rx="3" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.2" />
      <rect x="2.3" y="2.3" width="14" height="7.4" rx="1.6" fill="currentColor" />
      <path d="M22.4 4v4" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </span>
);

function StatusBar({ time }: { time: string }) {
  return (
    <div aria-hidden className="relative flex h-11 shrink-0 items-center justify-between px-7 pt-1.5 text-on-night">
      <span className="w-14 text-label">{time}</span>
      <span className="absolute top-2.5 left-1/2 h-[1.6rem] w-[34%] -translate-x-1/2 rounded-full bg-night-deep" />
      {statusIcons}
    </div>
  );
}

/** The messages app's header: back arrow, the practice's mark and name. */
export function ThreadHeader() {
  return (
    <div className="relative flex shrink-0 flex-col items-center gap-1 border-b border-night-line px-4 pt-1 pb-2.5">
      <svg aria-hidden className="absolute top-3.5 left-4 text-brand-on-night" width="11" height="18" viewBox="0 0 11 18" fill="none">
        <path d="M9.5 1.5 2 9l7.5 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        aria-hidden
        className="block size-10 overflow-hidden rounded-full border border-night-line [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: PINEWHISTLE_MARK_SVG }}
      />
      <div className="text-center">
        <p className="text-label">{business.name}</p>
        <p className="text-micro text-on-night-muted">Text message</p>
      </div>
    </div>
  );
}

/** "Tue 10:15 AM" → "10:15", the way a phone's status bar shows it. */
export function statusTime(clock: string): string {
  return clock.match(/\d{1,2}:\d{2}/)?.[0] ?? clock;
}
