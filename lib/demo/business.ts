// The made-up Sample Business the demo plays (DEMO-STANDARD.md, "Every demo
// is a made-up business"). Pinewhistle Dental is not a real practice: the
// name was searched on 2026-11-11 and nothing uses it. Every person here is
// invented. Never a real business name, and never a phone number, real or
// placeholder.

export const business = {
  name: "Pinewhistle Dental",
  shortName: "Pinewhistle",
  /** The dentist, as patients hear it. */
  doctor: "Dr. Okafor",
  /** The front desk, who sees the schedule. First name only. */
  frontDesk: "Rosa",
} as const;

/** The patient the visitor plays. */
export const patient = { first: "Lena", name: "Lena M.", visit: "Cleaning" } as const;

/** The appointment that will be missed. */
export const visit = { day: "Tuesday", time: "10:00 AM", chair: "Hygiene chair" } as const;

/** The new times offered after the no-show. */
export const newTimes = [
  { id: "thu", label: "Thu 2:30 PM" },
  { id: "fri", label: "Fri 9:00 AM" },
  { id: "call", label: "Call me instead" },
] as const;

/** The short-notice waitlist: patients who asked for an earlier visit. */
export const waitlist = [
  { id: "w1", name: "Marco T.", wants: "Cleaning, any morning" },
  { id: "w2", name: "Priya S.", wants: "Cleaning, this week" },
  { id: "w3", name: "June K.", wants: "Check-up, short notice is fine" },
] as const;

/** The waitlist patient who takes the open slot first. */
export const filledBy = waitlist[0];

/** The open slot offered to the waitlist, the same morning. */
export const openSlot = { time: "10:45 AM", label: "today at 10:45 AM" } as const;

/** The rest of Tuesday's schedule. Made-up patients, first name and initial. */
export const otherVisits = [
  { time: "8:30 AM", name: "Aaron B.", what: "Cleaning", chair: "Hygiene chair" },
  { time: "9:15 AM", name: "Sofia R.", what: "Filling", chair: "Chair 1" },
  { time: "11:00 AM", name: "Dev P.", what: "Check-up", chair: "Chair 1" },
  { time: "1:30 PM", name: "Hannah W.", what: "Crown fitting", chair: "Chair 1" },
  { time: "2:15 PM", name: "Luis A.", what: "Cleaning", chair: "Hygiene chair" },
] as const;
