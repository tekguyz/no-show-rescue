"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const bannerLink = "inline-flex min-h-11 items-center underline-offset-4 hover:underline";

/** DESIGN.md, Demo banner. `data-demo-banner` lets tools/capture hide it. */
export function DemoBanner({ onReset }: { onReset: () => void }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function reset() {
    onReset();
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 3000);
  }

  return (
    <aside aria-label="Demo" data-demo-banner className="border-b border-line bg-sunk">
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-x-6 px-4 text-label text-ink-muted sm:px-6">
        <p className="py-2" role="status">
          {done ? "Back to the start of the demo." : "You are in the demo. Nothing is sent to anyone."}
        </p>
        <div className="flex flex-wrap items-center gap-x-5">
          <button type="button" onClick={reset} className={bannerLink}>
            Reset demo
          </button>
          <Link href="/" className={bannerLink}>
            Leave the demo
          </Link>
          <p>
            Built by{" "}
            <a href="https://tekguyz.com" className={`${bannerLink} underline`}>
              TEKGUYZ
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}
