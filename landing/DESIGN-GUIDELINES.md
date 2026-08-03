# Mindenity landing — section-by-section design guidelines

Research from Mobbin, 2026-08-03. Each section maps our current implementation
to the strongest reference pattern found, with concrete changes. References are
Mobbin links — open to view full-resolution.

The through-line of everything below: our page inherited a **DeFi protocol's
narrative structure** (product lines → markets → integrations → protocol
stats). Health products sequence differently: **empathy hook → how it works →
proof by humans → pricing → recruitment**. The restructure matters more than
any individual section's styling.

---

## Recommended page order (restructured)

| # | Section | Today | Change |
|---|---------|-------|--------|
| 1 | Hero | ✅ exists | Add trust strip + benefit-led alternates |
| 2 | **Concern picker** | ❌ missing | NEW — "What are you facing?" chips |
| 3 | **How it works** | ❌ missing | NEW — 4 steps, our biggest gap |
| 4 | App feature showcase | ⚠️ mockups only | Feature cards w/ phone crops |
| 5 | Plans | ✅ exists | Real pricing cards w/ "Most chosen" |
| 6 | Safety / trust | ✅ exists | Add clinical-team photos row |
| 7 | **Testimonials** | ❌ missing | NEW — needs real quotes from you |
| 8 | For therapists | ✅ exists | Recruitment framing, photo, apply CTA |
| 9 | FAQ / Newsletter / Footer | ✅ fine | Keep |

---

## 1. Hero

**Reference:** [Headspace "Everything your mind needs"](https://mobbin.com/sites/sections/5b44d3ff-891d-4add-9f5f-53b903bb1800) · [Hims "Even better in the app"](https://mobbin.com/sites/sections/2de53611-137f-4d96-a002-586e2d245ac7) · [Headspace classic split hero](https://mobbin.com/sites/sections/859303e7-7eed-4b0e-b4e9-af4c6c612fa1)

What the references do that we don't:
- **Benefit-led headline** ("Everything your mind needs") vs our poetic "Care
  that fits your life". Theirs answers *what do I get*; ours answers nothing
  concrete. Keep the emotional register but add the concrete: e.g.
  `Your therapist, your tools, your pace.`
- **Split layout** — copy left, imagery right (Headspace) reads calmer than our
  centered stack; centered works too but demands shorter copy.
- **Warm tinted background** (Headspace's blush/cream) vs our white→#F0F2F8.
  Consider a warmer tint of the sage/navy family.
- **One primary CTA above badges.** Headspace: single "Try for $0" button; store
  badges live in the footer hero (Hims pattern). We lead with two store badges
  and no action for web visitors. Add `Find my plan` back as the primary button,
  badges beneath.

Concrete: headline swap options, primary CTA `Find my plan`, trust strip under
badges — `Licensed therapists · NDPR compliant · From ₦30,000/session`.

## 2. Concern picker (NEW)

**Reference:** [Headspace "What kind of headspace are you looking for?"](https://mobbin.com/sites/sections/5b44d3ff-891d-4add-9f5f-53b903bb1800) (bottom of that section)

Chips — *Stress less*, *Sleep soundly*, *Manage anxiety* — each with a small
icon, directly under the hero. We have the exact content for this: the **13
concern areas** from the brief (Loss & Grief, Family Conflict, Workplace
Stress…). Show 6–8 + "See all". Each chip deep-links to `Find my plan` with the
category pre-selected (mirrors the real in-app intake, brief §5.4).

This is the single cheapest section to add and it makes the page *about the
visitor* immediately.

## 3. How it works (NEW — biggest gap)

**Reference:** [Hims "How it works"](https://mobbin.com/sites/sections/9014405b-dcc4-44ca-bc3a-c725a0dbb86a) — the model to copy. Also [Maxima Therapy](https://mobbin.com/sites/sections/975a61f8-c018-4d2f-8511-a62d89f9885b) for the reassurance-first framing ("We understand this can be a big step"), and [Upwork's numbered 1-2-3-4](https://mobbin.com/sites/sections/9e3f57fc-198b-48ee-8ce9-fe488251d984).

Hims: one headline, four columns, icon + bold step + two lines each, one CTA.
Ours, grounded in Epic 1 (intake → 3 matches → suggested plan):

1. **Tell us what you're facing** — A short intake: your concerns, urgency, and
   how you'd like to meet.
2. **Meet your matches** — Three therapists matched to you. Browse freely if
   you'd rather choose yourself.
3. **Pick your plan** — Pay per session or subscribe monthly. Naira or dollars.
4. **Start, at your pace** — Video, voice or chat. Your therapist checks in
   between sessions.

Steal Maxima's empathy lead-in as the section subhead: *"Starting therapy is a
big step. We made the first one small."*

## 4. App feature showcase

**Reference:** [PayPal feature cards](https://mobbin.com/sites/sections/779990c5-bf1c-43f3-9f95-2e2f74aade46) — two cards, each: phone crop + benefit headline + ✓ checklist + CTA. Clean, no carousel.

We have three real mockups already in the hero. Reuse crops in 2–3 cards:
- **Track how you're doing** — mood, sleep and stress scores (✓ daily check-ins
  ✓ weekly trends ✓ shareable with your therapist)
- **Someone to talk to, anytime** — AI companion + crisis line access
- **Your sessions, your way** — video/voice/chat, booking, reminders

Note: mood tracking is Pro-tier per the feature matrix — caption accordingly or
keep the checklist tier-neutral.

## 5. Plans

**Reference:** [TravelPerk "Plans that get you places"](https://mobbin.com/sites/sections/7960b30e-a40a-4ef8-b4e2-89d4c80cb113) — the shape to copy: big price, "Most Popular" badge on middle card, one-line who-it's-for, CTA per card. [Teachable](https://mobbin.com/sites/sections/46238516-3b83-4bad-812b-22f6ac7ab2be) for the ✓-feature list per card; [OpenTable](https://mobbin.com/sites/sections/0c81e36a-14f6-471d-9ce7-8930b284a9f2) for badge-per-card labels ("Free to try / Most popular / Most features").

Our current cards show segment + price range + plan-name chips — no features,
no emphasis, no CTA. Change to TravelPerk shape per segment tab (Individual /
Couple / Family), with the PAYG→Lite→Pro ladder inside each:
- Big price (`₦120,000/mo` `·` `$229/mo` toggle by region)
- Badge: `Balance — Most chosen`
- 3–4 ✓ features from the real matrix (60-min sessions, dedicated therapist,
  Crisis Support Access, unlimited AI chat)
- CTA per card + `Compare all features` link (Maze pattern)

## 6. Safety / trust → add humans

**Reference:** [Function "Built with the world's top doctors"](https://mobbin.com/sites/sections/5ec773ad-b8b9-406d-a649-315bdc05911a) · [Biograph "Trusted medical leadership"](https://mobbin.com/sites/sections/1c90aa5d-fe51-456e-8c9c-584661cd3f4c) · [Headspace Health advisors](https://mobbin.com/sites/sections/b7bb5a18-25aa-4a68-8887-d5b986853d5c)

Every credible health product shows **faces with credentials** — photo grid,
name, MD/qualification, affiliation. Our Trusted section is all abstract
capability stats. Keep the stats row, add a "Clinical leadership" photo row
above the crisis block. **[NEEDS INPUT: real names/photos/credentials — do not
fabricate people.]**

## 7. Testimonials (NEW)

**Reference:** [Sprout Social review cards](https://mobbin.com/sites/sections/15b459ef-ab1a-4648-8f36-940ab45d4731) — 3 cards: bold quote-title, stars, excerpt, avatar + name/role. [Headspace stats strip](https://mobbin.com/sites/sections/0d08f4fc-2821-48c3-8578-12722b861f21) (4.9 Stars · 611.9K Ratings · 70M Downloads) for when real numbers exist.

**[NEEDS INPUT: real quotes.]** For mental health, anonymized first-name quotes
are the norm ("Ada, Lagos — Individual plan"). Never invent them. If beta
feedback exists, 3 quotes is enough; skip stars until app-store ratings are real.

## 8. For therapists → recruitment framing

**Reference:** [Miro "Reach new clients"](https://mobbin.com/sites/sections/705312cf-11f6-4697-aa18-b4199d55d246) — dark section, big benefit headline, short pitch, `Apply now`, photo of a professional. [Webflow "Become an Expert"](https://mobbin.com/sites/sections/1c99e8e1-0b57-43c1-a8c8-8c73df6ec351) for split layout + requirements/benefits below.

Ours currently mimics a consumer section (store badges CTA). Recruitment reads
differently: benefit headline (`Reach new clients` → ours: `Grow your practice,
keep your standards`), `Apply to join` as primary CTA (bring it back — a
therapist can't onboard via app download), keep the 4 capability tiles as the
benefits row. The dark treatment (Miro) would also break up our two adjacent
light sections.

## 9. Keep as-is

FAQ (accordion works, right questions), Newsletter, Footer. The crisis block
stays — no reference pattern for it because most products don't have one; ours
follows brief §7.2 and that's the correct authority.

---

## Cross-cutting observations from the references

1. **Warm neutrals, not white.** Headspace/Function/Maxima all sit sections on
   cream/blush/sand. Our white + #F0F2F8 reads clinical. A warm paper tint
   (`#FAF8F4`-ish) between white sections would soften the whole page.

2. **One primary action per section.** Every reference has exactly one filled
   CTA per section. We have several sections with two soft CTAs of equal weight.

3. **Numbers only when real.** Headspace leads with 70M downloads; Function
   with named Harvard/Stanford doctors. Until we have real numbers/people, the
   Hims pattern (process clarity, no stats) is the honest template — which is
   exactly the how-it-works section we're missing.

4. **Serif italic accent is validated.** Function uses "How it *works*" with the
   same italic-accent device we already have. Keep it.

---

## Suggested build order

1. **How it works** — biggest gap, zero new assets needed
2. **Concern picker** — cheapest, high impact, content already in the brief
3. **Plans upgrade** — real prices exist; TravelPerk shape
4. **Hero polish** — trust strip, primary CTA, headline options
5. **Therapist recruitment reframe** — copy + CTA change mostly
6. **Feature showcase** — needs mockup crops
7. Testimonials + clinical team — **blocked on real content from you**
