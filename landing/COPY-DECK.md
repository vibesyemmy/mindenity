# Mindenity landing — copy deck (v2)

Replacement copy for every placeholder slot inherited from the aave.com scrape.

**Sources of truth**, in precedence order:
1. `Mindenity_Pricing_Design_Brief.docx` — v1.0, plan architecture, feature matrix, crisis tone rules
2. `Mindenity_UserStories_v5_1.docx` — v5.0 May 2026, 13 epics, personas, dual-region pricing
3. Repo (`admin/`, `design-system/`) — implementation, **stale on pricing, see Corrections**

---

## Corrections to v1 of this deck

Reading the docs overturned four things I had inferred from the repo.

| # | v1 said | Docs say |
|---|---|---|
| 1 | Entry price ₦20,000 / $30 | **₦30,000 / $55** — `admin/lib/dummy/plans.ts` is wrong (see Data defect) |
| 2 | "Mindenity Pro" is a product line | **"Pro" is a tier name** (PAYG / Lite / Pro). There is no Pro product |
| 3 | "Mindenity Kit" might be real | **It is not.** No epic, no story, no mention. Delete the section |
| 4 | Nigeria-first, NGN only | **Dual-region by design** — NGN track and USD track, never converted |

### Data defect — admin pricing disagrees with the brief

`admin/lib/dummy/plans.ts` diverges from both docs, worst on Individual:

| Plan | Docs (NGN) | admin dummy | Docs (USD) | admin dummy |
|---|---|---|---|---|
| Essential | ₦30,000 | ₦20,000 | $55 | $30 |
| Balance | ₦120,000 | ₦40,000 | $229 | $80 |
| Thrive | ₦350,000 | ₦80,000 | $459 | $160 |
| Restore | ₦450,000 | ₦480,000 | $475 | $480 |
| Family Thrive | ₦650,000 | ₦600,000 | $679 | $800 |

Together / Harmony / Home / Family Care match on NGN. **Treat the docs as correct**
and fix the admin fixture separately.

---

## Positioning

From the brief, verbatim intent: a **premium digital mental wellness platform built
for the Nigerian market**, to read as *culturally sensitive, clinically credible and
emotionally safe* — explicitly **not** a generic SaaS pricing page.

From the user stories: dual-region. Nigeria pays NGN, international pays USD, at
**30% below BetterHelp's 2026 reference rates** — "premium-quality but more
accessible global alternative". The two are **separate pricing tracks, not
conversions**.

Voice: warm, plain, unhurried. Second person. Never alarmist. No diagnosis or
outcome promises.

---

## Section mapping (revised)

The scrape's four themed containers, re-purposed to real product:

| Container | Was | Becomes |
|---|---|---|
| 1 — light/purple | Hero "Savings for Everyone" | **The app** |
| 2 — dark | "Mindenity Pro / Markets" | **Plans — Individual, Couple, Family** |
| 3 — purple | "Mindenity Kit / partners" | **For therapists** |
| 4 — light | "Trusted / yield chart" | **Clinical safety & privacy** |

---

## 1. Hero — the app

| Slot | Copy |
|---|---|
| Eyebrow | `Mindenity` |
| Headline | `Care that` + *`fits your life`* |
| Subhead | `Licensed therapists, an AI companion that listens between sessions, and tools for your mood, sleep and stress — priced for where you live.` |
| Primary CTA | `Get started` |
| Secondary CTA | `Find my plan` |

`Find my plan` is the real in-app flow ("Not sure? Find my plan" — brief §5.4).

Phone-mockup labels (`Earned` / `Past Week` / `Today`):
`Mood` · `Past week` · `Today`

Alternates: `Support that` *`speaks your language`* · `Therapy,` *`made reachable`*

---

## 2. Plans (dark section)

| Slot | Copy |
|---|---|
| Eyebrow | `Plans` |
| Headline | `Care for` *`every`* `season.` |
| Subhead | `Nine plans across three segments. Start with a single session, or commit to weekly work — you choose the intensity.` |
| Primary CTA | `See all plans` |
| Secondary CTA | `Find my plan` |
| Section headline | `Priced for` *`where you are`* |
| Section subhead | `Nigeria pays in naira. Everywhere else pays in dollars, at rates set 30% below the global standard.` |

Three cards replacing the four market cards. Prices are entry (PAYG) tier.

| Card | Badge | Body | Chips |
|---|---|---|---|
| `Individual` | `From ₦30,000 / $55` | `One-to-one therapy for anxiety, stress, grief and the weight of everyday life.` | `Essential` `Balance` `Thrive` |
| `Couple` | `From ₦50,000 / $62` | `Two people, one room. For conflict, trust, grief and life after a big change.` | `Together` `Harmony` `Restore` |
| `Family` | `From ₦100,000 / $85` | `Up to five people. For parenting strain, adolescent support and family transition.` | `Home` `Family Care` `Family Thrive` |

**Do not abbreviate prices** — brief §1: always `₦120,000`, never `₦120k`, unless
space forces it, then consistently.

---

## 3. For therapists (replaces Kit)

Grounded in Epic 8 (onboarding & verification) and Epic 13 (profit sharing).

| Slot | Copy |
|---|---|
| Eyebrow | `For therapists` |
| Headline | `Practise` *`with Mindenity`* |
| Subhead | `Set your own availability, choose the plans you accept, and reach clients in Nigeria and abroad.` |
| Primary CTA | `Apply to join` |
| Secondary CTA | `How verification works` |
| Section headline | `Your practice,` *`your terms.`* |
| Section subhead | `You control your schedule, your session lengths and which plans you take.` |

Four capability tiles replacing the partner-logo rail (**delete the logos** —
MetaMask, J.P. Morgan, Kraken, Ethena, Whop, Cap assert relationships that don't exist):

| Tile | Body |
|---|---|
| `Set your hours` | `Weekly availability in your own timezone. Clients see their local time.` |
| `Choose your plans` | `Accept only the segments and tiers you want to work in.` |
| `Local and global clients` | `Serve Nigeria in naira and international clients in dollars.` |
| `Transparent earnings` | `Tiered commission with performance bonuses, and a clear payout schedule.` |

---

## 4. Clinical safety & privacy

| Slot | Copy |
|---|---|
| Headline | `Safe by` *`design`* |
| Subhead | `Every therapist verified before their first session. Every risk flag seen by a person.` |
| Primary CTA | `Our safety approach` |
| Secondary CTA | `View careers` |

Stat row — capability statements, **no invented scale** (see Do not fabricate):

| Stat | Caption |
|---|---|
| `Verified` | `Licence and identity checked before any therapist takes a client.` |
| `13 areas` | `From grief and burnout to trauma and crisis support.` |
| `NDPR + GDPR` | `Nigerian and international privacy standards.` |
| `NGN + USD` | `Separate pricing tracks, never a surprise conversion.` |

Closing block — replaces "home of stablecoins" and the yield chart:

> **`When it's urgent, you're not alone.`**
> `Crisis Support Access connects you straight to your therapist or a support line. Flag something urgent at intake and you get priority matching, with a therapist responding within 30 minutes.`

**Cut the comparison chart** — it plots Aave yield against T-Bills; no honest
analogue exists, and a chart is the wrong shape for a safety claim.

⚠️ **Crisis tone rules (brief §7.2) — apply to all crisis copy on the site:**
- The label is `Crisis Support Access`. Never "Panic Attack Button", never "Emergency".
- No alarming language, no sirens, no red. Magenta, calm phrasing.
- The in-app line is *"You are not alone. Connect with your therapist now or call a crisis line."*

---

## 5. FAQ

| # | Question | Answer |
|---|---|---|
| 1 | `What is Mindenity?` | `A mental wellness platform pairing licensed therapists with an app that supports you between sessions — mood, sleep, journaling, guided breathing and an AI companion.` |
| 2 | `How do I find the right therapist?` | `A short intake asks what you're facing, how urgent it feels and how you'd like to meet. You get three matched therapists and a suggested plan. You can ignore both and browse freely.` |
| 3 | `What does it cost?` | `In Nigeria, individual therapy starts at ₦30,000 for a single session, with monthly plans at ₦120,000 for four sessions and ₦350,000 for eight. Couple and family plans are priced separately. International pricing is in US dollars, set around 30% below the global standard.` |
| 4 | `What if I need help urgently?` | `Crisis Support Access is available on Balance and Thrive plans, connecting you to your therapist or a support line. If you flag a crisis at intake, you're matched with priority and a therapist responds within 30 minutes. Mindenity is not an emergency service — if you are in immediate danger, contact your local emergency number.` |
| CTA | `More about Mindenity` | |

The last sentence of Q4 is a safety disclaimer. **Do not cut it.**

---

## 6. Newsletter

| Slot | Copy |
|---|---|
| Heading | `Stay updated` |
| Body | `Occasional notes on new features, therapist openings and mental health resources.` |
| CTA | `Notify me` |

---

## 7. Footer

| Column | Links |
|---|---|
| `Product` | `The app` · `Plans & pricing` · `Find my plan` |
| `Plans` | `Individual` · `Couple` · `Family` |
| `For therapists` | `Apply to join` · `Verification` · `Earnings` |
| `Support` | `Help centre` · `Crisis Support Access` · `FAQ` · `Contact` |
| `Company` | `About` · `Careers` · `Press` |
| `Legal & privacy` | `Terms` · `Privacy (NDPR)` · `Privacy (GDPR)` · `Data requests` |

Drop `Verify Contact`, `Governance`, `Bug Bounty`, `Brand`, `Documentation` — crypto-native.

---

## Header nav

| Group | Items |
|---|---|
| `Product` | `The app` — `Therapy, mood, sleep and an AI companion.`<br>`Plans & pricing` — `Nine plans in naira and dollars.`<br>`Find my plan` — `Answer a few questions, get a match.` |
| `Plans` | `Individual` — `One-to-one therapy.`<br>`Couple` — `Two people, one room.`<br>`Family` — `Up to five people.` |
| `Company` | `For therapists` — `Practise with Mindenity.`<br>`About` — `Our mission and clinical standards.`<br>`Help & support` — `Answers, contact and crisis resources.` |

---

## Reference — the 9 plans

| Plan | Segment | Type | Sessions/mo | Nigeria | International |
|---|---|---|---|---|---|
| Essential | Individual | PAYG | 1 | ₦30,000 | $55 |
| Balance | Individual | Monthly | 4 | ₦120,000 | $229 |
| Thrive | Individual | Monthly | 8 | ₦350,000 | $459 |
| Together | Couple (2) | PAYG | 1 | ₦50,000 | $62 |
| Harmony | Couple (2) | Monthly | 4 | ₦220,000 | $235 |
| Restore | Couple (2) | Monthly | 8 | ₦450,000 | $475 |
| Home | Family (5+) | PAYG | 1 | ₦100,000 | $85 |
| Family Care | Family (5+) | Monthly | 4 | ₦350,000 | $339 |
| Family Thrive | Family (5+) | Monthly | 8 | ₦650,000 | $679 |

Tiers: **PAYG** (Essential/Together/Home) · **Lite** (Balance/Harmony/Family Care) ·
**Pro** (Thrive/Restore/Family Thrive).

Tier highlights usable as landing proof points:

| | PAYG | Lite | Pro |
|---|---|---|---|
| Session length | 30 min | 60 min | 60 min |
| AI chat | 30 min | Unlimited | Unlimited |
| Dedicated therapist | — | ✓ | ✓ |
| Crisis Support Access | — | ✓ | ✓ |
| Weekly check-in | — | ✓ | ✓ |
| Mood / sleep / stress tracking | — | — | ✓ |
| Emergency contact integration | — | — | ✓ |

Note: the brief gates **mood tracking to Pro only**. If the landing hero shows a mood
widget, either caption it as a Pro feature or change the mockup.

---

## The 13 concern areas

Abuse & Violation Trauma · Loss, Grief & Separation · Family & Relationship Conflict ·
Violence, Crisis & Accidents · Workplace, Academic & Economic Stress · Health & Medical
Trauma · Identity & Social Trauma · Emotional & Internal Struggles · Addiction &
Behavioural Challenges · Child-Related Trauma & Development · Women — Pre & Post Birth
Support · Spiritual & Existential Concerns · Crisis & Immediate Support

---

## Do not fabricate

| Slot | Scrape value | Why |
|---|---|---|
| Years operating | `6+ Years` | Verifiable company fact |
| Clients supported | `50K+` | Traction claim |
| Sessions delivered | `180K+` | Traction claim |
| Volume | `$21.5B` | Financial claim |
| Security cert | `SOC 2 Type 2` | **Regulatory** — claiming an unheld audit is a false compliance statement |
| Partner logos | 6 named companies | **Asserts relationships that don't exist** |

The stat row above uses capability statements instead, all true by construction.
Swap in real figures when they exist.

---

## Open conflicts for the team

1. **Brand colour.** The brief specifies Navy `#1D2B6E`, Cyan `#1BBFE8`, Purple
   `#6B28A9`, Magenta `#D11B8A` with a cyan→purple→magenta gradient. The landing
   currently uses `#1B2452` + `#9BB167`, per later direction from the flyer.
   Later instruction wins, but the brief is now stale — worth reconciling.
2. **Typography.** Brief says Syne + Inter; the DS is Urbanist throughout.
3. **Crisis gating.** Brief §7.2 says the crisis button is pinned for "Balance or
   Thrive"; the feature matrix grants Crisis Support Access to all Lite and Pro
   plans (so also Harmony, Restore, Family Care, Family Thrive). FAQ Q4 above
   follows the matrix — confirm which is right.
4. **`Family Thrive`** is `active: false` in the admin fixture but fully priced in
   both docs. Confirm before listing publicly.
