"use client";

// The patient's phone, drawn dark (DESIGN.md, The idea). It shows one text
// thread with the practice, and the replies the patient can tap.

import { useEffect, useRef, useState } from "react";
import { business, patient } from "@/lib/demo/business";
import { choices, messages } from "@/lib/demo/engine";
import type { Run } from "@/lib/demo/types";
import { StarIcon } from "../icons";

type Props = {
  run: Run;
  shown: number;
  onReply: (optionId: string) => void;
  onSeeDesk: () => void;
};

export function Phone({ run, shown, onReply, onSeeDesk }: Props) {
  const turns = run.thread.slice(0, shown);
  const typing = shown < run.thread.length;
  const options = typing ? [] : choices(run);
  const thread = useRef<HTMLDivElement>(null);
  const [linkTapped, setLinkTapped] = useState(false);
  const reviewLinkShown = !typing && turns.at(-1)?.text === messages.reviewLink;

  // Keep the newest message in view, like a real messages app.
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, typing]);

  return (
    <div className="mx-auto w-full max-w-[22rem] rounded-[2.75rem] bg-night p-2.5">
      <div className="flex h-[min(38rem,calc(100dvh-2.5rem))] min-h-[30rem] flex-col overflow-hidden rounded-[2.25rem] bg-night text-on-night">
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-micro text-on-night-muted" aria-hidden>
          <span className="font-semibold">{run.clock.split(" ").slice(1).join(" ") || run.clock}</span>
          <span className="h-5 w-20 rounded-full bg-night-raised" />
          <span>{patient.first}</span>
        </div>

        <div className="flex items-center gap-3 border-b border-night-line px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-night-raised font-display text-label">P</span>
          <div>
            <p className="text-label">{business.name}</p>
            <p className="text-micro text-on-night-muted">Text message</p>
          </div>
        </div>

        <div
          ref={thread}
          data-screen-ok="scroll-inside: the drawn phone scrolls its messages like a real phone"
          className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3"
          aria-live="polite"
        >
          {turns.map((t, i) => (
            <p
              key={i}
              className={`arrive max-w-[85%] rounded-2xl px-3.5 py-2.5 text-label font-normal ${
                t.from === "patient" ? "self-end bg-night-raised" : "self-start bg-bubble-out text-ink"
              }`}
            >
              {t.text}
            </p>
          ))}
          {typing && (
            <p className="arrive text-micro text-on-night-muted" aria-label={`${business.name} is writing`}>
              Typing…
            </p>
          )}
          {reviewLinkShown && (
            <div className="arrive self-start">
              <button
                type="button"
                onClick={() => setLinkTapped(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-on-night-muted px-4 text-label text-on-night hover:bg-night-raised"
              >
                <StarIcon width={16} height={16} /> Leave a review
              </button>
              {linkTapped && <p className="mt-1.5 text-micro text-on-night-muted">Not available in the demo.</p>}
            </div>
          )}
        </div>

        <div className="border-t border-night-line px-4 pt-3 pb-5">
          {options.length > 0 ? (
            <div className="arrive">
              <p className="text-micro text-on-night-muted">Reply as {patient.first}:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => onReply(o.id)}
                    className="min-h-11 rounded-lg border border-on-night-muted px-4 text-label text-on-night transition-colors hover:bg-night-raised"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-11 flex-col gap-2">
              <p className="text-micro text-on-night-muted">{typing ? " " : idleLine(run)}</p>
              {!typing && run.phase !== "reminder" && (
                <button type="button" onClick={onSeeDesk} className="min-h-11 rounded-lg bg-on-night text-label text-ink lg:hidden">
                  See the front desk
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function idleLine(run: Run): string {
  if (run.phase === "visit-day") return "Nothing to answer. Skip ahead with the clock above.";
  if (run.phase === "no-show") return "Done here. The front desk is filling the open chair.";
  if (run.phase === "done") return run.review === "happy" ? "Asked once. No reminders about the review." : "Your answer went only to the practice.";
  return " ";
}
