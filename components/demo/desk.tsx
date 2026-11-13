// The front desk, drawn on paper (DESIGN.md, The idea): Tuesday's schedule,
// the short-notice waitlist, the patient's record, and every message the
// system would have sent. Read-only: the engine decides every change.

import { business, filledBy, openSlot, otherVisits, patient, visit, waitlist } from "@/lib/demo/business";
import type { LenaStatus, Run } from "@/lib/demo/types";
import { CalendarIcon, StarIcon, TextIcon, UsersIcon } from "../icons";

type Row = { time: string; name: string; what: string; chair: string; badge?: { text: string; tone: "ok" | "gap" | "brand" | "muted" }; mine?: boolean; fresh?: boolean };

const minutes = (t: string) => {
  const [hm, ap] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
};

const lenaBadge: Record<LenaStatus, Row["badge"]> = {
  reminded: { text: "Reminded", tone: "muted" },
  confirmed: { text: "Confirmed", tone: "ok" },
  "no-show": { text: "No-show", tone: "gap" },
  rebooked: { text: "No-show · rebooked", tone: "brand" },
  "call-back": { text: "No-show · call back", tone: "brand" },
  seen: { text: "No-show · rebooked", tone: "brand" },
};

const tones = {
  ok: "bg-brand-soft text-ink",
  brand: "bg-brand-soft text-ink",
  gap: "bg-gap-soft text-gap",
  muted: "bg-sunk text-ink-muted",
} as const;

export function Desk({ run }: { run: Run }) {
  const past = run.phase !== "reminder";
  const rows: Row[] = [
    ...otherVisits.map((v) => ({ ...v, badge: { text: past && minutes(v.time) < minutes(visit.time) ? "Seen" : "Confirmed", tone: "muted" as const } })),
    { time: visit.time, name: patient.name, what: patient.visit, chair: visit.chair, badge: lenaBadge[run.lena], mine: true },
  ];
  if (run.waitlistTexted) {
    rows.push(
      run.filledBy
        ? { time: openSlot.time, name: filledBy.name, what: "Cleaning", chair: visit.chair, badge: { text: "From the waitlist", tone: "ok" }, fresh: true }
        : { time: openSlot.time, name: "Open", what: "Offered to the waitlist", chair: visit.chair, badge: { text: "Open chair", tone: "gap" } },
    );
  }
  rows.sort((a, b) => minutes(a.time) - minutes(b.time));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card title={`${visit.day}'s schedule`} icon={<CalendarIcon />} note={`${business.frontDesk}'s view at the front desk`}>
          <ul className="flex flex-col">
            {rows.map((r) => (
              <li
                key={`${r.time}-${r.name}`}
                className={`relative grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 border-t border-line py-2.5 first:border-t-0 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] ${r.fresh ? "arrive" : ""}`}
              >
                <span className="text-label">{r.time}</span>
                <span className="min-w-0">
                  <span className={`block truncate text-label ${r.name === "Open" ? "text-gap" : ""}`}>
                    {r.name}
                    {r.mine && <span className="font-normal text-ink-muted"> · you</span>}
                  </span>
                  <span className="block truncate text-micro text-ink-muted">
                    {r.what} · {r.chair}
                  </span>
                </span>
                {r.badge && <span className={`col-start-2 justify-self-start rounded-md px-2.5 py-1 text-micro font-semibold sm:col-start-3 ${tones[r.badge.tone]}`}>{r.badge.text}</span>}
                {r.fresh && <span aria-hidden className="hairline-draw absolute inset-x-0 bottom-0 h-0.5 bg-brand" />}
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Short-notice waitlist" icon={<UsersIcon />} note="Patients who asked for an earlier visit">
            <ul className="flex flex-col gap-2">
              {waitlist.map((w) => {
                const status = !run.waitlistTexted ? "Waiting" : run.filledBy ? (w.id === filledBy.id ? `Took ${openSlot.time}` : "Told it was taken") : "Texted";
                const took = run.filledBy && w.id === filledBy.id;
                return (
                  <li key={w.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-label">{w.name}</span>
                      <span className="block text-micro text-ink-muted">{w.wants}</span>
                    </span>
                    <span className={`shrink-0 rounded-md px-2.5 py-1 text-micro font-semibold ${took ? tones.ok : tones.muted}`}>{status}</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title={`${patient.name}'s record`} icon={<StarIcon />}>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-label">
              <dt className="font-normal text-ink-muted">Reminder</dt>
              <dd>{run.phase === "reminder" ? "Sent" : run.thread.some((t) => t.from === "patient" && t.text === "Confirm") ? "Confirmed by text" : "Sent, no reply"}</dd>
              <dt className="font-normal text-ink-muted">{visit.day}</dt>
              <dd>{run.phase === "reminder" || run.phase === "visit-day" ? visit.time : "No-show"}</dd>
              <dt className="font-normal text-ink-muted">New visit</dt>
              <dd>{run.newTime ?? (run.lena === "call-back" || (run.lena === "seen" && !run.newTime) ? `${business.frontDesk} to call` : "—")}</dd>
              <dt className="font-normal text-ink-muted">After the visit</dt>
              <dd>{reviewLine(run)}</dd>
            </dl>
            {run.review === "feedback-sent" && (
              <p className="arrive mt-3 rounded-md bg-gap-soft px-3 py-2 text-label font-normal text-ink">
                Private feedback for {business.frontDesk}: &ldquo;{run.thread.at(-2)?.text}&rdquo;
              </p>
            )}
          </Card>
        </div>
      </div>

      <Card title="What would go out" icon={<TextIcon />} note="Every text the system would send. In the demo, none is sent.">
        <ol className="flex flex-col">
          {[...run.sent].reverse().map((s) => (
            <li key={s.id} className="arrive grid gap-1 border-t border-line py-2.5 first:border-t-0 sm:grid-cols-[7.5rem_8rem_minmax(0,1fr)] sm:gap-3">
              <span className="text-micro text-ink-muted">{s.when}</span>
              <span className="text-label">To {s.to}</span>
              <span className="text-label font-normal text-ink-muted">{s.text}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function reviewLine(run: Run): string {
  if (run.review === null) return "—";
  if (run.review === "asked" || run.review === "feedback") return "Asked how it went";
  if (run.review === "happy") return "Happy: sent the review link, once";
  return "Not happy: no review link, feedback to the team";
}

function Card({ title, icon, note, children }: { title: string; icon: React.ReactNode; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border-[1.5px] border-ink bg-surface p-4 sm:p-5">
      <h2 className="flex items-center gap-2 font-display text-title">
        <span className="text-ink">{icon}</span> {title}
      </h2>
      {note && <p className="mt-0.5 text-micro text-ink-muted">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

