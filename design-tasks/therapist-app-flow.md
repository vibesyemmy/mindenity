# Mindenity — Therapist App Flow

Companion to `client-app-flow.md`. Same conventions: each canonical screen has Purpose, User stories, Key elements, DS components. Audit pattern: **if no user-story backing, defer to V2 or kill.**

**Figma page:** `Therapist` (to be created; sits alongside the existing `Patient` page in the Mindenity-DS file).

**Source design system:** Same Mindenity-DS file (`qU7OupeoYyrtlNMEKi7ao5`). Some sections reused from Patient app (Top Nav, Avatar, Doctor Card, Schedule, etc.). New components may be needed for: Earnings dashboard, Commission tier badge, Payout statement.

---

## Status overview

- **Total canonical screens:** 51 (proposed)
- **Done:** 14
- **In progress:** 0
- **Pending:** 37

Per-flow status:
| Flow | Screens | Done | Pending |
|------|---------|------|---------|
| T1. Sign-up & Verification | 11 | 11 | 0 |
| T2. Practice Configuration | 3 | 3 | 0 |
| T3. Schedule (tab) | 5 | 5 | 0 |
| T3-setup. Onboarding (Availability + Welcome) | 4 | 4 | 0 |
| T4. Home Dashboard | 1 | 1 | 0 |
| T5. Client Roster | 2 | 2 | 0 |
| T6. Session Lifecycle | 3 | 3 | 0 |
| T7. Crisis Response | 1 | 1 | 0 |
| T8. Earnings & Payouts | 6 | 0 | 6 |
| T9. More / Settings | 2 | 2 | 0 |
| T10. Search & Notifications | 2 | 0 | 2 |

---

## User stories — therapist coverage

| US | Title | Flow |
|---|---|---|
| US-003 | Set Weekly Availability Schedule | T3 |
| US-004 | Set Session Duration and Buffer Time | T3 |
| US-005 | Mark Specific Dates as Unavailable | T3 |
| US-006 | View Client Bookings in Availability Calendar | T3, T4 |
| US-021 | Register as a Therapist | T1 |
| US-022 | Set Custom Session Pricing Within Plan Bands | T2 |
| US-023 | Verify Therapist Applications (status side) | T1 |
| US-025 | Complete Post-Session Risk Assessment | T6 |
| US-026 | Respond to Client Crisis Support Alert | T7 |
| US-027 | Therapist Selects Accepted Subscription Plans | T2 |
| US-034 | Therapist Views Client Plan Details Before Session | T5, T6 |
| US-038 | Therapist Sets International Profile Visibility | T2 |
| US-040 | Multi-Timezone Session Scheduling | T3, T6 |
| US-041 | International Therapist Onboarding and Earnings | T1, T8 |
| US-043 | Platform Calculates and Displays Therapist Commission Tier | T8 |
| US-044 | Therapist Views Earnings Dashboard with Commission Breakdown | T8 |
| US-045 | Platform Auto-Activates Tier+ | T8 |
| US-046 | Platform Removes Tier+ | T8 |
| US-048 | Therapist Receives Itemised Payout with Commission Breakdown | T8 |

---

## Flow T1 — Sign-up & Verification

Onboarding for new therapists. Credentials upload → admin review → approved/rejected pathway. Region-aware (NG vs International per US-041).

### - [x] T1.0 Splash
- **Status:** ✅ Done 2026-05-20 — frame `24632:297386` in Therapist page > Flow T1 section, placed at (100, 100).
- **Purpose:** Cold-launch loading state. Logo + brief loader while auth/region detection runs. Hands off to T1.1 Welcome on first launch, or directly to T4.1 Home if already signed in.
- **User stories:** US-021, US-036
- **Source template:** `24319:242538` (Patient 1.1 Splash).
- **DS components used:** Logomark, Loader Base, iPhone X status bar, Home Indicator.
- **Final copy:** Loading… (loader spinner only — no other text)

### - [x] T1.1 Welcome
- **Status:** ✅ Done 2026-05-20 — frame `24632:296971` in Therapist page > Flow T1 section (`24632:296970`, created), placed at (100, 100).
- **Purpose:** Brand intro for therapist-side launch. Sets practice-oriented framing + dual entry (Apply / Sign in) + T&C consent.
- **User stories:** US-021
- **Source template:** `24319:242562` (Patient 1.2a Welcome — Brand intro). Same structure, therapist copy.
- **DS components used:** Logo/Logomark, heading + supporting text, T&C checkbox, Primary Button, Link.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Heading | Practice with Mindenity |
  | Subtitle | Bring your practice to a calm, well-paying platform — where Africa meets the world. |
  | T&C checkbox | I agree to the Therapist Terms and Privacy Policy |
  | Primary CTA | Apply to join |
  | Secondary link | Already a Mindenity therapist? Sign in |
- **Cleanup:** Patient-side `Welcome to Mindenity — Your Path to a Clearer Mind` heading + therapy-and-AI subtitle → therapist-practice framing; `Terms & Conditions and Privacy Policy` → `Therapist Terms and Privacy Policy`; `Get started` → `Apply to join`; sign-in link reframed for returning therapist.
- **Open polish:**
  - Tagline tone — confirm "where Africa meets the world" lands right; alt: "Built for therapists, refined for clients" or similar.
  - Need a separate Splash (loading) state? Currently this is the welcome landing, not a loading splash. Decide whether to add a Patient-1.1-style splash before this OR fold loading into this screen.

### - [x] T1.2 Sign up — basic info
- **Status:** ✅ Done 2026-05-20 — frame `24632:297176` in Therapist page > Flow T1 section, placed at (555, 100).
- **Purpose:** Account creation. Email + password only — name is captured on T1.4 (with specialisations); region on T1.5; T&C consented on T1.1.
- **User stories:** US-021
- **Source template:** `24319:243644` (Patient 1.4 Sign up form).
- **DS components used:** Input Text (email), Input Text (password with strength), Input Text (confirm password), Primary Button, Link.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Heading | Apply as a therapist |
  | Full name | Full name · Ada Okafor |
  | Email | Email address · your.name@email.com |
  | Password | Password · ***** · Password strength: weak |
  | Confirm | Confirm password · ***** |
  | Phone number | Phone number · +234 801 234 5678 |
  | Primary CTA | Sign up |
  | Link | Already a Mindenity therapist? Sign in |
- **Cleanup:** Patient `Create your Mindenity account` → therapist-specific `Apply as a therapist`; sign-in link reframed for returning therapist.
- **Open polish:**
  - **Name + Phone added (2026-05-21)** — `Full name` row inserted before Email; `Phone number` row inserted after Confirm. Both use plain Input Text pattern (no country-code picker for phone — flag as polish).

### - [x] T1.2a Email verification
- **Status:** ✅ Done 2026-05-21 — frame `24634:332438` in Therapist page > Flow T1 section, placed at (1465, 100). T1.3+ shifted right by 455.
- **Purpose:** OTP step after sign-up. 4-digit code sent to the email entered on T1.2. Per Patient 1.6 convention.
- **User stories:** US-021
- **Source template:** `24319:244090` (Patient 1.6 OTP verification — 4-digit Input Passcode pattern).
- **DS components used:** Heading, Input Passcode (4 digits), helper text, resend link, Primary Button.
- **Final copy:** `Enter your verification code` / `We sent a 4-digit code to ada.okafor@email.com. Enter it below to verify.` / `Didn't receive a code? Resend` / [Verify]
- **Open polish:** Email shown is placeholder — should bind to the email entered on T1.2. SMS fallback CTA (`Use SMS instead`) deferred since SMS-OTP requires phone-number verification path; for now email-only.
  - **Region selector** — also moved to T1.5 (after credentials). Could surface a passive auto-detect read here OR keep clean.

### - [x] T1.3 Professional credentials
- **Status:** ✅ Done 2026-05-20 (rebuilt twice — final uses Patient 2.3 wizard chrome) — frame `24633:300939` in Therapist page > Flow T1 section, placed at (1465, 100). Previous frames `24632:297278` + `24632:297463` deleted.
- **Purpose:** Upload practising licence, specialisation certificate, government ID. Required before admin review (US-023).
- **User stories:** US-021, US-023
- **Source template:** `24321:249404` (Patient 2.3 Personal info — wizard chrome with Progress + Skip). Form sections hidden; 3 File Upload Dropzone sub-frames moved in from previous `22404:2962`-based clone.
- **DS components used:** Top Nav, Section Header ("Credentials"), File Upload Dropzone ×3 (real Input File component with Browse File button + format guidance), Primary Button, footer privacy note.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Description | Required for verification before you take clients. |
  | Section header | Credentials |
  | Upload 1 | Practising licence · Browse your file to upload! · Supported Format: SVG, JPG, PNG (10mb each) · [Browse File] |
  | Upload 2 | Specialisation certificate · same upload widget |
  | Upload 3 | Government ID · same upload widget |
  | Primary CTA | Save & continue |
  | Footer note | Your documents are encrypted and never shared without your consent. |
- **Cleanup applied:**
  - **Rebuilt 2026-05-20** using Patient 2.3 wizard chrome (Progress label + Skip + Hero text). Form sections from 2.3 hidden; the 3 File Upload Dropzone widgets carried over.
  - Hero text set to `Verify your practice`; CTA `Continue` → `Save & continue`; Progress label `Step 3 of 6`.
  - Avatar upload area from 2.3 (irrelevant for credentials) hidden.
  - **Hidden Insurance Provider + Policy Number input rows** — kept just the upload widget pattern.
  - **Renamed Section Header** `Insurance (Optional)` → `Credentials`.
  - **Cloned the upload sub-frame ×2** to get 3 total uploads (Licence + Certificate + Government ID).
  - **Hidden `See All` link** on each upload header (not relevant for credentials).
  - **Progress + Skip re-enabled (2026-05-20)** — `Step 3 of 6` + `Skip` shown in top nav to match wizard chrome convention (per Patient 2.3 onboarding pattern).
  - **Description copy** `Please confirm and fill your identity below` → `Required for verification before you take clients.`
  - **CTA** `Continue` → `Save & continue`.
  - **Footer note** generic medical-detail privacy → encrypted/never-shared-without-consent claim.
- **Open polish:**
  - **Heading region (top nav rich heading)** appears hidden — template's `Is Heading Text` boolean is off. Toggle on + set Title Text "Add your credentials" if a heading is desired above the description.
  - **Format guidance** says `SVG, JPG, PNG (10mb each)` — but credentials should also accept **PDF**. Update Input File supported-formats text per upload type.
  - **Each upload's helper line is identical** — consider per-upload specifics (e.g. "NIN, passport, or driver licence" for Government ID).
  - **Upload progress / done state** — needs filename + size + remove affordance once a file is picked. Currently only the empty/upload state.

### - [x] T1.4 Specialisations & bio
<!-- TODO 2026-05-21: extend with `Headline` + `Years of practice` fields. Currently captured nowhere; needed for directory card signal. -->
- **Status:** ✅ Done 2026-05-20 (rebuilt same day with Patient 2.3 wizard chrome) — frame `24633:301004` in Therapist page > Flow T1 section, placed at (1920, 100). Original frame `24633:300080` deleted.
- **Purpose:** Capture clinical specialisations + a short bio. Drives Patient-side directory filters + therapist card preview.
- **User stories:** US-021
- **Source template:** `24321:249404` (Patient 2.3 Personal info — wizard chrome). Chip wrap + bio textarea sub-frames moved in from the previous 8.2b-based clone.
- **DS components used:** Top Nav, Hero text, Section Header, Button (chips) ×9, Input Textarea, Primary Button.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav | Background |
  | Hero | Tell clients what you specialise in |
  | Section | Your specialisations |
  | Chips | Anxiety · Depression · Trauma · Family · Couples · Sleep · Stress · Grief · Other |
  | Bio label | Short bio |
  | Bio placeholder | A few lines about your practice and approach. This is the first thing clients see. |
  | Primary CTA | Save & continue |
- **Cleanup:** Patient mood-entry chrome adapted — chips relabeled from life-areas (Work/Sleep/Family/Social/Exercise/Therapy/Money/Health/Other) to clinical specialisations; mood illustration left in place as visual anchor; second gratitude textarea hidden; CTA `Save entry` → `Save & continue`. **Top Nav switched to Progress variant (2026-05-20)** showing `Step 4 of 6` + `Skip` to match wizard convention.
- **Open polish (deferred to T2 Profile editor):**
  - **Languages multi-select** not on this screen — collected on T2.1/T2.2 profile editor.
  - **Years of practice** not on this screen — collected on T2.1.
  - **Mood Illustration** at top is a leftover from source template; could swap for a brand-neutral hero icon or remove entirely.
  - **9 chips is a lot** — consider 2-tier picker (Primary specialisation + secondary chips) for cleaner UX.

### - [x] T1.5 Region & timezone
- **Status:** ✅ Done 2026-05-20 — frame `24633:302394` in Therapist page > Flow T1 section, placed at (2375, 100).
- **Purpose:** Confirm region + timezone — drives currency track + payout method.
- **User stories:** US-036, US-040, US-041
- **Source template:** `24321:249404` (Patient 2.3 wizard chrome).
- **Final copy:** Top nav `Region & timezone` / Hero `Where do you practise?` / Section `Region` with rows: Country = Nigeria · Timezone = West Africa Time (WAT, UTC+1) · Currency = NGN (Nigerian Naira) / Progress `Step 5 of 6` / CTA `Save & continue`. Avatar block + Phone row hidden.

### - [x] T1.6 Bank & payout
- **Status:** ✅ Done 2026-05-20 — frame `24633:303071` in Therapist page > Flow T1 section, placed at (2830, 100).
- **Purpose:** Capture payout destination. NG flow (Paystack/GTBank/etc.) shown; Stripe Connect for International per US-041.
- **User stories:** US-041
- **Source template:** `24321:249404` (Patient 2.3 wizard chrome).
- **Final copy:** Top nav `Where do payouts go?` / Hero `Add your payout details` / Section `Bank account` with: Account name = Ada Okafor · Bank = GTBank · Account number = 0123456789 · BVN / Progress `Step 6 of 6` (final step) / CTA `Submit application`.
- **Open polish:** International (Stripe Connect) variant not built — flag for US-041 second iteration.

### - [x] T1.7 Application submitted
- **Status:** ✅ Done 2026-05-20 — frame `24633:303736` in Therapist page > Flow T1 section, placed at (3285, 100).
- **Purpose:** Confirm submission. Set 3–5 business day expectation.
- **User stories:** US-023
- **Source template:** `24474:156643` (Patient 6.12 Payment confirmed — celebration hero pattern).
- **Final copy:** `Application received` / *We're reviewing your application. Most decisions come back within 3–5 business days. You'll get an email when it's done.* / [Check status] [Back to home]

### - [x] T1.8 Verification status
- **Status:** ✅ Done 2026-05-20 — frame `24633:303775` in Therapist page > Flow T1 section, placed at (3740, 100). Pending state.
- **Purpose:** Show review progress while application is being reviewed.
- **User stories:** US-023
- **Source template:** `24474:156643` (Patient 6.12 Payment confirmed reused).
- **Final copy:** `Under review` / *Your application is with our verification team. Estimated review time: 2 more business days.* / [Edit application] [Back to home]
- **Open polish:** Approved + Rejected variants not built — flag as `T1.8a Approved` and `T1.8b Rejected` polish.

### - [x] T1.9 Welcome to Mindenity
- **Status:** ✅ Done 2026-05-20 — frame `24633:303814` in Therapist page > Flow T1 section, placed at (4195, 100).
- **Purpose:** Post-approval bridge to T4.1 Home.
- **User stories:** US-021
- **Source template:** `24358:134956` (Patient 4.5 Welcome to Mindenity bridge).
- **Final copy:** `You're approved` / *Welcome to Mindenity. Set your availability, accept plans, and your first booking will follow.* / [Set up my practice]
- **Open polish:** 3-step quick tour from spec not built — flag for post-launch onboarding polish.

---

## Flow T2 — Practice Configuration

Required setup AFTER admin approval, BEFORE the therapist can take bookings. Plan acceptance + pricing + international visibility. Reached from "Set up my practice" CTA on T1.9. **Profile editing lives in T9 Settings (single canonical surface) — not here.**

**Audit (2026-05-21, revised 2026-05-23):** Originally 7 screens. Audited to 3 canonical: T2.3 Intro video **killed** (no US backing). T2.7 Practice preview **deferred V2** (nice-to-have, not US-mandated). Original T2.4–T2.6 profile-editor variants **killed** — single canonical edit surface lives in T9 Settings. T2.2 further trimmed 2026-05-23: sub plans removed (already shown in T2.1) — only PAYG plans appear here since only PAYG is editable. Net 3 screens (T2.1, T2.2, T2.3).

### - [REPLACED] T2.3 Intro video
- **Killed 2026-05-21** — no US backing for intro video. Profile completeness covered by T2.1 (avatar + headline + bio). If video matters for conversion later, add when product confirms with US story.

### - [x] T2.1 Accepted plans
- **Status:** ✅ Done 2026-05-21 — frame `24634:333895` in Therapist page > Flow T2 section, placed at (1010, 100).
- **Purpose:** Pick which Mindenity plans you accept per US-027. Plan-matched clients see you in their directory per US-009.
- **User stories:** US-027, US-009
- **Source template:** Cloned from T2.1 (Patient 17.2 chrome); form rows repurposed as plan rows.
- **Final copy:** Top nav `Accepted plans` / `Pick which Mindenity plans you accept. Plan-matched clients see you in their directory.` / 5 plan rows with NGN amounts + Accepted/Not accepted status: Together · Couple · PAYG (₦50k · Accepted) · Harmony · Couple · Monthly (₦220k / 4 sessions · Accepted) · Restore · Couple · Monthly (₦450k / 8 sessions · Accepted) · Home · Family · PAYG (₦100k · Not accepted) · Family Care · Family · Monthly (₦350k / 4 sessions · Not accepted). Coverage summary: `3 of 5 plans accepted.` CTA `Save plan selection`.
- **Cleanup applied 2026-05-21:** Profile photo block (80x80 avatar + camera button) hidden — irrelevant on a plans screen.
- **Open polish:** All 9 PRD plans not surfaced — template has 5 row slots. Could split Individual/Couple/Family sections or use a longer scrollable list.

### - [x] T2.2 Custom pricing
- **Status:** ✅ Done 2026-05-21, rebuilt 2026-05-23 — frame `24706:57082` in Therapist page > Flow T2 section. Cards container `24706:57090`.
- **Purpose:** Set per-session price for PAYG plans via slider, within admin-approved bands per US-022. Subscription plans omitted — fixed by Mindenity, therapist earns commission share (surfaced in T7 Earnings, not here).
- **User stories:** US-022, US-013, US-015
- **Source pattern:** Slider Single component (`5556:45482`) inside PAYG plan cards. NGN-only (matches therapist's region per T1).
- **Final copy:** Top nav `Custom pricing` / Subtitle `Drag the slider on each PAYG plan to set your per-session rate within admin bands. Subscription plans are fixed by Mindenity — you earn a commission share (see Earnings).` / 3 PAYG cards: **Essential** (₦20k slider · 24706:57566) · **Together** (₦50k slider · 24706:73006) · **Home** (₦100k slider · 24706:73024). CTA `Submit for approval`.
- **Rebuild rationale (2026-05-23):** Original 9-card layout duplicated subscription plan info already shown on T2.1. Reduced to 3 PAYG cards since (a) sub plans are not editable here and (b) plan acceptance is the job of T2.1. Slider replaces text input for clearer band-bounded UX.
- **Open polish:** Section header above cards ("PAYG sessions"). Out-of-band slider state needs amber/warning visual (currently not differentiated). Above-band tooltip copy.

### - [x] T2.3 International visibility
- **Status:** ✅ Done 2026-05-21 — frame `24634:334231` in Therapist page > Flow T2 section, placed at (1920, 100).
- **Purpose:** Toggle visibility to international (USD) clients per US-038. Surfaces compliance disclosure inline.
- **User stories:** US-038, US-041, US-042
- **Source template:** Cloned from Patient 17.11 Notifications (toggle row pattern).
- **Final copy:** Top nav `International visibility` / `Show up in international (USD) directory searches.` / **Visibility** section: Accept international clients · USD pricing track · Cross-timezone bookings · Show region flag · Languages spoken. **Compliance** section: NDPR-compliant data handling (always on for NG clients) · GDPR-aligned for EU clients (auto-enabled with international visibility).
- **Cleanup applied 2026-05-21:** Leftover Patient 17.11 labels (Therapist messages, Wellness tips, Marketing & updates, Insight, AI Recommendations, Weekly Insight) rewritten to international-visibility context. 5 Visibility rows + 2 Compliance rows now coherent.
- **Open polish:** Per-row toggle states (On/Off) not explicitly set on render — currently inherits template defaults. Confirm visual state per row before launch.



---

## Flow T3 — Schedule

Tab Bar destination. Daily-use surface for viewing upcoming sessions, drilling into session detail, reschedule/cancel. **Onboarding setup screens** (weekly availability, duration+buffer, time off, welcome) live as **T3-setup** sub-block below — reached from T1.9 "Set up my practice", not from the Schedule tab.

**Audit (2026-05-23):** Original "Availability & Scheduling" flow had 5 config screens. After 3 audit passes: setup screens reached only from onboarding; Schedule tab needs a daily-use destination. User cloned Patient Flow 10 Appointment Management as the canonical Schedule module. **Restructure:** T3.1–T3.5 = Schedule (cloned + adapted); T3-setup retains the original config screens; Flow T6 Session Lifecycle absorbs in-call + post-session lifecycle frames.

### - [x] T3.1 Schedule home
- **Status:** ✅ Done 2026-05-23 — frame `24709:163178` in Therapist page > Flow T3 — Schedule section (`24709:163177`) @100,100.
- **Purpose:** Tab Bar destination. Lists upcoming sessions across all clients with quick Reschedule/Cancel actions.
- **User stories:** US-006 (view bookings)
- **Source template:** Cloned from Patient 10.1 Appointments home (`24506:226448`).
- **Final copy:** Subtitle `Here are your upcoming sessions with clients.` / Section header `Upcoming sessions · See all` / 3 client cards (Tola 9 AM Video Confirmed · Chiamaka 11 AM Voice Confirmed · Adebola 4 PM Video ⚠ crisis active). Tab Bar: Home · Schedule · Clients · More.
- **Open polish:** Crisis card relies on ⚠ emoji + copy only — needs visual variant. Top Nav title absent (user-trimmed) — confirm intentional vs add `Schedule` title later.

### - [x] T3.2 Session history
- **Status:** ✅ Done 2026-05-23 — frame `24709:163261` @555,100.
- **Purpose:** Past sessions across all clients, grouped by week/month, with searchable client+topic. Tap card → T3.3 Session detail.
- **User stories:** US-006 (history), US-025 (clinical record access)
- **Source:** Cloned from Patient 10.2 My sessions (`24510:246529`).
- **Final copy:** Top nav `Session history · Past sessions across all clients. Tap one to open the note.` / Filter `All clients · Newest first` · Search `Search by client or topic` / **Last 7 days** group: 3 cards (Tola 4 Mar CBT homework · Chiamaka 4 Mar couples · Funmi 28 Feb grief). **February 2026** group: 2 cards (Tola 25 Feb intake · Chiamaka 18 Feb partner). Each card CTAs: [Open note] [Risk form].
- **Open polish:** "Open note" + "Risk form" CTAs inherited from Patient destructive variant — switch to ghost/secondary.

### - [x] T3.3 Session detail
- **Status:** ✅ Done 2026-05-23 — frame `24709:163401` @1010,100.
- **Purpose:** Per-session deep dive. Therapist's notes, homework given to client, risk assessment status, link to client profile.
- **User stories:** US-025 (note + risk), US-034 (client context)
- **Source:** Cloned from Patient 10.3 Session detail (`24515:250174`).
- **Final copy:** Top nav `Session detail · Mon, 4 Mar · with Tola Okafor` / Hero `CBT homework review — workplace anxiety` (sub: "You reviewed Tola's reframing exercises and adjusted the plan for next week.") / Meta: Tola Okafor · 4 Mar 26 · Session 3 · 4:00 PM / **Your notes** section (Edit CTA): clinical recap of session, quoted next step. **Homework for next session** (3 items): Box breathing, Trigger journal, Cognitive reframing. **Risk assessment** section: green · submitted 4 Mar · AI suggested green confirmed. CTAs: [Open client profile] [Back to session history].
- **Open polish:** "Homework" section currently styled as Patient-template "Steps" timeline — works structurally but the visual treatment was designed for self-help steps. Consider checklist component for therapist→client assignments.

### - [x] T3.4 Reschedule session
- **Status:** ✅ Done 2026-05-23 — frame `24709:163281` @1465,100.
- **Purpose:** Pick a new slot from therapist's free time. Client gets notified automatically.
- **User stories:** US-006 (manage bookings)
- **Source:** Cloned from Patient 6.1-style reschedule (`22519:46932` lineage via Patient flow 10.4).
- **Final copy:** Top nav `Reschedule session` / Hero `Reschedule with Tola · Pick a new slot from your availability. Tola will be notified.` / Client hero card (Tola Okafor · Anxiety · Balance plan NG · Active · 3rd session · Currently booked Mon, 11 Mar · 9:00 AM) with date strip (Mar 18 / Mar 25 / Apr 01 / Apr 08 / Apr 15 — all Free). **Pick a new slot** section: Tomorrow + Wed with 4 time slots each (status: Booked / Free / Buffer). Selected slot caption: `New slot: Wed, 13 Mar · 2:00 PM. Tola will be notified.` CTA `Confirm reschedule`.
- **Companion state:** `T3.4b Reschedule success` frame `24709:163463` — confirmation toast screen "Session rescheduled / Tola's session moved to Wed, 13 Mar · 2:00 PM. She's been notified." [Done].

### - [x] T3.5 Cancel session
- **Status:** ✅ Done 2026-05-23 — frame `24709:163307` @2375,100.
- **Purpose:** Cancel a booked session with reason + optional note to client. Refunds one session credit (subscription) or full payment (PAYG).
- **User stories:** US-006 (manage), US-031.5 (plan credits)
- **Source:** Cloned from Patient 10.5 Cancel session.
- **Final copy:** Top nav `Cancel session` / `Cancel session with Tola · Tola will be notified and refunded one session credit.` / Client hero card (same as T3.4). **Reason (required)** (6 options): Personal emergency · Sick / unwell · Schedule conflict · Client requested cancellation · Technical issue · Other. **Note to client (optional)** textarea (visible to the client). CTA `Cancel session`.
- **Companion state:** `T3.5b Cancel confirm` frame `24709:163592` — modal "Cancel this session? / Tola will lose this slot and get one credit back. You can offer a reschedule in the note." [Yes, cancel] [No, keep it].
- **Open polish:** Cancellation policy / fee disclosure not on this screen — required by PRD plan terms (TBD where displayed).

---

### T3-setup screens (reached from T1.9 "Set up my practice", not from Schedule tab)

The original Availability config screens. Now part of the onboarding chain that terminates at T3-setup Welcome (your `24708:82386`). Renumbering deferred — referenced as T3.6/T3.7/T3.8/T3.9 below but Figma frames still carry their original T3.1–T3.3 / Welcome names.

### - [x] T3.1 Weekly availability
- **Status:** ✅ Done 2026-05-23 — frame `24706:76538` in Therapist page > Flow T3 section (`24706:76537`) @100,100.
- **Purpose:** Configure recurring weekly availability per US-003. Per-day enable + summary hours; tap row to edit time ranges.
- **User stories:** US-003
- **Source template:** Cloned from T2.3 International visibility (`24634:334231`) — toggle-row pattern reused as day rows.
- **Final copy:** Top nav `Weekly availability` / `Set the days and hours clients can book sessions.` / **Working days** section: Monday – Friday rows (each `9:00 AM – 5:00 PM`). **Weekend** section: Saturday + Sunday rows (`Off — tap to add hours`).
- **Open polish:** Time-range editor sheet (per-day) not designed — currently tap-row affordance only. "Copy Monday to all weekdays" shortcut per PRD AC#5 missing. Save toast on autosave (PRD AC#7 `Availability updated successfully`).

### - [x] T3.2 Session duration + buffer
- **Status:** ✅ Done 2026-05-23 — frame `24706:76693` in Therapist page > Flow T3 section @555,100.
- **Purpose:** Default session length and buffer between bookings per US-004.
- **User stories:** US-004
- **Source template:** Cloned from T2.3 (`24634:334231`).
- **Final copy:** Top nav `Session duration & buffer` / `Default session length and time between bookings.` / **Sessions**: `Default duration · 60 min · matches most Mindenity plan slots` · `Also offer 30-minute sessions · Let clients pick a shorter format when they book`. **Buffer between sessions**: `Buffer time · 15 min between back-to-back sessions` · `Apply to today · Apply changes to remaining slots today, not just tomorrow`.
- **Open polish:** Value picker sheets (60 min picker · buffer picker with PRD options 0/10/15/30 min) not designed. The two informational toggles render as Toggle Only — visually fine but a Settings Simple "value + chevron" row would be more honest for picker semantics.

### - [x] T3.3 Time off / blocked dates
- **Status:** ✅ Done 2026-05-23 — frame `24706:76850` in Therapist page > Flow T3 section @1010,100.
- **Purpose:** Block one-off dates or ranges where therapist is unavailable per US-005.
- **User stories:** US-005
- **Source template:** Cloned from T2.3 (`24634:334231`).
- **Final copy:** Top nav `Time off` / `Block dates you can't take bookings. Clients won't see slots on these days.` / **Upcoming blocks**: `Dec 25, 2026 · Public holiday — Christmas Day` · `Dec 26 – Jan 2, 2027 · Year-end break (8 days)` · `Mar 15, 2027 · Personal — medical appointment`. **Recurring**: `Every Sunday · Day off — recurring weekly` · `Last Friday monthly · Admin half-day — from 1:00 PM`.
- **Open polish:** "Add new block" floating action / sticky CTA missing. Date picker sheet for adding a block not designed. "Notify booked clients" warning when blocking a date that already has confirmed sessions (PRD AC#4 in US-005).

### - [REPLACED] T3.4 Schedule (this week)
- **Killed 2026-05-23** — heavily overlapped T4.1 Home today-list. Frame `24706:77145` removed from Figma. Schedule needs covered by T4.1 (today's sessions + `Open full schedule` link). Proper week/month grid (PRD US-006 AC#3) deferred to V2 polish pass. Tab Bar `Schedule` slot routes to T4.1 for now.

---

## Flow T4 — Home Dashboard

Therapist landing surface. "What's today look like + anything urgent."

**Audit (2026-05-23):** Original 4 screens collapsed to 1. T4.2 Earnings snapshot card + T4.3 Pending tasks panel = **sections on T4.1**, not standalone screens. T4.4 Crisis alerts inbox = **duplicate of T7.4 Crisis log** — kill, route from T4.1 banner to T7.4. Net 1 screen.

### - [x] T4.1 Home / Today
- **Status:** ✅ Rebuilt 2026-05-23 — frame `24708:82742` in Therapist page > Flow T4 section (`24706:78529`) @100,100. Original `24706:78530` (Patient 10.1 lineage) deleted.
- **Purpose:** Tab Bar destination. Triage-first home: greeting → today metrics → action items → next session → updates → support.
- **User stories:** US-006 (today's sessions), US-026 (crisis alerts), US-043 (tier), US-025 (risk forms), US-044 (earnings), US-015 (pricing approval status)
- **Source template:** Cloned from Patient Home & Mental Health Metrics (`22410:3949`) — 11 sections; 6 hidden (Self Journaling, Mindful Minutes, Gratitude, Symptom Checker, AI Companion, Rate Our App), 5 repurposed for therapist data.
- **Simplified 2026-05-23 (user pass + 2 polish fixes):** Action items + Mindenity updates sections killed. Greeting hero collapsed to single sub line (`Lifetime earnings · ₦684,567`). Next session card promoted into "Today at a glance" group. Crisis banner restored using DS Notifications component (Destructive · Primary · Mobile variant `5585:4615`) above "Today at a glance" to preserve US-026 dashboard-alert requirement.
- **Final copy (top → bottom):**
  - **Top nav:** date `Mon, Mar 11` · notification bell badge `4`
  - **Greeting hero:** `Hello, Dr. Nwosu! 👋` · sub `Lifetime earnings · ₦684,567` · chip `Tier 2 · 82%`
  - **Crisis banner** (conditional, conditional state — shown when active): `Crisis alert — Adebola J.` / `Logged 12 min ago · 18 min left to respond.` · [Open now] → T7.2
  - **Search:** `Search clients, sessions, notes…`
  - **Today at a glance** (3 horizontal cards):
    - Sessions · Today · `3` today · `Next in 2h 14m`
    - Earnings · This week · `₦184k` NGN · `8 of 12 sessions`
    - Tier+ pace · This month · `18 / 20` · `2 to qualify`
  - **Action items** section (3 pending · 1 crisis · 2 risk forms · "Address before your next session."):
    - Crisis row: `🚨 / Crisis · Adebola J. · 12 min ago / 18m left to respond`
    - Risk form / Tola Okafor · due today
    - Risk form / Chiamaka A. · due tomorrow
    - Pricing approval / Restore plan · in review · 1 day
    - New match / Funmi E. · awaiting first session
  - **Next session** card: `Today · 9:00 AM · in 2h 14m` · Tola Okafor · Anxiety · 3rd session · Balance (NG) · Video · 50 min · Confirmed · [Open client] [Start session]. Footer note: "3 sessions today. Tap 'See all' to open your full schedule."
  - **Mindenity updates** (2 article cards): `Policy · Pricing — New plan bands take effect Apr 1 — review your custom pricing` · `Tier+ · Earnings — You earned Tier+ for the 3rd month — bonus rate stays active`
  - **Contact support** footer: `Need any help with a client, payout, or plan? We're here for you.` · [Contact Support]
  - **Tab Bar:** Home · Schedule · Clients · More
- **Sections hidden (template provided, killed for therapist context):** Self Journaling, Mindful Minutes, Gratitude & Affirmation, Symptom Checker, AI Companion, Rate Our App.
- **Open polish:**
  - Crisis row visual still relies on 🚨 emoji + "18m left to respond" copy — should adopt amber/red surface or distinct Alert variant.
  - Tier 2 chip uses text-only — should map to Badge Text component variant.
  - 3-card metric row inherited Patient template's heart-rate weekly strip (M T W T F S S underneath) — currently empty/decorative; either repopulate with daily session counts or hide strip per card. Decide in polish pass.
  - "Action items" repurposes Patient sleep card with bedtime/wake-up + 4 sleep-stage quadrants. Layout works structurally but visual semantics (sleep stages = task types) is a stretch — final polish should rebuild as proper list rows with priority dots.
  - Mindenity updates: 2 article slots; real content TBD by ops/comms team.
  - Tab Bar destinations: Home (this) · Schedule (currently no destination after T3.4 kill — routes to T4.1) · Clients (T5.1) · More (T9 TBD).

---

## Flow T5 — Client Roster

The therapist's clients. List view + per-client detail with plan, history, notes, risk.

**Audit (2026-05-23):** Original 4 screens reduced to 2. T5.3 Session notes killed — no direct US backing; folded as **Notes** tab on T5.2. T5.4 Wellness summary killed — PRD does not mandate therapist view of patient mood/sleep/stress (no US); request as future story if business wants. T5.2 absorbed both as tabs on the client profile.

### - [x] T5.1 Clients
- **Status:** ✅ Done 2026-05-23 — frame `24707:80479` in Therapist page > Flow T5 section (`24707:80478`) @100,100.
- **Purpose:** Tab Bar destination — list of active clients. Filters by status; tap to T5.2.
- **User stories:** US-034 (implied — need a way to find a client before viewing their details)
- **Source template:** Cloned from Patient 5.1 Therapist directory (`24382:16835`) — same person-card pattern inverted (therapist-views-client vs client-views-therapist).
- **Final copy:** Top nav `Clients` / `12 active · 1 needs your attention. Tap a client to see plan, history, and notes.` / Filter chips: `All` (default) · `Needs attention`. 4 client cards: **Tola Okafor** · Anxiety · Balance plan (NG) · Active · 3rd session · Next: Today 9:00 AM · **Chiamaka Adeyemi** · Stress · Together plan (NG) · Active · 5th session · Next: Today 11:00 AM · **Adebola Johnson** · Couples · Family Care (NG) · 🚨 Crisis · 1st session · Next: Today 4:00 PM · alert active · **Funmi Eze** · Grief · Essential PAYG (NG) · PAYG · 8th session · Next: Thu Mar 14 · 10:00 AM.
- **Open polish:** Crisis card 🚨 badge relies on emoji only — needs distinct surface variant (amber/red). Search input not added (template doesn't expose one; would need Input Text on top). Date strip per card inherited from Patient template — visually OK but conceptually different (was therapist availability strip; now treated as upcoming session cadence).

### - [x] T5.2 Client detail
- **Status:** ✅ Done 2026-05-23 — frame `24707:80750` in Therapist page > Flow T5 section @555,100.
- **Purpose:** Per-client profile — plan, format, history, notes, risk, wellness — fulfills US-034 directly. Single canonical drill-down from T5.1.
- **User stories:** US-034 (plan visibility), US-025 (risk + session history)
- **Source template:** Cloned from Patient 5.4 Therapist detail (`24387:73322`) — same hero + tabs + multi-section layout, inverted to view-client.
- **Final copy:**
  - Top nav `Client`
  - Hero: Client badge `Client` · `Tola Okafor` · `Anxiety · Balance plan (NG)` · `3rd session · Active`
  - Tabs: `Overview` · `History` · `Notes` · `Risk` · `Wellness`
  - **Care summary** section: `Workplace anxiety + sleep regulation. CBT-focused. 3 sessions completed; no crisis flags to date.` · [Edit notes]
  - **Preferred format**: Voice call · Video
  - **Plan & sessions**: Balance plan · 4 sessions / month · 2 of 4 used · resets Mar 28
  - **Upcoming sessions**: Today 9:00 AM Video · Next week Mon Mar 18 9:00 AM
  - **Session history** (timeline): Mar 04 Session 2 (Sleep hygiene plan · risk green) · Feb 25 Session 1 (Intake · presenting concerns logged) · Feb 20 Matched to therapist (Selected from directory after intake). 2 trailing placeholder timeline items hidden.
  - **Preferred languages**: English (Primary) · Yoruba (Comfortable)
  - **Region & timezone**: Nigeria · Lagos · GMT+1 · [View consent]
  - Primary CTA: `Start session`
- **Open polish:** Tab content currently shows Overview state only — History/Notes/Risk/Wellness are tab labels but tapping them doesn't swap content (would need additional frame variants per tab). "Risk" tab content needed for US-025 risk-assessment history. "Wellness" tab kept as a tab label but no content built — confirms business intent before designing (PRD does not mandate this view). Avatar still shows Patient template's photo — needs alias-initials variant for client anonymity per US conventions.

---

## Flow T6 — Session Lifecycle

In-session + post-session screens (the live therapy moment). Reschedule/Cancel live in T3 Schedule, not here.

**Audit (2026-05-23):** Original 7 screens reduced to 3. T6.1 Session detail killed (covered by T3.3). T6.4 Risk assessment merged into T6.3 post-session note+form (single screen, since both are filed together per US-025). T6.5 Therapist note also merged into T6.3. T6.6/T6.7 Reschedule/Cancel relocated to T3.4/T3.5 (canonical management surface).

### - [x] T6.1 Pre-session prep
- **Status:** ✅ Done 2026-05-23 — frame `24709:163324` in Therapist page > Flow T6 section (`24709:166657`) @100,100.
- **Purpose:** Quick checks before joining a session. Same connection/audio prompt the client sees, plus a "notes ready" reminder.
- **User stories:** US-006 (pre-session readiness)
- **Source template:** Cloned from Patient 10.6 Pre-session prep.
- **Final copy:** Hero `Before your session with Tola… · 3 quick checks for a smooth session. Tola gets the same prompt.` / 3 checklist items: Stable connection (Required) · Quiet, private space (Required) · Notes open & ready (Recommended). CTA `Start session`.

### - [x] T6.2 In-call
- **Status:** ✅ Done 2026-05-23 — frame `24709:163337` @555,100.
- **Purpose:** Video SDK chrome during the live session. Therapist sees client info + duration + participant count.
- **User stories:** US-006
- **Source template:** Cloned from Patient 10.7 In-call.
- **Final copy:** Hero `Tola Okafor · Anxiety · Session 3 · Balance plan` / Timer `02:55` / Participants `3` (therapist + client + observer). All other controls (mute, video, end call) provided by video SDK chrome.
- **Notes:** Most live-call UI handled by SDK. Figma frame represents the wrapper chrome only.

### - [x] T6.3 Post-session note + risk form
- **Status:** ✅ Done 2026-05-23 — frame `24709:163369` @1010,100.
- **Purpose:** Mandatory post-session filing per US-025. Combined risk assessment + clinical note + draft-save.
- **User stories:** US-025 (risk + clinical record)
- **Source template:** Cloned from Patient 10.8 Post-session feedback.
- **Final copy:** Hero `Tola Okafor · Session 3 ended · 50 min · Video` / **Risk assessment** section (level picker — Green/Orange/Red) / **Session note** textarea: `Clinical note (visible only to you + authorised admin)` placeholder. Helper text: `Encrypted at rest per US-025.6.` CTAs: [Submit assessment] (primary) [Save draft] (tertiary).
- **Open polish:** Risk level picker currently inherits Patient "Your experience" emoji/star rating — needs replacement with proper Green/Orange/Red traffic-light radio per PRD US-025 AC#2. AI pre-fill suggestion (US-025 AC#3) needs visible affordance ("AI suggests Green — confirm or override"). Red submission triggers admin alert (AC#4) — needs confirmation modal flow not yet built.

---

## Flow T7 — Crisis Response

Crisis alerts triggered from Patient Flow 12 Crisis bottom sheet. Per US-026 AC#4 therapist has **5 minutes** to respond before escalation to next available therapist + admin.

**Audit (2026-05-24):** Original 4 screens reduced to 1. T7.1 Push killed (native notification, not Figma). T7.3 Respond killed (call/message are inline action buttons, not a separate screen). T7.4 Crisis log killed — **no US backing**; per-client crisis history accessible from T5.2 Risk tab, and per-session risk forms live in T3.2 history. Also fixed T4.1 home crisis banner — "18 min" was based on stale 30-min rule; PRD AC#4 is 5 min.

### - [x] T7.1 Crisis alert detail
- **Status:** ✅ Done 2026-05-24 — frame `24710:168320` in Therapist page > Flow T7 section (`24710:168319`) @100,100.
- **Purpose:** Full crisis context for response. Per US-026 AC#3 must show: Client ID, time, last risk level, active plan, region. Plus emergency line per AC#5.
- **User stories:** US-026
- **Source template:** Cloned from T5.2 Client detail (`24707:80750`) — rich client header + sections fit the crisis context, repurposed.
- **Final copy:**
  - Top nav `Crisis alert`
  - Hero: badge `🚨 Crisis alert` · `Adebola Johnson` · `Couples · Family Care (NG)` · `Logged 1 min ago · 4 min to escalate`
  - Tabs: `Now` · `Recent`
  - **What we know**: `Adebola tapped Crisis Support inside the Family Care plan. AI flagged the message as moderate-risk. Last risk assessment (1 day ago): Green. No prior crisis events.` · [Open profile]
  - **Reachable now**: Voice call · In-app message
  - **Active context**: Last AI Companion message (8 min ago) `"I can't breathe and I feel trapped."` / Last mood check (this morning) `3 / 10 — lowest in 30 days`
  - **Recent sessions** (3 cards): Session 3 4 days ago (Workplace boundaries · risk green) · Session 2 11 days ago (Family conflict · risk green) · Session 1 18 days ago (Intake)
  - **Local emergency line** (per AC#5): Nigeria 112 · 24/7 · Lagos Crisis Hotline · 0809 210 6493
  - Primary CTA: `Call Adebola now`
- **Open polish:**
  - Big 5-min countdown timer should be prominent visual element (currently text-only in hero "4 min to escalate"). Add Alert variant with timer chip.
  - "Mark as responded" required action missing — therapist needs explicit close-the-loop button after call/message (clinical record per US-026).
  - "Escalate to admin" secondary CTA missing — explicit human escalation before auto-escalation hits at 5 min.
  - International client variant: emergency line should swap to country-local per AC#5 (currently shows Nigeria-only).
  - Risk-form auto-launch after Mark Responded (links to T6.3 risk form flow).

---

## Flow T8 — Earnings & Payouts

Earnings dashboard with commission tier breakdown. Tier+ activation/deactivation visualised.

### - [ ] T8.1 Earnings dashboard
- **Purpose:** Tab Bar destination. This-month earnings + commission tier + payout schedule.
- **User stories:** US-044, US-043
- **Key elements:** Hero this-month earnings (NGN/USD), sessions count, average per session, current commission tier badge with Tier+ status, progress bar to next tier or threshold to keep Tier+, "Next payout" date card
- **DS components:** Stat card, Badge Text, Progress Bar, Section Header, Tab Bar

### - [ ] T8.2 Commission tier detail
- **Purpose:** Explain current tier + how Tier+ works (US-043, US-045, US-046).
- **User stories:** US-043, US-045, US-046
- **Key elements:** Tier ladder visualisation (Bronze · Silver · Gold · Platinum + Tier+), lifetime sessions count vs threshold, monthly average vs Tier+ threshold, history of tier changes
- **DS components:** Settings Simple, Badge Text, Progress Bar, Section Header

### - [ ] T8.3 Payout history
- **Purpose:** List of past payouts. Tap → T8.4 detail.
- **User stories:** US-048
- **Key elements:** Time-grouped list (This year / 2025 / etc.), each row: payout date + amount + status (Paid / Pending / Failed), filter by month
- **DS components:** Settings Simple, Badge Text, Section Header

### - [ ] T8.4 Payout detail
- **Purpose:** Itemised payout breakdown per US-048. Gross earnings, commission, fees, net payout.
- **User stories:** US-048
- **Key elements:** Sessions included (line items), gross total, Mindenity commission (% based on tier), Tier+ bonus if active, processor fees, **net payout**, payout method (bank/Stripe Connect), reference ID, "Download statement" CTA
- **DS components:** Settings Simple, Section Header, Button

### - [ ] T8.5 Bank / payout settings
- **Purpose:** Edit payout destination (NG bank or Stripe Connect).
- **User stories:** US-041, US-048
- **Key elements:** Current payout method card, "Change" link → region-routed form (Paystack for NG, Stripe Connect for Int'l), verification status
- **DS components:** Settings Complex, Input Text, Button

### - [ ] T8.6 Tax / invoice documents
- **Purpose:** Download annual statements + per-payout invoices for tax filing.
- **User stories:** US-048 (statement download)
- **Key elements:** Annual statement (year picker) + download, per-payout invoices list with PDF download, tax ID input + Mindenity TIN display
- **DS components:** Settings Simple, Button, Input Text

---

## Flow T9 — More / Settings

Tab Bar destination "More" — settings catch-all + profile editor.

**Audit (2026-05-24):** Original 5 screens (Settings home + Security + Notifications + Lang/region + Privacy) reduced to 2 canonical screens (T9.1 More landing, T9.2 Profile editor). The other settings categories (Security, Notifications prefs, Language & region, Privacy & data) demoted to **rows on T9.1** with deep-link routes — actual sub-screens built in polish pass when business confirms scope.

### - [x] T9.1 More
- **Status:** ✅ Done 2026-05-24 — frame `24710:170931` in Therapist page > Flow T9 section (`24710:170930`) @100,100.
- **Purpose:** Tab Bar destination. Hero (therapist identity + lifetime stats) + earnings glance + 8 settings rows routing to T-flow destinations.
- **User stories:** US-021 (account), US-043/044 (tier + earnings glance), US-038 (intl visibility), US-022 (custom pricing), US-027 (accepted plans), US-040 (notifications)
- **Source template:** Cloned from Patient Profile Settings home (`22539:78366`) — hero + stats + Invite block + 8-row settings list.
- **Final copy:**
  - **Hero**: Tier 2 · 82% badge · `Member since Sept 2024` · `Dr. Adaeze Nwosu` · 3 stats (Sessions `217` · Lifetime `₦684k` · On Mindenity `18m`)
  - **Tier+ block**: `You're 2 sessions away from Tier+ this month.` [See earnings] / `This week · Sessions done 8/12 · ₦184,000 earned · Payout Fri 22 Mar`
  - **Mid-block CTA**: [Send feedback] · `v0.9 · beta`
  - **Tier explainer**: `Tier 2 base · 80% therapist share` / `Tier+ active this month adds 2% → 82% effective rate.`
  - **8 menu rows**: My profile (→ T9.2) · Accepted plans (→ T2.1) · Custom pricing (→ T2.2) · Schedule setup (→ T3-setup) · Earnings & payouts (→ T8) · Notifications · Help & support · Log out
- **Open polish:**
  - Hero avatar inherited from Patient template — needs Dr. Adaeze photo or alias avatar
  - "Family" placeholder hint text on each row is gone, but each row currently has the same chevron treatment — secondary text only present on first 7 rows; Log out has no sub
  - Tier+ block "See earnings" CTA visually identical to original "Invite Friend" — should be plain text link for hierarchy
  - Rows for Intl visibility (T2.3), Region & timezone (US-040), Privacy & data (US-042), Delete account not added — deferred. Add to a "More settings" expandable or in polish.

### - [x] T9.2 Profile editor
- **Status:** ✅ Done 2026-05-24 — frame `24710:171275` in Therapist page > Flow T9 section @555,100.
- **Purpose:** Edit therapist's public profile (display name, headline, bio, specialisations, languages) + credentials (license, years of practice, country). Reached from T9.1 "My profile" row.
- **User stories:** US-021 (registration data), US-038 (intl readiness via language signal)
- **Source template:** Cloned from T2.3 Intl visibility (`24634:334231`) — settings-row scaffold.
- **Final copy:**
  - Top nav `Edit profile · Your public profile and credentials. Clients see the Public section in the directory.`
  - **Public profile** section: Display name `Dr. Adaeze Nwosu` · Headline `Anxiety & stress specialist · 8 yrs` · Bio (recap) · Specialisations `Anxiety, Stress, Trauma +2` · Languages `English (primary), Yoruba, Pidgin`
  - **Credentials** section: License `MDCN-NG-12892` (Expires Sept 2028 · verified) · Years of practice `8` (Country of practice · Nigeria)
- **Open polish:**
  - Save CTA missing — need primary `Save changes` button at frame bottom
  - Avatar/photo edit slot missing — need photo row at top with circular avatar + upload action
  - Each row should be tappable into per-field editor; current rendering is read-only-looking with toggles inherited from intl visibility template
  - License upload status (verified badge, expiry warning if <30 days) currently text-only — needs badge variant

---

## Flow T10 — Search & Notifications

### - [ ] T10.1 Search
- **Purpose:** Search across clients, sessions, notes.
- **User stories:** discovery
- **Key elements:** Search input, recent searches, tabs (Clients · Sessions · Notes)
- **DS components:** Input Text, Tab Group, Settings Simple

### - [ ] T10.2 Notifications center
- **Purpose:** All notifications — bookings, cancellations, crisis alerts, earnings, admin messages.
- **User stories:** engagement
- **Key elements:** Time-grouped list, unread badge, priority dots (red for crisis), tap to relevant screen
- **DS components:** Alert & Notification, Section Header, Badge Text

---

## Open questions / decisions before build

1. **Figma `Therapist` page** — needs creating. Confirm placement (sibling to Patient page).
2. **Tab Bar destinations** — 4 or 5 tabs? Proposed: **Home · Calendar · Clients · Earnings · Profile** (5). Crisis alerts surface as the home banner + push, not a dedicated tab.
3. **Source sections in DS** — DS may not have therapist-specific templates. Most therapist screens compose from Patient-side primitives (Top Nav, Avatar, Doctor Card, Schedule, etc.). Flag any therapist-specific gaps as DS additions during build.
4. **Crisis-alert hard-fail UX** — US-026 says alerts can't be dismissed and have a 30-min response timer. Build as a modal that blocks app navigation until acknowledged? Or persistent banner? Decide before T7.2.
5. **Risk assessment hard-gate** — US-025 says assessment can't be skipped post-session. Confirm UX: blocking modal? Allow "Save draft & finish later" with reminder?
6. **Clinical record retention** — therapists likely cannot self-delete account (clinical record laws). Confirm with legal before T9.5.
7. **Profile editor vs Settings split** — should T2 Profile & Practice Setup live as a separate flow OR be part of T9 Settings? Currently split for clarity; could merge.
8. **Onboarding tour** — T1.9 mentions a 3-step quick tour. Build as separate screens, sheets, or coach marks overlaid on the empty dashboard?

---

## Audit pattern (carried over from client app)

Same kill-pattern applies: if a feature has zero US backing, defer or kill.

**Candidates for V2 / future audit:**
- T2.3 Intro video — useful for client conversion but no US explicitly requires video. Could defer.
- T7.4 Crisis log — clinical-record requirement, but check if US-025 / US-026 explicitly mandate a log surface.
- T9.6 Help & support — no US backing. Defer same as Patient 17.15-17.17.

**Probable kills during build:**
- Anything that adds gamification or community features for therapists.
- Marketing settings if marketing isn't in PRD.
