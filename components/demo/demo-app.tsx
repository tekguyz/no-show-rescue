"use client";

// The whole demo on one screen: the patient's phone and the front desk.
// This file runs the clock (messages "typing", the waitlist reply arriving);
// the rules themselves are pure, in lib/demo/engine.ts. Nothing is kept:
// a reload starts over (ADR 0001).

import { useEffect, useState } from "react";
import { business, filledBy, openSlot, patient } from "@/lib/demo/business";
import { advance, canAdvance, fillFromWaitlist, reply, start } from "@/lib/demo/engine";
import type { Run } from "@/lib/demo/types";
import { ClockIcon } from "../icons";
import { DemoBanner } from "./banner";
import { Desk } from "./desk";
import { Phone } from "./phone";

const TYPING_MS = 900;
const WAITLIST_REPLY_MS = 2600;

const steps = ["Reminder", "No-show", "New time", "Slot filled", "Review"] as const;

/** How many steps are done, in order. The current step is the next one. */
export function stepsDone(run: Run): number {
  const done = [
    run.phase !== "reminder",
    run.phase === "no-show" || run.phase === "after-visit" || run.phase === "done",
    run.lena === "rebooked" || run.lena === "call-back" || run.lena === "seen",
    run.filledBy !== null,
    run.review === "happy" || run.review === "feedback-sent",
  ];
  const first = done.indexOf(false);
  return first === -1 ? done.length : first;
}

export function DemoApp() {
  const [run, setRun] = useState<Run>(start);
  const [shown, setShown] = useState(0);
  const [tab, setTab] = useState<"phone" | "desk">("phone");
  const [unseen, setUnseen] = useState(false);
  const [resets, setResets] = useState(0);

  // Reveal the thread one message at a time; the practice "types" first.
  useEffect(() => {
    if (shown >= run.thread.length) return;
    const next = run.thread[shown];
    const t = setTimeout(() => setShown((n) => n + 1), next.from === "patient" ? 0 : TYPING_MS);
    return () => clearTimeout(t);
  }, [run, shown]);

  // A moment after the waitlist is texted, the first patient on it says yes.
  useEffect(() => {
    if (!run.waitlistTexted || run.filledBy) return;
    const t = setTimeout(() => {
      setRun((r) => fillFromWaitlist(r));
      setUnseen(true);
    }, WAITLIST_REPLY_MS);
    return () => clearTimeout(t);
  }, [run]);

  function onReply(id: string) {
    setRun((r) => reply(r, id));
    setUnseen(true);
  }

  function skip() {
    setRun((r) => advance(r));
    setUnseen(true);
  }

  function reset() {
    setRun(start());
    setShown(0);
    setUnseen(false);
    setTab("phone");
    setResets((n) => n + 1);
  }

  function showTab(next: "phone" | "desk") {
    setTab(next);
    if (next === "desk") setUnseen(false);
  }

  const done = stepsDone(run);
  const typing = shown < run.thread.length;

  return (
    <>
      <DemoBanner onReset={reset} />
      <main id="main" className="mx-auto w-full max-w-[90rem] flex-1 px-4 pt-5 pb-16 sm:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-headline">A missed visit at {business.name}</h1>
          <p className="max-w-[62ch] text-body text-ink-muted">
            You play {patient.first}, a patient. Get the reminder, skip the visit, pick a new time, and watch the front desk fill the open
            chair from the waitlist.
          </p>
        </div>

        <ol className="mt-4 flex flex-wrap gap-2 text-micro" aria-label="Where you are">
          {steps.map((label, i) => (
            <li
              key={label}
              aria-current={i === done ? "step" : undefined}
              className={`rounded-md px-3 py-1.5 font-semibold ${i < done ? "bg-brand-soft text-ink" : i === done ? "bg-ink text-paper" : "bg-sunk text-ink-muted"}`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        <ClockBar run={run} typing={typing} onSkip={skip} />

        <div role="tablist" aria-label="Demo view" className="mt-5 grid grid-cols-2 gap-1 rounded-lg bg-sunk p-1 lg:hidden">
          {(
            [
              ["phone", "Patient's phone"],
              ["desk", "Front desk"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => showTab(id)}
              className={`relative min-h-11 rounded-lg text-label ${tab === id ? "bg-surface text-ink" : "text-ink-muted"}`}
            >
              {label}
              {id === "desk" && unseen && tab !== "desk" && <span className="absolute top-2.5 right-4 size-2.5 rounded-full bg-gap" aria-label="Something changed" />}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
          <section id="panel-phone" aria-label="Patient's phone" className={`${tab === "phone" ? "" : "hidden"} lg:sticky lg:top-4 lg:block`}>
            <Phone key={resets} run={run} shown={shown} onReply={onReply} onSeeDesk={() => showTab("desk")} />
          </section>
          <section id="panel-desk" aria-label="Front desk" className={`${tab === "desk" ? "" : "hidden"} lg:block`}>
            <Desk run={run} />
          </section>
        </div>
      </main>
    </>
  );
}

/** The demo clock: what time it is, and the one button that moves it on. */
function ClockBar({ run, typing, onSkip }: { run: Run; typing: boolean; onSkip: () => void }) {
  const ready = canAdvance(run) && !typing;
  let hint: string;
  if (run.phase === "reminder") hint = `The reminder went out the evening before. Answer it on ${patient.first}'s phone, or don't.`;
  else if (run.phase === "visit-day") hint = `It's time for the visit, and ${patient.first} doesn't come.`;
  else if (run.phase === "no-show") {
    const needs = [run.lena === "no-show" ? `${patient.first} to pick a new time` : null, run.filledBy ? null : `the waitlist to answer for ${openSlot.time}`].filter(Boolean);
    hint = needs.length ? `Waiting for ${needs.join(" and ")}.` : `${patient.first} has a new time, and ${filledBy.name} took the open chair.`;
  } else if (run.phase === "after-visit") hint = `${patient.first} came to the new visit. One message asks how it went.`;
  else hint = "That's the whole loop. Reset the demo to try another path.";

  const label = run.phase === "visit-day" ? "Skip ahead 15 minutes" : "Skip to after the next visit";

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-md border-[1.5px] border-ink bg-surface px-4 py-3">
      <p className="flex items-center gap-2 font-display text-title">
        <ClockIcon className="text-ink" /> {run.clock}
      </p>
      <p className="min-w-[16rem] flex-1 text-label font-normal text-ink-muted" role="status">
        {hint}
      </p>
      {(run.phase === "visit-day" || run.phase === "no-show") && (
        <button
          type="button"
          onClick={onSkip}
          disabled={!ready}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 text-label font-semibold text-ink transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-sunk disabled:text-ink-muted"
        >
          {label}
        </button>
      )}
    </div>
  );
}
