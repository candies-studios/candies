# Stage 1–2: Website audit and design strategy

_Audit of www.candies.studio, November 2026_

## 1. Audit findings

### Platform

WordPress with a commercial creative-agency theme, WPBakery and Revolution Slider. The page title on the homepage still reads "Just another WordPress site", and the footer says © 2023.

### Structure found

| Page | URL | State |
|---|---|---|
| Home | `/` | Hero ("Elevate your brand's story"), intro, four services, client logo carousel, "Global Footprint", CTA. The stat counters render as **0**. |
| About Us | `/about-us/` | Values (Integrity, Collaboration, Honesty, Transparency), 9 team members, mantra, client logos. |
| Services | `/services/` | Design, Content, Digital Marketing, Events. **Content and Events blocks are duplicated** on the page. |
| Our Work | `/portfolio-pages/work/` | **Only a theme demo project** ("Activation", lorem ipsum, client "London Barbershop", dated 2016). |
| Blog | `/blog/` | **Only the default "Hello world!" post.** |
| Events | `/events/` | One genuine event: Morning Coffee Groove (Sat 10 Jan, Navi Mumbai). |
| Contact | `/contact-us/` | Addresses for Dubai, the USA and India; create@candies.studio; a basic 3-field form; a "Social" heading with no links. |

Navigation inconsistencies: the header links to Events, while the footer links to "Work" (the portfolio) and to `/home-creative-agency/` (a theme demo URL).

### Genuine assets inventoried (pulled by `scripts/fetch-assets.mjs`)

- **Logo:** candy-ball mark (rainbow-striped sphere) with the "CANDIES" wordmark in #5e79bb, plus favicon sizes.
- **Team (9):** Sushil Chandanshive (Founder & Creative Head), Hamza Hameed (WordPress Developer), Aditiya (3D Animator), Amarlis Vega (Consultant, USA), Arwa Lacchawala (UI/UX & Graphic Designer), Aswajit (Project Manager), Bharti Dand (Senior Graphic Designer), Shivam (Editor), Gajanan (Consultant).
- **Client logos (11):** Axis Bank, Kotak, SIDBI, L&T Finance, Worldline, Godrej Agrovet, Parachute, Borosil, Forbes India, Viacom18, ADMA.
- **Event poster:** Morning Coffee Groove.
- **Stock imagery** (Unsplash/Freepik backgrounds): deliberately **not** reused.

### Verified business facts used

- create@candies.studio
- Addresses in Navi Mumbai (India), Dubai (UAE) and Sheridan, WY (USA)
- "More than 25 years of combined creative knowledge and expertise"
- "Global Footprint" markets: US, UK, France, India, New Zealand, Australia (presented as markets, **not** offices)
- Mantra: "Imagine. Create. Inspire. Succeed. Repeat."

### Problems fixed

- Template look and stock photography
- Zero-value counters
- Duplicated service blocks
- Demo portfolio and blog posts
- Missing social links
- Default WordPress page title
- No SEO metadata, structured data or Open Graph
- Weak contact form (3 fields, no qualification questions)
- Outdated copyright year
- Inconsistent navigation

## 2. Design strategy

### Positioning

An **independent creative and digital studio**: an integrated partner for corporate brands, especially banking/financial services, FMCG and media, which is where the client roster is strongest.

### Visual direction: "Candy, grown up"

- The rainbow candy-ball in the existing mark becomes the hero's 3D centrepiece: a glossy, clear-coated striped sphere, with supporting candy forms (rings, pills, spheres) in the brand palette. It is recognisably Candies, executed with premium restraint.
- **Ink** (#0b0c14) and **Paper** (#f4f1ec) alternate section by section, giving an editorial rhythm.
- The brand blue **#5e79bb** is retained from the logo. Berry, Mint, Honey and Grape come from the candy mark and are used only as small accents (one per service).

### Typography

- **Archivo** (wide, heavy, uppercase) for authority
- **Instrument Serif italic** for one emotive accent word per headline ("forward.", "impact.", "together.")
- **Inter Tight** for body text

### Motion language

Expo-out easing throughout:

- Headlines rise line by line from behind masks.
- Sections fade up once.
- Images reveal through expanding masks.
- Cards tilt subtly toward the cursor.
- Logos run in a slow two-way marquee.
- The capability columns expand on hover.

The 3D hero responds to the cursor and to scroll, and it pauses when off-screen. Every effect has a reduced-motion fallback.

### Conversion

- "Start a Project" is persistent in the navigation.
- Every page ends with a call to action, and every service page has its own enquiry button that pre-selects the service.
- The contact form is qualifying: company, country, service, budget and description.
- A "What happens next?" panel sets expectations.
- An analytics lead event fires on successful submission.
