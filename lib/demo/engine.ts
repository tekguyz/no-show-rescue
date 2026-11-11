// The demo's rules, as pure functions. Screens never change a Run by hand.
// Nothing here sends anything: every message lands in `sent` and on the
// drawn phone only (ADR 0001).

import { business, filledBy, newTimes, openSlot, patient, visit, waitlist } from "./business";
import type { Option, Run, Sent, Turn } from "./types";

const P = business.name;

export const messages = {
  reminder: `Hi ${patient.first}, this is ${P}. A reminder of your cleaning tomorrow at ${visit.time} with ${business.doctor}. Reply to confirm, or to ask for another time.`,
  confirmed: "Thanks, see you tomorrow!",
  noShow: `Hi ${patient.first}, we missed you at ${visit.time} today. No worries. Want a new time? Pick one, or ask us to call.`,
  waitlist: `Hi, this is ${P}. A spot opened ${openSlot.label} for a cleaning. Want it? Reply YES. First to reply gets it.`,
  waitlistTaken: `Thanks for replying. The ${openSlot.time} spot was taken, and you stay on the list.`,
  booked: (time: string) => `You're booked for ${time} with ${business.doctor}. We'll send a reminder the day before.`,
  callBack: `Got it. ${business.frontDesk} at our front desk will call you today to find a time.`,
  review: `Thanks for coming in today, ${patient.first}. How was your visit?`,
  reviewLink: `So glad to hear it! Would you leave us a short review? It helps other families find us.`,
  feedbackAsk: `Sorry to hear that. What could we have done better? Your answer goes only to our team.`,
  feedbackThanks: `Thank you. ${business.frontDesk} at our front desk will read this today.`,
} as const;

export const reminderReplies: readonly Option[] = [
  { id: "confirm", label: "Confirm" },
  { id: "ignore", label: "Don't reply" },
];

export const reviewReplies: readonly Option[] = [
  { id: "happy", label: "It was great" },
  { id: "meh", label: "Could be better" },
];

export const feedbackReplies: readonly Option[] = [
  { id: "wait", label: "The wait was long" },
  { id: "billing", label: "Billing was unclear" },
];

const clocks = {
  reminder: "Mon 6:00 PM",
  "visit-day": "Tue 10:00 AM",
  "no-show": "Tue 10:15 AM",
} as const;

function sent(run: Run, to: string, text: string): Sent {
  return { id: `m${run.sent.length + 1}-${to}`, when: run.clock, to, text };
}

function say(run: Run, from: Turn["from"], text: string): Run {
  const thread = [...run.thread, { from, text }];
  return { ...run, thread, sent: from === "practice" ? [...run.sent, sent(run, patient.name, text)] : run.sent };
}

/** The start: Monday evening, the reminder has just gone out. */
export function start(): Run {
  const run: Run = {
    phase: "reminder",
    clock: clocks.reminder,
    thread: [],
    lena: "reminded",
    newTime: null,
    waitlistTexted: false,
    filledBy: null,
    review: null,
    sent: [],
  };
  return say(run, "practice", messages.reminder);
}

/** What the patient can tap now. Empty when the next move is the clock's. */
export function choices(run: Run): readonly Option[] {
  if (run.phase === "reminder") return reminderReplies;
  if (run.phase === "no-show" && run.lena === "no-show") return newTimes;
  if (run.phase === "after-visit" && run.review === "asked") return reviewReplies;
  if (run.phase === "after-visit" && run.review === "feedback") return feedbackReplies;
  return [];
}

/** The patient taps a reply. A tap that isn't on offer changes nothing. */
export function reply(run: Run, optionId: string): Run {
  const option = choices(run).find((o) => o.id === optionId);
  if (!option) return run;

  if (run.phase === "reminder") {
    if (optionId === "confirm") {
      const r = say(say(run, "patient", "Confirm"), "practice", messages.confirmed);
      return { ...r, lena: "confirmed", phase: "visit-day", clock: clocks["visit-day"] };
    }
    return { ...run, phase: "visit-day", clock: clocks["visit-day"] };
  }

  if (run.phase === "no-show") {
    const r = say(run, "patient", option.label);
    if (optionId === "call") return { ...say(r, "practice", messages.callBack), lena: "call-back" };
    return { ...say(r, "practice", messages.booked(option.label)), lena: "rebooked", newTime: option.label };
  }

  if (run.review === "asked") {
    const r = say(run, "patient", option.label);
    if (optionId === "happy") return { ...say(r, "practice", messages.reviewLink), review: "happy", phase: "done" };
    return { ...say(r, "practice", messages.feedbackAsk), review: "feedback" };
  }

  const r = say(run, "patient", option.label);
  return { ...say(r, "practice", messages.feedbackThanks), review: "feedback-sent", phase: "done" };
}

/** May the demo clock move on now? */
export function canAdvance(run: Run): boolean {
  if (run.phase === "visit-day") return true;
  if (run.phase === "no-show") return run.lena !== "no-show" && run.filledBy !== null;
  return false;
}

/** Move the demo clock on: to 15 minutes past the visit, then to after the next visit. */
export function advance(run: Run): Run {
  if (!canAdvance(run)) return run;
  if (run.phase === "visit-day") {
    // Nobody came. The patient gets the no-show text, and the open chair
    // goes to the short-notice waitlist.
    const r = say({ ...run, phase: "no-show", clock: clocks["no-show"], lena: "no-show" }, "practice", messages.noShow);
    const offers = waitlist.map((w) => sent(r, w.name, messages.waitlist));
    return { ...r, waitlistTexted: true, sent: [...r.sent, ...offers] };
  }
  // The next visit happens; afterwards, one review request.
  // A call-back patient was booked by the front desk by phone.
  const clock = run.newTime === "Thu 2:30 PM" ? "Thu 3:30 PM" : run.newTime === "Fri 9:00 AM" ? "Fri 10:00 AM" : "Wed 11:00 AM";
  const next: Run = { ...run, phase: "after-visit", clock, lena: "seen", review: "asked" };
  return say(next, "practice", messages.review);
}

/** The first waitlist patient says yes. The others hear it was taken. */
export function fillFromWaitlist(run: Run): Run {
  if (!run.waitlistTexted || run.filledBy) return run;
  const confirm = sent(run, filledBy.name, messages.booked(openSlot.label));
  const others = waitlist.filter((w) => w.id !== filledBy.id).map((w) => sent(run, w.name, messages.waitlistTaken));
  return { ...run, filledBy: filledBy.name, sent: [...run.sent, confirm, ...others] };
}
