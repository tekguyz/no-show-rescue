import { describe, expect, it } from "vitest";
import { filledBy, waitlist } from "../business";
import { advance, canAdvance, choices, fillFromWaitlist, messages, reply, start } from "../engine";

const toNoShow = (first = "confirm") => advance(reply(start(), first));
const toAfterVisit = (time = "thu") => advance(fillFromWaitlist(reply(toNoShow(), time)));

describe("no-show rescue engine", () => {
  it("starts with the reminder on the patient's phone, and logs it", () => {
    const run = start();
    expect(run.phase).toBe("reminder");
    expect(run.thread).toEqual([{ from: "practice", text: messages.reminder }]);
    expect(run.sent).toHaveLength(1);
    expect(choices(run).map((o) => o.id)).toEqual(["confirm", "ignore"]);
  });

  it("confirming marks the visit confirmed; not replying leaves it reminded", () => {
    expect(reply(start(), "confirm").lena).toBe("confirmed");
    const ignored = reply(start(), "ignore");
    expect(ignored.lena).toBe("reminded");
    expect(ignored.phase).toBe("visit-day");
  });

  it("ignores a tap that isn't on offer", () => {
    const run = start();
    expect(reply(run, "thu")).toBe(run);
  });

  it("after the visit time, marks a no-show, offers new times and texts the waitlist", () => {
    const run = toNoShow("ignore");
    expect(run.lena).toBe("no-show");
    expect(run.thread.at(-1)?.text).toBe(messages.noShow);
    expect(choices(run).map((o) => o.id)).toEqual(["thu", "fri", "call"]);
    expect(run.waitlistTexted).toBe(true);
    for (const w of waitlist) expect(run.sent.some((s) => s.to === w.name && s.text === messages.waitlist)).toBe(true);
  });

  it("books the new time the patient picks", () => {
    const run = reply(toNoShow(), "thu");
    expect(run.lena).toBe("rebooked");
    expect(run.newTime).toBe("Thu 2:30 PM");
    expect(choices(run)).toHaveLength(0);
  });

  it("can hand the patient to the front desk instead", () => {
    expect(reply(toNoShow(), "call").lena).toBe("call-back");
  });

  it("fills the open slot from the first waitlist reply, once, and tells the others", () => {
    const run = fillFromWaitlist(toNoShow());
    expect(run.filledBy).toBe(filledBy.name);
    expect(run.sent.filter((s) => s.text === messages.waitlistTaken)).toHaveLength(waitlist.length - 1);
    expect(fillFromWaitlist(run)).toBe(run);
  });

  it("does not fill a slot before the waitlist was texted", () => {
    const run = reply(start(), "confirm");
    expect(fillFromWaitlist(run)).toBe(run);
  });

  it("waits for both the new time and the filled slot before moving on", () => {
    const noShow = toNoShow();
    expect(canAdvance(noShow)).toBe(false);
    expect(canAdvance(reply(noShow, "thu"))).toBe(false);
    expect(canAdvance(fillFromWaitlist(noShow))).toBe(false);
    expect(canAdvance(fillFromWaitlist(reply(noShow, "thu")))).toBe(true);
  });

  it("asks for a review once, after the visit", () => {
    const run = toAfterVisit();
    expect(run.phase).toBe("after-visit");
    expect(run.lena).toBe("seen");
    expect(run.thread.filter((t) => t.text === messages.review)).toHaveLength(1);
    expect(choices(run).map((o) => o.id)).toEqual(["happy", "meh"]);
  });

  it("a happy patient gets the review link and nothing more", () => {
    const run = reply(toAfterVisit("fri"), "happy");
    expect(run.review).toBe("happy");
    expect(run.phase).toBe("done");
    expect(choices(run)).toHaveLength(0);
    expect(canAdvance(run)).toBe(false);
  });

  it("an unhappy patient is asked what went wrong, privately, and never for a review", () => {
    const asked = reply(toAfterVisit("fri"), "meh");
    expect(asked.thread.at(-1)?.text).toBe(messages.feedbackAsk);
    const run = reply(asked, "wait");
    expect(run.review).toBe("feedback-sent");
    expect(run.phase).toBe("done");
    expect(run.thread.some((t) => t.text === messages.reviewLink)).toBe(false);
  });

  it("gives every logged message its own id", () => {
    const run = reply(toAfterVisit(), "happy");
    expect(new Set(run.sent.map((s) => s.id)).size).toBe(run.sent.length);
  });
});
