// The words of the demo, as types. CONTEXT.md defines each term.

/** Where the demo is, in order: reminder, visit-day, no-show, after-visit, done. */
export type Phase = "reminder" | "visit-day" | "no-show" | "after-visit" | "done";

/** One message on the patient's phone. */
export type Turn = { from: "practice" | "patient"; text: string };

export type Option = { id: string; label: string };

/** One line in "What would go out": every message the system would send. Nothing is sent. */
export type Sent = { id: string; when: string; to: string; text: string };

export type LenaStatus = "reminded" | "confirmed" | "no-show" | "rebooked" | "call-back" | "seen";

export type Review = "asked" | "happy" | "feedback" | "feedback-sent" | null;

export type Run = {
  phase: Phase;
  /** The demo clock, as the phone and the schedule show it. */
  clock: string;
  thread: Turn[];
  lena: LenaStatus;
  /** The new time Lena picked, if any. */
  newTime: string | null;
  /** True once the waitlist has been texted about the open slot. */
  waitlistTexted: boolean;
  /** The waitlist patient who took the slot. */
  filledBy: string | null;
  review: Review;
  sent: Sent[];
};
