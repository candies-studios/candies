# Content gaps: information to supply before or after launch

Nothing below was invented. Each item was missing from (or not usable on) the old site. Every section that depends on one of these items is built to hide or degrade gracefully until it is filled in.

## High priority

| # | Item | Where to add it | Notes |
|---|---|---|---|
| 1 | **Case studies** | `src/content/projects.ts` | The old portfolio held only a theme demo ("Activation / London Barbershop", lorem ipsum). For each project, add the client, category, overview, challenge, approach, deliverables and images, plus **verified** results only. Until then, /work shows the client roster by sector and a "Request our credentials" call to action. |
| 2 | **Contact form delivery** | Hosting environment variables | Set the Resend and/or webhook variables (see README §3). Until then, the form shows an error message instead of accepting enquiries. |
| 3 | **Social media links** | `src/content/site.ts → social` | The old contact page had a "Social" heading with no links. |
| 4 | **Run `npm run assets:pull`** | — | Run it before the WordPress site goes offline, then commit `public/media/`. |

## Medium priority

| # | Item | Where | Notes |
|---|---|---|---|
| 5 | Budget ranges on the form | `src/lib/enquiry.ts → budgetOptions` | These are placeholder ranges in INR with USD equivalents. Adjust them to match how the studio prices work. |
| 6 | ~~ADMA: full name and sector~~ | `src/content/clients.ts` | Resolved: the logo reads "ADMA Biologics", listed under Healthcare & Life Sciences. |
| 7 | Client sectors | `src/content/clients.ts` | The sector grouping (Banking & FS, Payments, FMCG & Consumer, Media) is editorial. Confirm it, or rename the groups. |
| 8 | Founding year and milestones | `src/app/about/page.tsx` (Our story) | The story section is written without dates. Add a year or milestones if you'd like them shown. |
| 9 | WhatsApp business number | env `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional. |
| 10 | Team bios / LinkedIn | `src/content/team.ts` | Optional. Current names and roles are copied exactly from the old About page. |
| 11 | Higher-resolution client logos | `public/media/clients/` | The old site only served 200×50 PNGs. SVGs from each client's brand kit would look sharper. |
| 12 | Official vector logo | `public/media/brand/` | The header uses the original candy-ball mark next to a typeset wordmark. Add an SVG of the full logo if you prefer that in the header. |

## Low priority / when ready

- **Insights articles** (`src/content/insights.ts`). The old blog had only the default "Hello world!" post.
- **Upcoming studio events.** The Morning Coffee Groove event (10 Jan 2026) is listed on /services/events under "From the studio". Add or replace events in `src/content/services.ts → studioEvents`.
- **Verified figures** (projects completed, years active, etc.). The old homepage counters displayed "0". They were removed, and the only figure kept is the verified "25+ years of combined creative experience".
- **USA address.** The Sheridan, WY address is shown exactly as on the old site. If it is a registered-agent address rather than a working office, consider labelling it "Registered office" in `site.ts`.
