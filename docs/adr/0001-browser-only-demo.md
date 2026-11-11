# The demo runs in the browser, with no backend

The TEKGUYZ demo standard expects a Supabase anonymous sign-in per Demo Visitor. For No-Show Rescue we chose a browser-only demo instead, like FancyFam and Missed Call Follow-Up (their ADR 0001). The sample schedule ships with the app. The demo clock, the texts and the waitlist live in the page's own memory, and a reload starts over. Every visitor is walled off by design, nothing costs money, and there is no sign-in, visit cap or cleanup job to build.

Nothing is ever sent. The reminder, the no-show text, the waitlist offers and the review request are drawn on a phone and listed under "What would go out"; no SMS, email or AI call leaves the browser. A real setup for a client is a separate job, built for that practice's scheduling system. Clinic privacy rules are still open in `tekguyz-one` `docs/KNOWN_GAPS.md`; this demo uses only made-up data, so they do not apply to it.

All rules live in one pure engine (`lib/demo/engine.ts`) that a real backend could replace.

## Consequences

- The standard's server rules (POST-only sign-in, RLS walls, visit cap, 7-day cleanup) have nothing to guard. Do not "fix" the demo by adding them.
- "Try the demo" is a plain link, because opening the demo writes nothing on a server.
- The landing page has no form and no sign-in page; the footer credit is the only way to get in touch.
