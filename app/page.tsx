import Link from "next/link";
import { primaryButton } from "@/components/buttons";
import { CalendarIcon, StarIcon, TextIcon, UsersIcon } from "@/components/icons";
import { ProductLogo } from "@/components/logo";
import { PhoneFrame, ThreadHeader } from "@/components/phone-frame";
import { business } from "@/lib/demo/business";

// The landing page (DEMO-STANDARD.md, "What they get"). It sells the idea by
// itself and opens the demo with one press. "Try the demo" is a plain link:
// opening the demo writes nothing on a server (ADR 0001).
// Copy rules: no prices, no statistics, no setup-time claims, no phone numbers.
// The words follow tekguyz-one brand/solutions.md, package C.

const demoHref = "/demo";

const steps = [
  { title: "A reminder before the visit", body: "A friendly text the day before. The patient can confirm with one reply." },
  { title: "A no-show gets a new time", body: "If they don't come, a kind text offers new times, or a call from your front desk." },
  { title: "The open chair gets filled", body: "Your short-notice waitlist hears about the open slot. The first to reply takes it." },
  { title: "A review request after", body: "One message asks how it went. Happy patients get your review link. Others reach your team, privately." },
];

const deskGets = [
  { icon: <CalendarIcon />, text: "The day's schedule, with who confirmed, who didn't come, and who took the open chair." },
  { icon: <UsersIcon />, text: "A short-notice waitlist that is texted for you, and told when a spot is taken." },
  { icon: <TextIcon />, text: "Every message that went out, in one list, so nobody wonders what a patient was told." },
  { icon: <StarIcon />, text: "Reviews asked for once, never nagged, and unhappy answers sent to you instead of online." },
];

export default function LandingPage() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-[72rem] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label="No-Show Rescue, home">
          <ProductLogo />
        </Link>
        <Link href={demoHref} className={`${primaryButton} max-sm:hidden`}>
          Try the demo
        </Link>
      </header>

      <main id="main" className="flex-1">
        <section className="mx-auto grid w-full max-w-[72rem] items-center gap-12 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:pt-14 lg:pb-24">
          <div>
            <p className="text-label text-brand">For dental and vet practices</p>
            <h1 className="mt-3 max-w-[13ch] font-display text-display">Fewer empty chairs.</h1>
            <p className="mt-5 max-w-[52ch] text-body text-ink-muted">
              Patients get a reminder before a visit. When someone doesn&apos;t come, they get a new time offered by text, and the open
              slot goes to your waitlist. After the visit, happy patients are asked for a review.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href={demoHref} className={primaryButton}>
                Try the demo
              </Link>
              <p className="text-label font-normal text-ink-muted">One click. No signup. Nothing is sent.</p>
            </div>
          </div>
          <HeroPreview />
        </section>

        <section aria-labelledby="how" className="border-y border-line bg-surface">
          <div className="mx-auto w-full max-w-[72rem] px-4 py-16 sm:px-6">
            <h2 id="how" className="font-display text-headline">
              How it works
            </h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-2">
                  <span className={`flex size-9 items-center justify-center rounded border-[1.5px] font-display text-label ${i === 1 ? "border-gap text-gap" : "border-brand text-brand"}`}>
                    {i + 1}
                  </span>
                  <h3 className="font-display text-title">{s.title}</h3>
                  <p className="text-body text-ink-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="desk" className="mx-auto grid w-full max-w-[72rem] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 id="desk" className="font-display text-headline">
              What your front desk sees
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {deskGets.map((line) => (
                <li key={line.text} className="flex gap-3 text-body">
                  <span className="mt-0.5 shrink-0 text-brand">{line.icon}</span>
                  {line.text}
                </li>
              ))}
            </ul>
          </div>
          <SchedulePreview />
        </section>

        <section aria-labelledby="try" className="bg-night text-on-night">
          <div className="mx-auto flex w-full max-w-[72rem] flex-col items-start gap-5 px-4 py-16 sm:px-6">
            <h2 id="try" className="max-w-[24ch] font-display text-headline">
              See it with a made-up dental practice
            </h2>
            <p className="max-w-[60ch] text-body text-on-night-muted">
              The demo plays {business.name}, a made-up practice. You are the patient: get the reminder, miss the visit, pick a new time,
              and watch the front desk fill the open chair from the waitlist. Nothing is sent, and nothing leaves your browser.
            </p>
            <Link href={demoHref} className={primaryButton}>
              Try the demo
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-[72rem] flex-wrap items-center justify-between gap-3 px-4 py-6 text-label font-normal text-ink-muted sm:px-6">
        <p>No-Show Rescue</p>
        <p>
          Built by{" "}
          <a href="https://tekguyz.com" className="inline-flex min-h-11 items-center underline underline-offset-4">
            TEKGUYZ
          </a>
        </p>
      </footer>
    </>
  );
}

/** A still picture of the flow, drawn with the demo's own phone. Decorative. */
function HeroPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[24rem] pb-10">
      <PhoneFrame time="10:16" className="mx-auto aspect-[9/19.5] w-[18.5rem] max-w-full">
        <ThreadHeader />
        <div className="flex flex-col gap-2 px-3.5 py-3">
          <p className="max-w-[82%] rounded-[1.15rem] rounded-bl-[0.35rem] bg-bubble-out px-3.5 py-2 text-label font-normal text-white">
            Hi Lena, we missed you at 10:00 AM today. No worries. Want a new time?
          </p>
          <p className="self-end rounded-[1.15rem] rounded-br-[0.35rem] bg-night-raised px-3.5 py-2 text-label font-normal">Thu 2:30 PM</p>
          <p className="max-w-[82%] rounded-[1.15rem] rounded-bl-[0.35rem] bg-bubble-out px-3.5 py-2 text-label font-normal text-white">
            You&apos;re booked for Thu 2:30 PM. We&apos;ll send a reminder the day before.
          </p>
        </div>
      </PhoneFrame>
      <div className="absolute inset-x-0 bottom-0 rounded border-[1.5px] border-ink bg-surface p-4 text-ink sm:-right-6 sm:left-auto sm:w-[19rem]">
        <p className="flex items-center gap-2 text-label">
          <UsersIcon width={16} height={16} className="text-brand" /> Open chair filled from the waitlist
        </p>
        <p className="mt-1 text-label font-normal text-ink-muted">Marco T. took 10:45 AM, hygiene chair.</p>
      </div>
    </div>
  );
}

function SchedulePreview() {
  const rows = [
    ["9:15 AM", "Sofia R.", "Confirmed", "muted"],
    ["10:00 AM", "Lena M.", "No-show · rebooked", "brand"],
    ["10:45 AM", "Marco T.", "From the waitlist", "brand"],
    ["11:00 AM", "Dev P.", "Confirmed", "muted"],
  ] as const;
  return (
    <div aria-hidden className="rounded border border-line p-4">
      <p className="flex items-center gap-2 font-display text-title">
        <CalendarIcon className="text-brand" /> Tuesday
      </p>
      <ul className="mt-3">
        {rows.map(([time, name, badge, tone]) => (
          <li key={time} className="flex items-center justify-between gap-3 border-t border-line py-2.5 first:border-t-0">
            <span className="flex min-w-0 gap-3 text-label">
              <span className="w-18 shrink-0">{time}</span>
              <span className="truncate">{name}</span>
            </span>
            <span className={`shrink-0 rounded px-2 py-0.5 text-micro font-semibold ${tone === "brand" ? "bg-brand-soft text-brand" : "bg-sunk text-ink-muted"}`}>{badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
