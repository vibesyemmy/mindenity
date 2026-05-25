# Client Mobile App — Design Flow & Tracking

Canonical screens for the Mindenity client mobile app, organized by user journey. Each checkbox represents one design task — a finalized screen frame, named, tokenized to Semantic where possible, copy-reviewed against [copy-guidelines.md](copy-guidelines.md), and lifted out of the exploratory `Mobile template - light` grid into a working page.

**Conventions:** `[ ]` not started · `[~]` in progress · `[x]` done (copy-reviewed and tokenized).
**Source frames** point to the existing `Mobile template - light` page sections — duplicate the closest screen as a starting point.
**US-XXX** refers to user story IDs in `Mindenity_UserStories_v5.0`.
**Copy review:** required before flipping any checkbox to `[x]` — see [copy-guidelines.md](copy-guidelines.md).
**Naming:** user-facing copy says "Client" (never "Patient", "User", "Customer"). The `Patient` Figma page name is internal-only — designers can rename it any time.

## Status overview

- **Total canonical screens:** 92 (added 2.3 Personal info, 2.6 Sleep level, 2.7 Mood, 2.8 What lifts your mood, 4.5 Welcome to Mindenity bridge; dropped 3.4 Date of birth, 3.2 Profile photo, 3.2 Display name as duplicates of fields in 2.3; dropped 3.3 Country confirmation as duplicate of 1.3 Region detection; collapsed Flow 4 from 14 to 5 onboarding screens — comparison/promo dropped, Couple/Family segments folded into 4.3 as alt-states, plan-detail dropped, subscription management (6 screens) relocated to Flow 17 as 17.21–17.25 + existing 17.3 covers the active view; Flow 5 Therapist Discovery confirmed post-onboarding — reached from Home; **Flow 5 collapsed from 13 to 5** — 5.5 calendar redundant with 5.4+Flow 11, 5.6 accepted plans is a 5.4 section, 5.6 My Therapists panel + ❤️/star icon dropped (therapy isn't shopping), 5.8 save-feedback is a toast, 5.10 comparison dropped like 4.7, 5.11/5.12/5.13 are alt-states/banners/inline alerts not screens; Flow 7 collapsed from 8 to 2 — 7.2/7.3/7.4 demoted to 7.1 alt-states, 7.7/7.8 demoted to 7.1 chrome, 7.5 promoted to 7.2 Mood prompt; 7.3 Quick actions drawer built then dropped after design review — Crisis Support now lives in Tab Bar center button, no competing surfaces needed; Flow 12 restructured — 12.1 FAB dropped (replaced by Tab Bar center button), 12.2 Crisis bottom sheet built from repurposed home shortcuts card; **Flow 8 collapsed from 14 to 5** — old per-metric homes (8.3/8.6/8.9) covered by 8.1 overview, old per-metric histories (8.2/8.5/8.8/8.12) merged into single 8.5 unified history with metric tabs, entry-detail folded inline into 8.5 list rows (no separate screen), heart rate + connect device deferred to V2 wearable scope, metric widget detail killed as duplicate of 8.1; **Flow 10 killed + Flow 11 merged into Flow 10 (2026-05-16)** — Self-Care Features had zero user-story backing (no PRD mention of journaling, meditation, soundscape, breathing); the Tab Bar 4th slot now routes to Appointment Management (was Flow 11). Flow 11's 13 screens audited to 8 in Flow 10's slot — collapsed Upcoming/Past/By-therapist into tabbed `10.2 My sessions`, Session detail upcoming/past into state-aware `10.3`, feedback+thanks into `10.8`; demoted Session expired + Therapist canceled to inline alerts on new `10.1 Appointments home`. Flow 11 reserved as tombstone — no renumber of 12–18)
- **Done:** 92
- **In progress:** 0
- **Pending:** 0

Per-flow status:
| Flow | Screens | Done | Pending |
|------|---------|------|---------|
| 1. First Launch & Authentication | 11 | 11 | 0 |
| 2. Mental Health Assessment (Intake) | 15 | 15 | 0 |
| 3. Profile Setup | 4 | 4 | 0 |
| 4. Plan Selection (onboarding) | 5 | 5 | 0 |
| 5. Therapist Discovery | 5 | 5 | 0 |
| 6. Booking & Payment | 12 | 12 | 0 |
| 7. Home Dashboard | 2 | 2 | 0 |
| 8. Mental Health Metrics | 5 | 5 | 0 |
| 9. AI Companion | 5 | 5 | 0 |
| 10. Appointment Management | 8 | 8 | 0 |
| 11. ~~MERGED INTO FLOW 10~~ | 0 | 0 | 0 |
| 12. Crisis Support | 1 | 1 | 0 |
| 13. ~~DEFERRED V2~~ | 0 | 0 | 0 |
| 14. ~~DEFERRED V2~~ | 0 | 0 | 0 |
| 15. ~~DEFERRED V2~~ | 0 | 0 | 0 |
| 16. Search & Notifications | 6 | 6 | 0 |
| 17. Settings & Profile | 13 | 13 | 0 |
| 18. ~~DROPPED~~ | 0 | 0 | 0 |

---

## Flow 1 — First Launch & Authentication

Entry point. Region detection happens here (US-036). Sets up the user's currency track + privacy regime for the rest of the app.

**Source section:** `Splash & Loading` (`22543:56128`), `Welcome Screen` (`22543:60702`), `Authentication` (`22543:61121`)

### - [x] 1.1 Splash screen
- **Status:** ✅ Done 2026-05-12 — frame `24319:242538` in Patient page > `Flow 1` section
- **Purpose:** First frame on cold launch. Logo + brief loading while region detection + auth check runs.
- **User stories:** US-036
- **Key elements:** Mindenity logomark (centered), brand-hero background (`surface/hero` → Brand/80), Loader Base, iPhone X status bar, Home Indicator
- **DS components:** Loader Base, Logomark instance, iPhone X status bar, Home Indicator
- **States:** default landed. States deferred — loading-number / loading-image / loading-text / loading-progress-bar variants in template can be added later as alt frames if needed.
- **Source frame:** Mobile template > Splash & Loading > Splash Screen (`22398:39230`)
- **Notes:** Introduced new `surface/hero` Semantic token (Light: Brand/80 / Dark: Brand/60) — first use of brand-themed surface in the Semantic layer. Apply this token to any other brand-hero surfaces (welcome carousel slides, marketing heroes, etc.).

### - [x] 1.2 Welcome carousel
- **Status:** ✅ Done 2026-05-12 — 4 frames in Patient page > `Flow 1` section: `1.2a Welcome — Brand intro` (`24319:242562`), `1.2b Welcome — Feature` (`24319:242738`), `1.2c Welcome — Community` (`24319:242869`), `1.2d Welcome — Get started` (`24319:242896`)
- **Purpose:** 4 onboarding slides introducing Mindenity's value prop (brand intro, therapy access, community, get started CTA).
- **User stories:** US-001 (pre-registration intro)
- **Key elements:** Hero illustration per slide, headline, supporting text, page dots, "Get started" CTA on last slide, "Skip" top-right
- **DS components:** Button (primary), Pagination Dot, Heading sm/SemiBold, Paragraph md
- **States:** 4 slides shipped (Brand intro, Feature, Community, Get started). 5th slide deferred — can add if needed.
- **Source frame:** Welcome Screen section (4 of 14 variants picked: `22398:41155`, `22548:102610`, `22543:59282`, `22543:59395`)
- **Notes:** 1.2a Brand intro bound to `Palette.Success/40` (olive sage — wellness brand surface). Considered adding `surface/wellness` semantic token but deferred until we see olive used in ≥2 more surfaces. 1.2b/c/d bound to `surface/base` (cream — Phase 2.5).

### - [x] 1.3 Region detection notice
- **Status:** ✅ Done 2026-05-12 (revised twice) — frame `24319:244081` in Patient page > Flow 1, row 2 col 1
- **Purpose:** Client declares whether they're in Nigeria. Drives currency (NGN/USD), payment gateway (Paystack/Stripe), and crisis-line surfaces per US-036.
- **User stories:** US-036
- **Key elements:** Top Nav (titles hidden), screen heading, supporting subtext, 2 country option cards
- **DS components:** Top Nav, `List + Icon` cards, Home Indicator. Background bound to `surface/base`.
- **Copy:** Heading "Where are you based?" / Sub "We'll show prices in your local currency. You can change this anytime in Settings." / Card 1 "I'm in Nigeria" + "Pay in Naira (₦)" / Card 2 "I'm somewhere else" + "Pay in US Dollars ($)"
- **Source frame:** Authentication > Forgot Password method selector (`22400:37815`) — repurposed the card list pattern.
- **Notes:** **2-card design** matches the binary product reality (NG-only vs everywhere-else per US-036/US-019/US-037). Country-specific stuff (crisis line, timezone) auto-detects from IP + device. Right-side chevron slot intentionally left empty — could add a chevron icon when DS provides one.

### - [x] 1.4 Sign up
- **Status:** ✅ Done 2026-05-12 — frame `24319:243644` in Patient page > Flow 1, row 2 col 2
- **Purpose:** Create account with email + password per US-001.
- **User stories:** US-001
- **Key elements:** Heading, email input, password input (with strength indicator), confirm password input, "Sign up" CTA, "Already have an account? Sign in" link
- **DS components:** Input Text variants, Button (primary), Form layout
- **Copy:** "Create your Mindenity account" / "Email address" / "your.name@email.com" / "Password" / "Password strength: weak" / "Confirm password" / "Sign up" / "Already have an account? Sign in"
- **States:** default, filled, password strength variants in source can be added as needed.
- **Source frame:** Authentication > Sign Up form (`22400:37369`)
- **Notes:** Cloned from auth section. Phone-number variant + DOB + privacy consent variants deferred — base form done. Social sign-on row was on the original but kept to match design system pattern.

### - [x] 1.5 Sign in
- **Status:** ✅ Done 2026-05-12 — frame `24319:243663` in Patient page > Flow 1, row 2 col 3
- **Purpose:** Returning user login per US-001.
- **User stories:** US-001
- **Key elements:** Heading, email input, password input, "Forgot password?" link, "Sign in" CTA, social sign-on (Google), "Don't have an account? Sign up" link
- **DS components:** Input Text, Button (primary), Button Social Media
- **Copy:** "Welcome back. Sign in to continue." / "Email address" / "Forgot password?" / "Sign in" / "Continue with Google" / "Don't have an account? Sign up"
- **States:** default landed. Filled / invalid credentials / locked account variants can be added later.
- **Source frame:** Authentication > Sign In empty (`22543:60944`)

### - [x] 1.6 OTP verification
- **Status:** ✅ Done 2026-05-12 (revised) — frame `24319:244090` in Patient page > Flow 1, row 2 col 4
- **Purpose:** Verify email with a 4-digit OTP code per US-001.
- **User stories:** US-001
- **Key elements:** Heading, 4-digit Input Passcode (fits naturally within 375 width), helper text, resend link, primary "Verify" CTA, secondary "Use SMS instead" CTA
- **DS components:** Input Passcode (Digits=4), Button (primary + secondary)
- **Copy:** "Enter your verification code" / "We sent a 4-digit code to your email. Enter it below to verify." / "Code expires in 5 minutes." / "Didn't receive a code? Resend" / "Verify" / "Use SMS instead"
- **Source frame:** Profile Setup > Verify your Passcode (`22404:27889`).
- **Notes:** Per user pick, using 4-digit OTP from Profile Setup template instead of building a 6-digit one. Fits cleanly within the 375 phone width. Phone-OTP variant (where email is the fallback) easy to swap by editing two text nodes.

### - [x] 1.7 Privacy consent
- **Status:** ✅ Done 2026-05-12 (rebuilt with proper template) — frame `24321:246878` in Patient page > Flow 1, row 2 col 5. **Tall frame: 375×1454** (scrollable consent body).
- **Purpose:** Display the Mindenity privacy policy with explicit accept/decline action per US-001 + US-042.
- **User stories:** US-001, US-042
- **Key elements:** Top header with version badge + language toggle + PDF download, "Privacy Policy" heading, effective date, intro paragraph, "1. Information We Collect" section, "2. How We Use Your Information" section, primary "I accept" + secondary "I decline" CTAs, Home Indicator
- **DS components:** Top header pattern, Button (primary + secondary), language pill, "Download as PDF" link
- **Copy (Mindenity-rewritten):** Effective: 12 May 2026 / Intro "Welcome to Mindenity. Protecting your privacy is core to how we work…" / Section 1 covers Account / Wellness / Therapy / Usage data with encryption note / Section 2 covers therapist matching, AI tools, reminders, crisis detection, NDPR + GDPR compliance, "We never sell your data" promise / Buttons "I accept" / "I decline" (sentence case)
- **Source frame:** Profile Setup & Account Completion > Privacy Policy (`22404:30028`).
- **Notes:** Source template had heavy template debt — "Welcome to Freud", references to "budgeting tools", "financial insights", "sync with financial accounts" (from a finance UI kit). All rewritten for Mindenity mental-health context. NDPR vs GDPR variant split deferred — copy currently covers both regimes in one screen; if regional split needed, clone this frame and tweak the compliance line for each region.

### - [x] 1.8 Forgot password
- **Status:** ✅ Done 2026-05-12 — frame `24321:246580` in Patient page > Flow 1, row 3 col 1
- **Purpose:** Request password reset by entering email per US-001 auth completeness.
- **User stories:** US-001
- **Key elements:** Top Nav (titles hidden), heading, supporting subtext, email input field, primary CTA, footer support link
- **DS components:** Top Nav, Input Text (with label), Button (primary)
- **Copy:** "Reset your password" / "Enter your email and we'll send you a reset link." / "Email address" / "you@example.com" / "Send reset link" / "Don't remember your email? Contact us at help@mindenity.com"
- **Source frame:** Authentication > Forgot Password email entry (`22401:29134`)
- **Notes:** Source button label was "Send Password" — copy-fixed to "Send reset link" (we send a reset link, not the password itself). Support email changed from `help@freud.ai` to `help@mindenity.com` — confirm actual address with the team.

### - [x] 1.9 Reset password
- **Status:** ✅ Done 2026-05-12 — frame `24321:247106` in Patient page > Flow 1, row 3 col 2
- **Purpose:** Set new password after deep-link verification per US-001.
- **User stories:** US-001
- **Key elements:** Heading, new password input with strength indicator, confirm password input, "Update password" CTA, "Back to sign in" link
- **DS components:** Input Text (password variants), Button (primary)
- **Copy:** "Set a new password" / "New password" / "Password strength: weak" / "Confirm new password" / "Update password" / "Back to sign in"
- **Source frame:** Authentication > Sign Up form (`22400:37369`) — email input hidden, password labels relabeled, button updated.
- **Notes:** Code input not included (assumes deep-link flow). If we add the alternate flow where the user manually enters a reset code, an Input Passcode component can be added above the password field.

### - [x] 1.10 Account locked / suspended
- **Status:** ✅ Done 2026-05-12 — frame `24321:247125` in Patient page > Flow 1, row 3 col 3
- **Purpose:** Error state when account is temporarily locked from too many failed logins.
- **User stories:** US-001 (auth error)
- **Key elements:** Status badge, illustration, headline, body explanation, primary CTA (Contact support), secondary CTA (Try again later)
- **DS components:** Badge, Button (primary + secondary)
- **Copy:** "Locked" badge / "Account locked" / "Too many failed sign-in attempts. For your security, we've temporarily locked your account." / "Contact support" / "Try again later"
- **Source frame:** Error & Utility > Status Code 301 / "Not Allowed" (`22525:55950`)
- **Notes:** Reframed from generic "Not Allowed" server error to security-locked-account scenario. Primary CTA flipped to "Contact support" because a locked-out user can't self-resolve.

### - [x] 1.11 Network error / retry
- **Status:** ✅ Done 2026-05-12 — frame `24321:247248` in Patient page > Flow 1, row 3 col 4
- **Purpose:** Auth-flow network failure with retry path.
- **User stories:** US-001 (graceful failure)
- **Key elements:** Status badge, offline illustration, headline, body, primary "Try again" CTA, secondary "Contact support"
- **DS components:** Badge, Button (primary + secondary)
- **Copy:** "No connection" badge / "You're offline" / "Check your connection and try again." / "Try again" / "Contact support"
- **Source frame:** Error & Utility > "No Internet!" (`22525:55701`)
- **Notes:** Copy toned down per guideline (no exclamation marks). "Refresh" button renamed to "Try again" — clearer intent for the user.

---

## Flow 2 — Mental Health Assessment (Intake)

Triggered immediately after registration per US-002. Outputs: top 3 therapist matches + recommended plan in user's currency. The 13 mental health categories drive plan recommendation severity logic.

**Source section:** `Comprehensive Mental Health Assessment` (`22544:67968`) — 31 screens in template; consolidate to canonical set below.

### - [x] 2.1 Intake welcome / intro
- **Status:** ✅ Done 2026-05-12 — frame `24321:249065` in Patient page > Flow 2 section, row 1 col 1
- **Purpose:** Set expectations — short intake (~5 min), reassurance, primary CTA per US-002.
- **User stories:** US-002
- **Key elements:** Heading, supporting paragraph, primary "Begin" + secondary "I have questions" CTAs, 3-step preview (Assessment / Personal info / Choose plan) with date pills
- **DS components:** Button (primary + secondary), Step indicator preview
- **Copy:** "Let's get to know you" / "A quick intake (~5 minutes). Your answers help us match you with the right therapist and plan." / "Begin" / "I have questions" / Steps: "Assessment — About you and your goals" + "Personal info — Name, age, preferences" + "Choose plan — Pick what fits your needs"
- **Source frame:** Comprehensive Mental Health Assessment > Account setup intro (`22401:35734`)

### - [x] 2.2 Segment selection
- **Status:** ✅ Done 2026-05-12 — frame `24321:249081` in Patient page > Flow 2 section, row 1 col 2
- **Purpose:** Pick segment (Individual / Couple / Family) — drives which 3 plans apply per US-002 and US-030.
- **User stories:** US-002, US-030
- **Key elements:** Top Nav with progress label, screen heading, supporting subtext, 3 selectable option cards, primary "Continue" + secondary "Skip for now" CTAs
- **DS components:** Top Nav, Radio + Text option cards, Button (primary + secondary)
- **Copy:** "Who's this for?" / "Pick the option that fits. You can change this later in Settings." / Option 1 "Just me" / Option 2 "Me and a partner" / Option 3 "My family" / "Continue" / "Skip for now" / Progress label "1 of 11"
- **Source frame:** Comprehensive Mental Health Assessment > Gender selection (`22401:36915`) — repurposed the 3-radio-card pattern.
- **Notes:** Source had an "I am Other" option with a custom text input + Aetheron placeholder example — input fields cleared. If "My family" needs an "Add family members" sub-flow later, the expandable structure is still available in the underlying instance.

### - [x] 2.3 Personal info
- **Status:** ✅ Done 2026-05-12 (inserted between 2.2 and the original 2.3) — frame `24321:249404` in Patient page > Flow 2 section
- **Purpose:** Capture the few pieces of personal info not collected at Sign Up — display name (what therapist sees), gender (for therapist matching per US-002), DOB confirmation, and phone (fills the email-or-phone gap from US-001).
- **User stories:** US-001 (auth completeness), US-002 (therapist preferences input)
- **Key elements:** Top Nav with "2 of 11" progress, page heading, "About you" section with 4 inputs (Full name, Gender, Date of birth, Phone number with +234 prefix), "Continue" CTA, safety reassurance footer
- **DS components:** Top Nav, Section Header, Input Text (with label/placeholder/helper), Button (primary)
- **Copy:** "Tell us a bit about you" / "About you" section / "Full name" + "Your name" placeholder / "Gender" + "Select your gender" / "Date of birth" + "DD / MM / YYYY" / "Phone number" + "+234" prefix + "000 000 0000" / "Continue" / "Your information is safe. We never share it outside your care team."
- **Source frame:** Profile Setup & Account Completion > full account-setup form (`22404:2962`) — original was 2986 tall with 4 sections (General, Nationality + address, Health Information, Insurance). Trimmed by hiding Nationality, Health Information, Insurance sections + ID Card Number row.
- **Result:** Frame trimmed from 2986 → ~1218 tall. 4 essential fields only.
- **Notes:** "+234" phone prefix defaults to Nigeria — should swap based on selected region (1.3) or detected country. Display name vs legal name: this collects display name (visible to therapist); legal name from Sign Up is internal-only. Worth confirming with team whether ALL fields should be required or some optional.

### - [x] 2.4 Primary concern category
- **Status:** ✅ Done 2026-05-12 — frame `24322:250985` in Flow 2 section, row 1 col 4
- **Purpose:** Capture client's primary concern. Drives plan recommendation per Appendix A3.
- **User stories:** US-002
- **Copy:** "What brings you here?" / Tiles: Anxiety & stress · Loss & grief · Family & relationships · Trauma & abuse · Identity & belonging · Something else / Progress "3 of 9"
- **Source:** Health goals tile screen (`22398:34615`)
- **Notes:** Source has 6 tile slots — the full 13 categories from Appendix A3 will need an expanded layout or scrollable list. Current 6 are condensed groupings.

### - [x] 2.5 Severity / impact level
- **Status:** ✅ Done 2026-05-12 — frame `24322:251000` in Flow 2 section, row 1 col 5
- **Purpose:** Mild / Moderate / Severe assessment for plan recommendation.
- **User stories:** US-002
- **Copy:** "How are you feeling overall?" / Chips: Severe · High · Moderate · Mild · Doing fine / Progress "4 of 9"
- **Source:** Stress level chips (`22402:26091`)

### - [x] 2.6 Sleep level
- **Status:** ✅ Done 2026-05-13 — frame `24334:129238` in Flow 2 section, row 1 col 6
- **Purpose:** Capture sleep quality. Feeds Sleep % in 2.14 result.
- **User stories:** US-002
- **Copy:** "How well do you sleep?" / Stepper 1–5 with descriptive label "About 4–5 hours, lightly" / "Continue"
- **Source:** Mental Health Assessment > Sleep stepper (`22401:45568`)
- **DS components:** Stepper, Button

### - [x] 2.7 Mood
- **Status:** ✅ Done 2026-05-13 — frame `24334:129255` in Flow 2 section, row 1 col 7
- **Purpose:** Capture current mood self-rating. Feeds Mood % in 2.14 result.
- **User stories:** US-002
- **Copy:** "How's your mood lately?" / "I feel neutral." (label updates with mood-emoji selection)
- **Source:** Mental Health Assessment > Mood selector (`22401:40103`)
- **DS components:** Mood Emoji Picker, Button

### - [x] 2.8 What lifts your mood
- **Status:** ✅ Done 2026-05-13 — frame `24334:129288` in Flow 2 section, row 1 col 8
- **Purpose:** Positive-psychology counterweight — surface activities/people that help. Strengths data for therapist context.
- **User stories:** US-002
- **Copy:** "What lifts your mood?" / Search "Search activities, people, places…" / "5 suggestions" / Chips: Music, Time outdoors, Time with friends, Cooking, Reading / Selected examples: Family, Exercise / "Continue"
- **Source:** Mental Health Assessment > Tag picker with search (`22402:24405`)
- **DS components:** Input Text (search), List Item ×5, Chip ×N (selected), Button

### - [x] 2.9 Urgency
- **Status:** ✅ Done 2026-05-12 — frame `24322:251021` in Flow 2 section, row 1 col 9
- **Purpose:** How soon to be matched (Today triggers Crisis banner per Appendix A3).
- **User stories:** US-002
- **Copy:** "How soon would you like to talk?" / Options: Today (I need help right now) · This week (I'd like to start soon) · This month (Soon, but not urgent) · No rush (Just exploring options) / Progress "5 of 9"
- **Source:** Meditation time radio (`22402:1921`)

### - [x] 2.10 Session format preference
- **Status:** ✅ Done 2026-05-12 — frame `24322:251036` in Flow 2 section, row 1 col 10
- **Purpose:** Video / voice / chat / in-person preference.
- **User stories:** US-002, US-027 (therapist-set formats)
- **Copy:** "How would you like to meet?" / Options: Video call (Face-to-face online) · Voice call (Audio only, no camera) · Chat (Text-based session) · In person (Meet at the therapist's office) / Progress "6 of 9"
- **Source:** Same radio pattern as 2.9 (`22402:1921`)

### - [x] 2.11 Language preference
- **Status:** ✅ Done 2026-05-12 — frame `24322:251051` in Flow 2 section, row 1 col 11
- **Purpose:** Therapist language preferences. Multi-select.
- **User stories:** US-002, US-039
- **Copy:** "Which languages do you prefer?" / "Choose one or more" / 30 chips populated with English, Yoruba, Igbo, Hausa, Pidgin, Swahili, French, Spanish, Portuguese, Arabic, Mandarin, Hindi, German, Italian, Dutch, Russian, Twi, Zulu, Amharic, Wolof, Bengali, Tagalog, Cantonese, Korean, Japanese, Turkish, Vietnamese, Polish (some repeat to fill the chip grid) / Selected default: English, Yoruba / Progress "7 of 9"
- **Source:** "Things that make you happy" search + chips (`22402:22772`)

### - [x] 2.12 Therapist preferences (optional)
- **Status:** ✅ Done 2026-05-12 — frame `24322:251105` in Flow 2 section, row 1 col 12
- **Purpose:** Optional therapist gender preference for matching per US-002.
- **User stories:** US-002
- **Copy:** "Any therapist preferences?" / "Optional. These help us refine your match." / Options: Female therapist · Male therapist · No preference / "Continue" + "Skip for now" / Progress "8 of 9"
- **Source:** Gender selection cards (`22401:36915`) — Aetheron custom input cleared.
- **Notes:** Could expand to include age band + therapy approach preferences in a later iteration.

### - [x] 2.13 Assessment processing
- **Status:** ✅ Done 2026-05-13 — frame `24334:129580` in Flow 2 section, row 1 col 13 (rebuilt with proper loader template)
- **Purpose:** Loading state while we compute the wellness snapshot (score + Stress/Sleep/Mood breakdown) shown in 2.14. Therapist match-finding happens later in Flow 5.
- **User stories:** US-002
- **Copy:** "Putting your snapshot together…" / Animated loader graphic / No Top Nav (full-screen loader)
- **Source:** Profile Setup > "Generating your freud score…" loader screen (`22545:58159`) — purpose-built scoring loader.
- **DS components:** Loader (animated)

### - [x] 2.14 Assessment result
- **Status:** ✅ Done 2026-05-13 — frame `24333:128721` in Flow 2 section, row 2 col 1 (rebuilt from richer template)
- **Purpose:** Show intake outcome with score, severity band, and category breakdown (Stress / Sleep / Mood — all now backed by 2.5/2.6/2.7 inputs). Routes into Flow 3 (profile setup) → Flow 4 (plan selection) per US-002.
- **User stories:** US-002, US-030
- **Copy:** "Your wellness check" / Score "61.2" + "Moderate stress" / "Based on what you shared" / "Some signs of stress" / "This isn't a diagnosis. Your therapist will go deeper with you in your first session. Here's a snapshot to start the conversation." / "How to read your score" section with bands: Doing well, Mild stress, Some support, High support / "What you shared" breakdown: Stress 68%, Sleep 54%, Mood 42% / "Continue setup" (→ Flow 3.1) + "How did we get this?"
- **Source:** Profile Setup > Assessment Result template (`22405:5954`) — rich score card with gauge + breakdown.
- **DS components:** Score Gauge, Badge Text, Section Header, Score Range Cards, Stat Rows, Button (primary + secondary text)
- **Notes:** Per copy guidelines — replaced clinical language ("Anxiety Disorder (GAD)", "Diagnosis") with "snapshot" + "your therapist will go deeper" framing. No clinical claims in user copy.

### - [x] 2.15 Intake skipped / dismissed
- **Status:** ✅ Done 2026-05-12 — frame `24322:251170` in Flow 2 section, row 2 col 2
- **Purpose:** Confirmation when client opts out of intake mid-flow per US-002.
- **User stories:** US-002
- **Copy:** "You can complete this later" / "We'll save your progress. Pick up anytime in Settings." / "Continue to home" CTA
- **Source:** "Ready to commit" screen (`22403:36461`)
- **Notes:** Currently no secondary CTA ("Resume intake"). Add later if user testing shows users want a quick "back to where I was" path.

---

## Flow 3 — Profile Setup

After intake (or after sign-in for returning incomplete users). Captures display details + emergency contact. Triggered per US-001 onboarding completion path.

**Source section:** `Profile Setup & Account Completion` (`22545:60042`) — 30 screens in template

### - [x] 3.1 Profile setup intro
- **Status:** ✅ Done 2026-05-13 — frame `24333:128642` in Patient page > Flow 3 section, row 1 col 1
- **Purpose:** Set expectations for Flow 3. 3-step progress (Assessment ✓ done, Profile = next, Choose plan = after) mirrors 2.1 intake intro pattern.
- **User stories:** US-001 onboarding completion
- **Copy:** "A few quick profile touches." / "Help your therapist recognise you and reach you in a crisis. Takes about a minute." / Steps: "Assessment" — "Done — we know what you're working on." / "Profile" — "Next — pronouns, emergency contact, notifications." / "Choose plan" — "After — pick what fits your needs and budget." / "Let's go" + "Skip for now"
- **Source:** Mental Health Assessment > 3-step intro (`22401:35734`) — same shell as 3.5 closer, different state markers.
- **DS components:** Step Card ×3, Button (primary + secondary text)

### - [x] 3.2 Pronouns (optional)
- **Status:** ✅ Done 2026-05-13 — frame `24333:62886` in Patient page > Flow 3 section, row 1 col 2
- **Purpose:** Capture pronouns so the therapist can address client correctly.
- **User stories:** US-001
- **Copy:** "Which pronouns do you use?" / "Helps your therapist refer to you correctly. Optional." / Radios: "She / her", "He / him", "They / them" / Custom input helper "Or type your own pronouns" / "Continue" + "Prefer not to say"
- **Source:** Mental Health Assessment > Gender single-select (`22401:36915`) — repurposed; added 3rd radio for They / them by cloning option 2.
- **DS components:** Radio + Text, Input Text, Button (primary + secondary text)

### - [x] 3.3 Emergency contact (optional but encouraged)
- **Status:** ✅ Done 2026-05-13 — frame `24333:63162` in Patient page > Flow 3 section, row 1 col 3
- **Purpose:** One contact for crisis follow-up per US-025 / US-026 context.
- **User stories:** US-025, US-026
- **Copy:** "Emergency contact" / "One person we may reach in a crisis. Optional — you can add this later." / Inputs: Full name (placeholder "Their name"), Phone number (placeholder "+234 000 000 0000"), Relationship (placeholder "e.g. Parent, partner, friend") with helper "Your therapist may contact this person in a crisis." / "Save contact" + "Skip for now"
- **Source:** Profile Setup template shell (`22404:29664`) — illustration replaced with 3 stacked Input Text instances.
- **DS components:** Input Text (size lg) ×3, Button (primary + secondary text)
- **Notes:** Friction-free skip respected. Consent toggle deferred to v2 — current "Your therapist may contact" helper communicates intent.

### - [x] 3.4 Notification preferences (initial)
- **Status:** ✅ Done 2026-05-13 — frame `24333:63217` in Patient page > Flow 3 section, row 1 col 4
- **Purpose:** Push notification opt-in defaults.
- **User stories:** US-001
- **Copy:** Top nav "Stay in touch" / "Pick what you'd like to hear about. Change anytime in Settings." / Section "Notifications" / Rows: Session reminders / Therapist messages / Wellness tips / Crisis follow-ups / Marketing & updates (off by default). Each row has supporting text. "Continue" CTA.
- **Source:** Profile Settings > Notifications screen (`22539:81139`) — Insight section removed; 5 General rows relabelled; Continue CTA appended.
- **DS components:** Settings Complex (toggle row) ×5, Section Header, Button (primary)

_Flow 3 closes on 3.4 Notification preferences. Continue CTA routes directly into 4.1 Plan selection intro (the same 3-step shell, now serving as Flow 4 opener — see Flow 4 below)._

---

## Flow 4 — Plan Selection & Subscription

**Entered from:** Flow 3.4 Notifications (Continue CTA). Plan choice is the final onboarding step before the Home dashboard. 4.1 "Maybe later" path routes to Home with a default Essential / free tier (TBD with team).

The pricing UI per Appendix B. Currency is always one of NGN or USD — never both for the same user. Plans grouped by segment: Individual (Essential/Balance/Thrive), Couple (Together/Harmony/Restore), Family (Home/Family Care/Family Thrive).

**Source section:** components from `Mobile App Components` frame (`Pricing Tier`, `Features List`) + bespoke screens. No direct template section — design fresh.

### - [x] 4.1 Plan selection intro
- **Status:** ✅ Done 2026-05-13 — frame `24333:128498` in Patient page > Flow 4 section, row 1 col 1
- **Purpose:** Plan-selection opener mirroring 2.1 (intake intro) and 3.1 (profile intro). 3-step progress (Assessment ✓, Profile ✓, Choose plan = next) sets context before the pricing screens.
- **User stories:** US-001 onboarding completion → US-003 plan selection
- **Copy:** "Pick a plan that fits you." / "Choose how often you'd like to talk and what extras you want. Change anytime." / Step cards: "Assessment" — "Done — we know what you're working on." / "Profile" — "Done — your therapist will know how to greet you." / "Choose plan" — "Next — pick what fits your needs and budget." / "See plans" + "Maybe later"
- **Source:** Mental Health Assessment > 3-step intro (`22401:35734`) — same shell as 2.1 / 3.1, different state markers.
- **DS components:** Step Card ×3, Button (primary + secondary text)
- **Notes:** "See plans" → 4.2 Plan recommendation hero. "Maybe later" → Home dashboard with default Essential / free tier (TBD with team — confirm whether plan is required to enter app or can be deferred).

### - [x] 4.2 Plan recommendation hero
- **Status:** ✅ Done 2026-05-13 (rebuilt) — frame `24352:134427` in Patient page > Flow 4 section, row 1 col 2
- **Purpose:** Single-plan offer hero with value prop, what's included, trust signal, social proof, and FAQ — the recommended plan from the assessment, pre-highlighted.
- **User stories:** US-030, US-002
- **Copy:**
  - Top Nav: "Recommended for you" / "Based on what you shared"
  - Hero: "Balance is your match. 💛"
  - 3 value props: "4 sessions a month" — "Weekly therapy with a licensed therapist matched to you." / "AI Companion + self-care tools" — "Daily mood, sleep, and mindfulness support between sessions." / "Crisis Support Access" — "A direct line when things get hard."
  - Trust: "Cancel anytime — no questions asked"
  - Pricing: "₦18,000 per month" / "Change plans anytime in Settings."
  - Social proof: "4.8 on App Store" / "Loved by thousands of clients"
  - FAQ: "Why did we pick this plan?" / "Can I change my plan later?" — "Yes — change anytime in Settings." / "What if I need crisis support?" / "How are sessions scheduled?"
  - CTAs: "Start with Balance" + "See all plans"
- **Source:** Profile Setup > Free trial value-prop (`22405:42524`) — single-offer hero with FAQ. Far better fit than the earlier therapist-detail attempt (now deleted).
- **DS components:** Top Nav, Step Items ×3, Trust Badge, Price Display, Stars Rating, Accordion ×4, Button (primary + secondary text)
- **Notes:** FAQ answers populated for one item ("Can I change my plan later?"); other 3 still have placeholder bodies — fill in next iteration.

### - [x] 4.3 All plans (segmented)
- **Status:** ✅ Done 2026-05-13 — frame `24337:133860` in Patient page > Flow 4 section, row 1 col 3
- **Purpose:** Browse all plans across segments. Segment toggle (Individual / Couple / Family) on top filters the card list.
- **User stories:** US-030
- **Copy:** "All plans — Individual" heading (changes with segment) / Monthly / Annually toggle / "Essential — ₦0 — Pay-as-you-go therapy. Self-care tools included." / "Balance — ₦18,000 — 4 sessions a month + everything in Essential." / "Change plans anytime." / Continue
- **Source:** Profile Setup > Pick Your Right Plan (`22405:29336`) — adapted with Mindenity plan names and NGN pricing.
- **DS components:** Tab Group (Monthly/Annually + segment), Pricing Tier ×3, Button
- **Open work (deferred to next iteration):**
  - Source template has 2 plan cards; Mindenity has 3 per segment (Essential/Balance/Thrive for Individual). Need to clone a 3rd card.
  - Add Segment Tab Group (Individual / Couple / Family) above Monthly/Annually toggle.
  - Couple segment shows Together/Harmony/Restore; Family shows Home/Family Care/Family Thrive (alt-states of this same screen).
- **Alt-state (not a separate screen):** Promo banner — when active, prepend Alert & Notification component at top with promo name, % off, end date; show strikethrough pricing on cards. Per US-014.

### - [x] 4.4 Confirm plan
- **Status:** ✅ Done 2026-05-13 — frame `24334:130923` in Patient page > Flow 4 section, row 1 col 4
- **Purpose:** Review chosen plan before payment.
- **User stories:** US-030, US-010
- **Copy:** "Confirm your plan" / "Balance — ₦18,000 per month. Renews monthly. Cancel anytime." / "Confirm" + "Back"
- **Source:** Profile Settings > Cancel-confirm modal (`22539:73560`) — repurposed as plan confirmation.
- **DS components:** Button (primary), Button (secondary)
- **Open work (deferred):** Currently terminal aside from 4.5 handoff. Payment flow needs to slot in between 4.4 and 4.5 — TBD: build dedicated payment screens (Payment method, Processing, Success) modeled on Therapist Appointment payment templates (`22519:44768`, `22520:26765`, `22520:27812`), or fold into existing booking flow (Flow 6). Confirm with team.

### - [x] 4.5 Welcome to Mindenity
- **Status:** ✅ Done 2026-05-13 — frame `24358:134956` in Patient page > Flow 4 section, row 1 col 5
- **Purpose:** Bridge between onboarding completion and Home. Confirms setup is done, soft-introduces async therapist matching, hands off to Home.
- **User stories:** US-001 onboarding completion
- **Copy:** "Welcome to Mindenity." / "Your plan is active. Your therapist match will be ready shortly — for now, let's start exploring." / "Go to home"
- **Source:** Profile Setup > "Your freud plus free trial has begun!" (`22405:47469`) — single-CTA completion celebration.
- **DS components:** Button (primary)
- **Notes:** Therapist matching is **deliberately deferred to post-onboarding** — runs async server-side after 4.4 confirm, surfaces on Home via "Find your therapist" card when ready (handoff to Flow 5). 4.5 is intentionally light — Home itself handles multi-action first-use guidance, not this bridge.

---

## Flow 5 — Therapist Discovery

**Reached from:** state-aware **Therapist Appointment card on Home** (7.1). The card adapts to user state — no Tab Bar slot needed; therapy is contextual:

| User state | Home card state | Tap routes to |
|---|---|---|
| Just onboarded, no therapist yet (empty / first-day) | "Your therapist" — "You haven't matched with a therapist yet. Find one when you're ready." / **"Find a therapist"** CTA (built on 7.1d) | 5.1 Directory |
| Async match completed, not yet picked | "Your matches are ready" (7.1 alt-state e) | 5.1 Directory with matches pinned at top |
| Has therapist, no upcoming session | "Book your next session" | Flow 11 Booking |
| Has therapist + upcoming session | Session info (date/time) | Flow 11 Session detail |

**Secondary entry points:**
- **Settings → Manage therapist** (Flow 17) — for changing therapist
- **12.2 Crisis sheet → "Message my therapist"** — direct message to assigned therapist (Flow 12.3, not browse)
- **AI Companion → human escalation** (Flow 9) — when AI suggests talking to a real therapist

**Why no Tab Bar slot for therapy:** Tab Bar = Home · Companion · 🚨 Crisis · Resources · Profile. Therapy is reached when the user has therapy-intent (booking, browsing, matching) — those moments are state-driven, surfaced contextually via Home card. Most clients pick one therapist and stick — daily nav for "browse therapists" isn't a real workflow.

**Not part of onboarding** — onboarding ends at 4.5 Welcome → Home. This keeps time-to-value short (≤4 screens for free tier path) and lets matching run async without blocking the user from the app's core (AI Companion, journaling, mood tracking).

Browse, filter, save, compare therapists. International visibility filtering applies per US-039.

**Source section:** built from Components catalog (`Doctor Card`, `Doctor Review`, `Availability Slot`) + bespoke. No single existing template section for the directory itself.

### - [x] 5.1 Therapist directory home
- **Status:** ✅ Done 2026-05-13 — frame `24382:16835` in Patient page > Flow 5 section, row 1 col 1
- **Purpose:** Browse therapists, default sort by best match + availability. Entry from Home post-onboarding.
- **User stories:** US-007, US-008, US-016, US-039
- **Copy:** Top nav "Find your therapist" / "We've matched you with therapists based on your assessment. Filter to refine." / Filter chips: **"Best match"** (default selected) · "All therapists" / 4 therapist cards (Dr. Adaeze Nwosu — Anxiety & stress · Dr. Taiwo Adekunle — Couples therapy · Dr. Ifeoluwa Bello — Grief & loss · Dr. Chinedu Eze — Trauma & recovery), each with rating, "Online" badge, "Available [today/this week/next week]"
- **Source:** Therapist Appointment > filtered listing (`22518:43660`) — adapted from PTSD-specific framing to generic directory.
- **DS components:** Top Nav, Filter Chip Group, Therapist Card ×4
- **Open work:**
  - **Distance fields removed** from cards (template originally showed "500m", "125m" etc.) — Mindenity is online-only therapy, no location tracking.
  - **"Available Remotely"** replaced with "Online" / "Available [time]" — implicit for online platform.
  - **Search icon added 2026-05-13** (in Top Nav area) — tap → 5.2 Search results (search-active state).
  - **"My Therapists" tab from spec dropped** (along with 5.6 panel and ❤️/star icon) — therapy isn't shopping; clients have one therapist, not a saved list.

### - [x] 5.2 Search results
- **Status:** ✅ Done 2026-05-13 — frame `24382:16847` in Patient page > Flow 5 section, row 1 col 2
- **Entry:** Tap **search icon on 5.1** (added 2026-05-13). 5.2 is the search-active state of the directory.
- **Purpose:** Live search results by name / specialisation / language.
- **User stories:** US-008
- **Copy:** Active query "anxiety" / "All results (23)" · "Most relevant" / Therapist cards (Dr. Adaeze Nwosu — Anxiety & stress · Dr. Marjorie Okonkwo — Anxiety specialist (CBT)), Online badges, availability labels
- **Source:** Therapist Appointment > search results (`22518:42009`) — distance fields and location address removed.
- **DS components:** Search Input (active), Top Nav, Filter Chip Group, Therapist Card ×N
- **Open work:**
  - **"No results" empty state** spec'd but not built — needs separate alt-state frame (`22518:41732` "No result found" is a candidate source).
  - **Location address removed** ("Elementary Street 221b, 94025" deleted) — GPS distance irrelevant to online-only platform.
  - Distance and "Available Remotely" same cleanup as 5.1.
  - **Region/country search (per US-039)** — could add a region filter chip ("Nigeria" / "International") as polish, since therapists have country attached. Different from GPS distance — this is administrative region. Defer to 5.3 filter pass.

### - [x] 5.3 Filter sheet
- **Status:** ✅ Done 2026-05-13 — frame `24387:73286` in Patient page > Flow 5 section, row 1 col 3
- **Purpose:** Comprehensive filter panel reached from 5.1 / 5.2.
- **User stories:** US-008, US-028, US-039
- **Copy:** "Filters" / "Refine your matches." / Filter rows: Specialty (Anxiety & stress) · Availability (Mornings 6 AM – 12 PM) · Session format (Voice call / Video — In-Person dropped) · Gender preference (Female / Male / No preference) · Languages (English, Yoruba, +3 more) · Experience (Highly Experienced >10y) · Rating (4 stars and above) · Price range (₦8,000 – ₦30,000) / "Show 23 therapists" CTA
- **Source:** Therapist Appointment > Filter sheet (`22518:43624`)
- **DS components:** Bottom Popup Drawer, Input Text rows, Button options, Range Slider, Button (primary)
- **Cleanup applied:**
  - **Location row dropped** entirely (online-only platform, no geo data)
  - **Consultation Type → Session format**; In-Person option dropped
  - **Phone Call → Voice call** (per Flow 2.10 alignment)
  - **Price range $500–$2,000 → ₦8,000–₦30,000** (NGN, realistic Mindenity pricing)
  - Specialty placeholder "PTSD Expert" → "Anxiety & stress" (less clinical)
  - "Morning (1AM - 1PM)" typo → "Mornings (6 AM – 12 PM)"
  - All field labels switched to sentence case (per copy guideline)
- **Open work (from spec):**
  - **Plan filter** ("My plan" toggle) — not present in template. Add in polish pass.
  - **"Show all therapists" toggle** (Int'l only, per US-039) — not present. Add for International region users.
  - **"Clear all"** secondary CTA — only "Show 23 therapists" primary present.

### - [x] 5.4 Therapist detail profile
- **Status:** ✅ Done 2026-05-13 — frame `24387:73322` in Patient page > Flow 5 section, row 1 col 4
- **Purpose:** Full therapist profile reached from tapping a therapist card on 5.1 / 5.2.
- **User stories:** US-007, US-009
- **Copy:** Top nav "Therapist" / Hero: "Therapist" badge · "Dr. Adaeze Nwosu" · "Anxiety & stress therapist" · "Verified" tag · "4.9 (243)" rating / Tabs: Overview / Review / About / "Dr. Nwosu is a licensed therapist with 8 years of experience supporting clients through anxiety, work stress, and life transitions. She uses CBT and mindfulness-based approaches." / Session format: Voice call · Video (In-Person dropped) / Pricing: "Online" / "₦18,000 / session" / Monday–Friday 9 AM–5 PM / Upcoming Slots: Today (07/08/09 AM, varying availability) · Tomorrow (same) / "Mindenity-verified therapist" credential / "Online therapy via Mindenity" / "Available via Mindenity messaging"
- **Source:** Therapist Appointment > Therapist detail (`22518:47812`) — previously used for 4.2 attempt then dropped. Finally fits here.
- **DS components:** Top Nav, Hero Card, Rating, Tab Group, Bio block, Pricing rows, Availability Slot grid, Credentials Card
- **Cleanup applied:**
  - **Clinical role labels** (Psychiatrist / Psychologist / "Certified Psychiatrist") → "Therapist" / "Anxiety & stress therapist" / "Verified" per copy guideline ("Therapist | Never use: Doctor" for role terms; "Dr." personal title kept).
  - **"Dr. Hannibal Lector, MD"** → "Dr. Adaeze Nwosu" (Mindenity-aligned)
  - **Bio** rewritten with Mindenity-aligned framing (CBT + mindfulness)
  - **In-Person availability row dropped** entirely (+ divider between in-person/remote) — online only
  - **Remote / $150/person** → **Online / ₦18,000 per session**
  - **In-Person session format option dropped**
  - **"Hannibal Wellness Center 123 Fictional Lane, Baltimore, MD"** → "Online therapy via Mindenity"
  - **Email reference** "hanniballector@wellness.com" → "Available via Mindenity messaging"
  - **"Lector Clinics"** credential → "Mindenity-verified therapist"
- **Open work (from spec):**
  - **"Save therapist" bookmark** — not yet wired; spec calls for it on the hero.
  - **Monthly availability calendar** — template has "Upcoming Slots" (Today / Tomorrow) but not a full monthly view. Could extract to 5.5 Therapist availability calendar (expanded) when built.
  - **Reviews preview** — Review tab present but no review cards visible. Build review cards in polish pass.
  - **Sticky "Book session" bottom CTA** — spec calls for sticky bottom. Current frame may not have it; needs verification + add if missing.
  - **Languages section** spec'd but unclear if present in current frame.

### - [x] 5.5 Therapist reviews & ratings (was 5.7)
- **Status:** ✅ Done 2026-05-13 — frame `24396:77898` in Patient page > Flow 5 section, row 1 col 5
- **Purpose:** Read full reviews. Reached from tapping "Reviews" tab on 5.4, or "See all" on 5.4's review preview.
- **User stories:** US-007 (review trust signal)
- **Copy:** Top nav "Reviews" / Hero: Dr. Adaeze Nwosu · Therapist · Anxiety & stress therapist · Verified · 4.9 (243) / Aggregate: "4.9 / Average rating / 243 clients" + 5-star breakdown / Review themes: **Positive** (Listens well · Compassionate · Helpful approach · Professional) · **Negative** (Not the right fit · Communication · Scheduling · Approach) / Search "Search reviews" / 2 sample review cards with realistic Mindenity-aligned bodies
- **Source:** Therapist Appointment > Reviews tab view (`22570:72906`)
- **DS components:** Top Nav, Hero Card, Rating Bar (aggregate), Star Breakdown, Theme Chips, Search Input, Review Card
- **Cleanup applied:**
  - **Negative review themes** "Rude / Arrogant / Selfish / Greedy" → "Not the right fit / Communication / Scheduling / Approach" (constructive framing, per copy guideline warm/supportive voice — not judgmental)
  - **Positive review themes** "Skill / Conversation / Bedside Manner / Attitude" → "Listens well / Compassionate / Helpful approach / Professional" (drops medical jargon "bedside manner")
  - **Review counts** changed to match 4.9/243 (consistent with 5.4 hero) instead of 4.2/1,215
  - **Sample review bodies** rewritten Mindenity-aligned (no "Dr. Lector incredibly insightful" / "bad person" judgment)
  - **Clinical role labels** swapped same as 5.4 (Psychiatrist → Therapist, Hannibal → Adaeze Nwosu)
- **Open work:**
  - Review cards beyond the 2 visible — need population in v2
  - "Sort by" dropdown from spec not yet present
  - Star breakdown bar widths may not match new 4.9 aggregate distribution (still showing old proportions); polish pass

### ~~5.6 My Therapists panel~~ — **Dropped 2026-05-14**

Therapy isn't shopping. Clients have **one active therapist** for the duration of their subscription, not a saved list.

Reasons:
1. **Therapy mental model ≠ shopping cart.** A client picks one therapist intentionally — they don't curate a portfolio of candidates.
2. **5.10 Comparison was already dropped** — a save-list mostly justifies itself by feeding comparison. No comparison → no save-list.
3. **Change-therapist flow is reached from Settings** (Flow 17 → Manage therapist → 5.1 Directory). No persistent saved-list screen needed between selection and the rare change moment.
4. **No save-affordance either** (no ❤️/star icon on cards). Adding bookmarking implies the wrong mental model.

Spec items US-016 (limit 5 saved) deprecated for v1. Revisit only if user research shows clients want to compare candidates before committing.

### ~~Flow 5 alt-states / chrome (not separate screens)~~ — **Trimmed 2026-05-13**

Spec items originally numbered 5.5, 5.6, 5.8, 5.10–5.13 demoted from canonical screens to alt-states / patterns. Pattern matches Flow 4 (14→5 trim), Flow 7 (8→2 trim), Flow 12 (5→4 trim).

- **~~5.5 Therapist availability calendar (expanded)~~** — Redundant with 5.4's "Upcoming Slots" section + Flow 11 Booking's Date & Time step. "View availability without booking" isn't a real workflow.
- **~~5.6 Therapist accepted plans (expandable card)~~** — Already an accordion section on 5.4 per spec wording ("expandable card"). Build as 5.4 section in polish pass.
- **~~5.8 Save to "My Therapists" feedback~~** — Toast/snackbar pattern, not a screen. Use Alert & Notification component on save action.
- **~~5.10 Multi-therapist comparison~~** — Same critique as 4.7 plan comparison (dropped): friction theater. Max 5 saved therapists, user can scroll the 5.6 panel.
- **~~5.11 Empty state — no therapists match~~** — Alt-state of 5.1 / 5.2 when filter returns zero. Source candidate: `22518:41732` "No result found". Build as alt-state when polishing.
- **~~5.12 International availability notice~~** — Filter chip on 5.3 (open work) + badge on cards in 5.1 / 5.2. Not a screen.
- **~~5.13 Plan-incompatible therapist notice~~** — Inline Alert & Notification on 5.4 + on cards. Not a screen.

---

## Flow 6 — Booking & Payment

End-to-end session booking. Region routes to Paystack (NG) or Stripe (Int'l) per US-019, US-037. Pricing breakdown shown before payment per US-010.

**Plan-aware split (locked 2026-05-14):**
- **Subscription users** (Balance / Thrive / Together / Harmony / Restore / Home / Family Care / Family Thrive): subscription pays for sessions monthly, no per-booking pricing/payment. Path: 6.1 Pick time → 6.2 Cadence → 6.4 Review → **6.15 Confirmation**. Skip 6.5–6.14.
- **PAYG (Essential)**: pay per session. Path: 6.1 Pick time → 6.4 Review → 6.5 Pricing → 6.7 Payment method → 6.11 Processing → 6.12/6.13 Success/Fail → 6.15 Confirmation. No 6.2 Cadence (1 session at a time).
- 6.5–6.14 (pricing + payment screens) are **PAYG-only path** for v1.

**Source section:** `Therapist Appointment` (`22571:47187`) — 37 screens for booking variations.

### - [x] 6.1 Pick a session time (date + time combined)
- **Status:** ✅ Done 2026-05-14 — frame `24446:5214` in Patient page > Flow 6 section, row 1 col 1
- **Purpose:** Single-screen date + time picker. Vertical day list (Today / Tomorrow / Wed-Mar-13 / Thu-Mar-14 / Fri-Mar-15) with time-slot strip per day. No calendar grid — modern UX (Calendly-style) with less cognitive load.
- **User stories:** US-007, US-040
- **Copy:** Top nav "Pick a session time" / Therapist hero (Dr. Adaeze Nwosu, kept from 5.4 lineage) / "Available slots" section / 5 day rows with time chips per day / "Continue" sticky bottom CTA
- **Source:** Cloned 5.4 Therapist detail (`24387:73322`) → stripped Tab Group, About, Session format, Availability, Experience, Language, Office, Contact sections. Kept Top Nav + therapist hero + Upcoming Slots wrapper. Cloned Tomorrow row 3× → 5 days total.
- **DS components:** Top Nav, Therapist Hero (mini), Section Header, Availability Slot rows ×5, Button (sticky)
- **Open work / decisions:**
  - **Combined 6.1 + 6.2** per design call (no separate Time slot picker screen)
  - **Calendar grid dropped** — vertical day-list + slots is the canonical pattern
  - **Therapist hero kept** — confirms which therapist client is booking
  - Day labels currently illustrative — wire to actual therapist availability data
  - Continue CTA disabled state until slot picked (interaction spec, polish pass)
  - Timezone indicator from spec ("All times in your timezone — WAT") not yet present — add as supporting text under "Available slots" header in polish pass

### ~~6.2 Select time slot (original spec)~~ — **Merged into 6.1 (2026-05-14)**

Combined into 6.1 "Pick a session time" — vertical day list with time-slot strips per day on a single screen. No two-step date-then-time. Modern UX (Calendly pattern) reduces friction.

Spec items deferred to polish:
- Morning / afternoon / evening groupings within a day
- Session duration label (30 / 60 min)
- Timezone warning if therapist TZ differs 8+ hrs (US-040.7) — add as Alert & Notification on 6.1 when triggered

### - [x] 6.2 Confirm cadence
- **Status:** ✅ Done 2026-05-14 — frame `24450:6356` in Patient page > Flow 6 section, row 1 col 2
- **Purpose:** After picking 1st slot on 6.1, prompt for recurring vs custom cadence. Recurring-by-default with override (Calendly pattern). Encourages weekly therapy commitment without being rigid.
- **User stories:** US-007, plan adherence
- **Copy:** Top nav "Make it recurring?" / "Lock in your weekly slot" / Heading "Make it recurring?" / "Wed 10 AM × 4 weeks. Therapy works best weekly. Skip a week anytime." / Primary "Yes, book all 4" / Secondary "Customize each week"
- **Source:** Cloned biometric-setup shell (`22404:29664`) — illustration dropped, heading + 2 buttons retained
- **DS components:** Top Nav, Heading, Body Text, Button (primary + secondary text)
- **Flow logic:**
  - "Yes, book all 4" → 6.3 (Session details review with 4 sessions listed)
  - "Customize each week" → return to 6.1 with week 2 active, repeat until 4 picked
  - On therapist-availability mismatch (same slot unavailable in week N) → soft prompt "Wed 10 AM unavailable Mar 27. Try Wed 11 AM or Thu 10 AM?"
- **Notes:** Tertiary "Just this session for now" considered then dropped — user already picked plan with 4 sessions/month, defaulting to 1-only contradicts plan intent. PAYG (Essential) users skip this screen entirely (1-at-a-time booking model).

### ~~6.3 Session format selection~~ — **Dropped 2026-05-14**

Format already picked in 2.10 Session format preference during onboarding. Asking again per session = decision fatigue (4 sessions × format pick = 4 redundant choices). Most clients stick with same format for continuity. Per-session override belongs on session detail (Flow 11), not booking flow.

Recurring-by-default logic from 6.2 carries to format — same format across all 4 sessions.

### - [x] 6.4 Session details review
- **Status:** ✅ Done 2026-05-14 (rebuilt by user as standalone) — frame `24461:52492` in Patient page > Flow 6 section. Earlier wizard-based attempts (`24452:6469`, `24453:15418`) deprecated.
- **Purpose:** Confirm therapist + 4-session schedule + format + cadence before pricing breakdown.
- **User stories:** US-010
- **Copy:**
  - Top nav: "Review" / "Review your booking" / "Confirm before pricing"
  - **Stepper** (5 steps): Pick time ✓ Done · Cadence ✓ Done · **Review (you are here)** · Payment (up next) · Confirmation
  - **Therapist mini card**: Dr. Adaeze Nwosu · Anxiety & stress · Online · Available this week
  - **Review summary**:
    - Sessions (4) — Wed Mar 13 / Wed Mar 20 / Wed Mar 27 / Wed Apr 3, all 10:00 AM
    - Format — Video call · 50 min
    - Cadence — Weekly recurring · Skip a week anytime in Settings
  - CTA: "See pricing"
- **Source:** Cloned booking wizard shell (`22519:46932`) — Personal Info form content stripped, replaced with review summary frame + Settings Simple-style label/value pattern. First attempt used biometric shell (`24452:6469`) — dropped, weak fit.
- **DS components:** Top Nav, Stepper (5-step Wizard Step), Therapist Mini Card, Section Header rows, Body Text rows, Button (primary)
- **Why this template:** Wizard shell shows progress context (you're on step 3 of 5) reinforcing the multi-step booking flow. Better than bare biometric shell which gave no flow context.
- **Open work:**
  - Replace label/value text rows with proper **Settings Simple component instances** (label / value / chevron) for inline edit per row
  - Per-row Edit links (spec wanted; currently no inline edit)
  - PAYG (Essential) variant: 1 session, no Cadence row, no recurring framing
  - Stepper labels assume 5 steps — confirm with full Flow 6 architecture (currently 6.1/6.2/6.4/6.5+)

### - [x] 6.5 Pricing breakdown + Payment method
- **Status:** ✅ Done 2026-05-15 — frame `24466:57988` in Patient page > Flow 6 section
- **Purpose:** PAYG checkout: review pricing, pick payment processor (Paystack / Flutterwave / USSD), apply promo. Subscription users skip 6.5 entirely (sub covers cost).
- **User stories:** US-010, US-014, US-019, US-037
- **Copy:**
  - Top nav: "Pricing" / "Review what you'll pay"
  - Therapist mini card: Dr. Adaeze Nwosu · Anxiety & stress · Online · Available this week
  - **Payment Method** section — 3 processor rows: Paystack · Flutterwave · USSD
  - **Coupon Code** section: "Have a coupon code?" / Active state: "FIRSTTIME50" / "₦4,000 off applied"
  - **Payment Summary**: 1× Online session ₦8,000.00 / Discount -₦4,000.00 / Service fee ₦200.00 / Platform fee ₦100.00 / **Total ₦4,300.00**
  - 24h cancellation policy line at bottom
  - Primary CTA: "Continue to payment" → 6.6 Card selection
- **Source:** Cloned Therapist Appointment template (`22520:24767`) — body adapted to processor types + Mindenity pricing
- **DS components:** Top Nav, Therapist Mini Card, Payment Method rows ×3, Coupon Input, Settings Simple rows (pricing), Button (Brand Primary lg)
- **Cleanup applied 2026-05-15:**
  - Card list "Ending in ••8812 / ••2142 / ••3321 / Add New" → processor types Paystack / Flutterwave / USSD
  - Total math fixed (was broken ₦100; now ₦4,300 = ₦8,000 - ₦4,000 promo + ₦200 service + ₦100 platform)
  - Line items: "4× Online session" → "1× Online session" (PAYG = 1 at a time)
  - Sentence case: "Platform Fee" → "Platform fee"
  - Exclamations dropped: "let's enter it here!" → "Have a coupon code?", "50% OFF Discount code applied!" → "₦4,000 off applied"
  - Top nav placeholders filled
  - CTA "Checkout" → "Continue to payment"
- **Inline coupon merged from spec'd 6.6** — 6.6 Apply promo dropped as separate screen.

### ~~6.6 Apply promo code~~ — **Merged into 6.5 (2026-05-15)**

Inline expandable coupon section on 6.5. Not a separate sheet.

### - [x] 6.6 Card selection
- **Status:** ✅ Done 2026-05-15 — frame `24471:156176` in Patient page > Flow 6 section
- **Purpose:** Pick which saved card to pay with, after choosing Card method on 6.5.
- **User stories:** US-019, US-037
- **Copy:** Top nav "Card selection" / "Pick a saved card or add a new one" / "Select saved card" / 3 saved cards (Ending ••8812 / ••2142 / ••3321) / "Add New" link → 6.7 / Primary "Pay ₦4,300.00"
- **Source:** Bespoke build (user)
- **DS components:** Top Nav, Card Row instances, Button (primary)
- **Cleanup applied 2026-05-15:** Top nav placeholders filled, Pay total aligned to ₦4,300 (matches 6.5)

### ~~6.7 Payment method — NG~~ — **Repurposed to 6.7 Add new card (2026-05-15)**

Per user restructure. Original spec — separate NG / Int'l Payment Method screens — collapsed into 6.5's Payment Method section (region-aware processor list).

### - [x] 6.7 Add new card
- **Status:** ✅ Done 2026-05-15 — frame `24471:155968` in Patient page > Flow 6 section
- **Purpose:** Form to add a new card. Reached from 6.6 "Add New".
- **User stories:** US-019
- **Copy:** Top nav "Add card" / "Add a new card" / "Save it for faster checkout next time." / Card preview / **Card details** section: Cardholder name / Card Number / Expire / CVV / "Save card" CTA
- **Source:** Cloned `22520:25269` Add Debit form template — Billing Address section dropped
- **DS components:** Top Nav, Card Preview, Input Text fields, Button (primary)
- **Cleanup applied 2026-05-15:**
  - Top nav "Book Session" → "Add card"
  - Heading "Add New Debit" → "Add a new card"
  - Subtitle "Add your new debit in here." → "Save it for faster checkout next time."
  - Section "General Information" → "Card details"
  - Field placeholder "Shinomiya Kaguya" → "Cardholder name"
  - **Billing Address section dropped** — Paystack/Stripe handle billing on their side; not needed for NG cards
  - CTA "Continue" → "Save card"

### ~~6.8 Payment method — Int'l~~ — **Merged into 6.5 (2026-05-15)**

Region-specific payment methods now handled inline by 6.5's Payment Method section (processor list adapts to region — Paystack/Flutterwave for NG, Stripe/Apple Pay/Google Pay for Int'l). Not a separate screen.

### ~~6.9 Paystack checkout shell~~ — **Out of scope (2026-05-15)**

Paystack hosted UI / SDK owns this surface. No Mindenity-designed wrapper needed. Agent's frame `24466:54131` can be deleted.

### ~~6.10 Stripe checkout shell~~ — **Out of scope (2026-05-15)**

Stripe Elements / Stripe Checkout owns this surface. Same rationale as 6.9. Agent's frame `24466:54166` can be deleted.

### - [x] 6.11 Payment processing
- **Status:** ✅ Done 2026-05-15 — frame `24474:156638` in Patient page > Flow 6 section
- **Purpose:** Loading state while processor confirms transaction. PAYG only.
- **User stories:** US-019, US-037
- **Copy:** "Processing payment…" / "Don't close the app — we're confirming your booking."
- **Source:** Cloned `22520:26765` purpose-built loader

### - [x] 6.12 Payment success
- **Status:** ✅ Done 2026-05-15 — frame `24474:156643` in Patient page > Flow 6 section
- **Purpose:** Payment confirmation. Routes to 6.15.
- **User stories:** US-019, US-037
- **Copy:** "Payment confirmed" / "Your session with Dr. Adaeze Nwosu is booked for Wed, Mar 13 · 10:00 AM." / "See my booking" (primary) → 6.15 / "Done" (secondary) → Home
- **Source:** Cloned `22520:27812`
- **Cleanup applied:** "Payment Successful" → "Payment confirmed" · drop "Congratulations!" exclamation · "See Schedule" → "See my booking" · "Contact Support" replaced with "Done" (success doesn't need support CTA)

### - [x] 6.13 Payment failed — retry
- **Status:** ✅ Done 2026-05-15 — frame `24474:156655` in Patient page > Flow 6 section
- **Purpose:** Generic failure with retry. Slot still held (10 min). Per US-019.5.
- **User stories:** US-019, US-037
- **Copy:** "Payment didn't go through" / "Don't worry — your slot is held for 10 minutes. Try a different method or retry." / "Try again" (primary) / "Contact support" (secondary)
- **Source:** Cloned `22520:27800`
- **Cleanup applied:** "Payment Failed" → "Payment didn't go through" (warmer) · "Unfortunately, We couldn't process your payment." → "Don't worry — your slot is held for 10 minutes. Try a different method or retry." (sentence case + reassurance)

### - [x] 6.14 Payment failed — slot released
- **Status:** ✅ Done 2026-05-15 — frame `24474:156667` in Patient page > Flow 6 section
- **Purpose:** Slot held timeout expired. Must re-pick. Per US-019.6.
- **User stories:** US-019, US-037
- **Copy:** "Slot released" / "Sorry, we couldn't hold your slot any longer. Pick a new time and we'll try again." / "Pick another time" (primary) → 6.1 / "Contact support" (secondary)
- **Source:** Cloned `22520:27800`
- **Cleanup applied:** Distinct copy from 6.13 — different recovery path (back to 6.1 vs back to payment)

### - [x] 6.15 Booking confirmation
- **Status:** ✅ Done 2026-05-15 — frame `24474:156679` in Patient page > Flow 6 section
- **Purpose:** Terminal screen after successful booking. Both subscription path (post-6.4) and PAYG path (post-6.12) land here.
- **User stories:** US-019.4 (confirmation persistence)
- **Copy:** "You're all set" / "Calendar invite + reminders are on the way. Dr. Adaeze Nwosu · Wed, Mar 13 · 10:00 AM · Video call · 50 min." / "Add to calendar" (primary) / "Go to home" (secondary)
- **Source:** Cloned `22520:27812`
- **Open polish:**
  - Subscription variant: append "Sessions remaining this month: 0" instead of payment summary
  - PAYG variant: append "Total paid · ₦4,300"
  - Add booking detail card (Settings Simple rows) for richer summary — currently single body line

### - [x] 6.16 Booking error alt-states
- **Status:** 🟡 Pending review — agent build, documented as alt-states on existing frames (no new Figma frames per DSI-3 spec)
- **Purpose:** Slot just got taken / therapist unavailable / network drop. Documented as overlay/alt-state annotations on 6.1, 6.4, and 6.7.
- **User stories:** US-019 (graceful failure)
- **Alt-states documented:**
  - **6.1 Slot taken** — alert on 6.1 "That slot was just taken. Pick another time." with auto-refresh of slot grid
  - **6.4 Therapist unavailable** — alert on 6.4 "Dr. Nwosu is unavailable. Return to search." with "Browse therapists" CTA routing to Flow 5
  - **6.7 Network drop** — alert on 6.7 "No connection. Check your network and try again." with "Retry" CTA
- **DS components:** Alert & Notification (destructive), Button
- **Notes:** Per DSI-3 §6.16 — error states are overlays/inline alerts, not standalone screens. Annotated directly on source frames rather than duplicating frames.

---

## Flow 7 — Home Dashboard

Default landing after onboarding completes. Mental health metrics, today's mood, upcoming session, AI companion entry.

**Source section:** `Home & Mental Health Metrics` (`22548:102299`) — 8 screen variants in template, plus components like `Health Metric Widget`, `Progress Metrics`.

### - [x] 7.1 Home dashboard (active client, has subscription)
- **Status:** ✅ Done 2026-05-13 — frame `24358:136339` in Patient page > Flow 7 section, row 1 col 1
- **Purpose:** Default home for active client with subscription + populated data.
- **User stories:** US-024, US-032 (assessment entry), US-033 (crisis FAB)
- **Copy / content:**
  - Greeting: "Hello, Ada 👋" / Today's mood: "Calm" / Tier badge: "Balance Plan"
  - Search: "Search Mindenity"
  - **Mental Health Metrics** section: Stress (68/100, "Slightly elevated") · Sleep (7h 12m, "Restful nights") · Mindful minutes (24 min, "On track") — replacing the source template's Heart Rate / Blood Pressure / Steps cards (clinical / wrong domain for mental-health platform)
  - Self Journaling card · Therapist Appointment card · Mindful Minutes card · Gratitude & Affirmations · AI Companion ("Hi Ada — I'm your AI Companion. Here for daily check-ins, breathing breaks, and a friendly ear between sessions.") · News & Resources
  - **AI Symptom Checker card removed 2026-05-16** (was sub-frame `24358:137326` in 7.1a, `24380:15388` in 7.1d) — Symptom Checker sub-feature killed in Flow 9 audit (no user-story backing). AI Companion card now carries the AI surface on Home.
  - Wellness Score explainer: "Your Wellness Score reflects your overall mental health — covering stress, sleep, mood, and mindful engagement."
- **Source:** Home & Mental Health Metrics > populated home (`22546:61913`) — chosen over `24353:49793` (empty-state variant) because spec is for an active client with data.
- **DS components:** Top Nav, Health Metric Widget ×3, Upcoming Consultation, Mood Card, Search Input, Tab Bar, Button (FAB), Section Header
- **Notes:**
  - 7.1 empty-state variant (every card "Let's set it up now") can use `24353:49793` as base — represents the first-day post-onboarding state before any data logged. Not a separate numbered screen.
  - **"Find your therapist" card placement TBD** — once therapist matching completes async, surface a prominent card here that routes to Flow 5 Therapist Discovery. Currently the Therapist Appointment card is generic "appointments" — needs a "your matches are ready" variant for first-time post-onboarding view.
  - Bottom nav and Crisis Support FAB visible in template — preserved.
  - 498 text nodes; this pass adapted the most visible copy. Full text audit (every card subtitle, every list-row label) still pending — flag as iteration 2.
  - **Clinical-data widgets fully purged** (2026-05-13): all instances of Heart Rate (bpm), Blood Pressure (mmHg), Steps, and clinical insight text across the home dashboard and its sub-frames have been replaced with Mindenity-collected metrics or removed. Rationale: Mindenity does not collect vitals via wearables/devices and shouldn't show data it can't compute.
  - **Social Connectedness removed** (2026-05-13): the source template's "Social Connectedness — 998 kcal — Interacted With" widget (which implied precise counting of people the user interacted with) was replaced with **Mood** (74/100, "Calm today"). Rationale: we cannot compute true social connectedness without proximity sensors / wearable data, and inferring it from community engagement would be a UX lie. Mood is the third pillar of the Stress/Mood/Mindful Minutes triad we already collect via Flow 2 (2.7) and daily check-ins.
  - **Sleep moved out of metrics triad** (per user edit 2026-05-13): Sleep gets a dedicated section deeper in the home (it has more dimensions: hours + quality + streak). The "right now" metrics triad on the home is now **Stress / Mood / Mindful Minutes**.
  - **Metrics Insight deep-dive purged** (2026-05-13): the sub-frame `24358:137760` (originally "Mental Health Metrics Insight" deep-dive within 7.1) had 3 problematic sections that implied data Mindenity can't collect:
    1. **Hydration card** (875ml + daily delta + "drink 2 more glasses") — no water-intake input mechanism. Removed.
    2. **Loneliness Rate (3%) + Interactions (12.8)** — no way to compute either; same problem as the Social Connectedness widget removed earlier. Removed.
    3. **Stress Level 12-segment hourly slider** ("Level 3 / Easily triggered") — implied hourly granularity we don't capture. Removed; stress is now represented only by the daily 0–100 card with week-strip.
    A misplaced "Wellness Score" label sitting on the Loneliness card was removed with that card. If we want a true Wellness Score header above the Stress/Mood/Sleep triad, add as a proper Section Header in the polish pass — currently absent from this deep-dive.
    Frame shrunk 2169h → 1264h. Verified 0 inaccessible-data references remaining. Verified 0 clinical refs and 0 Social Connectedness refs remaining in frame `24358:136339`.
  - **7.1 sub-frame consolidation** (2026-05-13): Source template `22546:61913` cloned with **9 carousel/state variant sub-frames** into 7.1. After audit:
    - **Kept inside 7.1** (4 sub-frames):
      - `24358:137141` "7.1a Home (scroll)" — canonical populated home (4062h scroll) for active client with data
      - `24358:137461` "7.1b Wellness Score info modal" — chrome dialog reached from tapping the Wellness Score
      - `24358:136356` "7.1c Crisis sheet trigger" — the surface containing 12.2 Crisis sheet card
      - `24380:14915` "7.1d Home (empty / first-day)" — empty-state variant for just-onboarded users with no logged data. All metric cards show "Let's set it up now" placeholders. Cloned 2026-05-13 from `22405:53581` after the initial cleanup pass dropped its equivalent. Greeting customized to "Hello, Ada!", "Essential plan" badge (free tier default), "Just getting started" mood placeholder, Freud → Mindenity refs swapped.
    - **Extracted to Flow 8** (1 sub-frame): `24358:137760` moved to new Flow 8 section, renamed to "8.1 Metrics Insight". Deep-dive content belongs with the dedicated Flow 8, not buried inside 7.1.
    - **Dropped** (4 sub-frames): `24358:136340` (minimal hero-only, just "Hello, Ada!"), `24358:137400` (mid-length variant, unclear state), `24358:137653` (duplicate metrics deep-dive with typo + double Stress card), `24358:137745` (short metrics summary). All were unlabeled source-template carousel variants without a clear state assignment.

### 7.1 alt-states (not separate screens)

The following are state variants of 7.1 with the same layout — different content in specific cards/regions. Documented here for design coverage; not numbered.

- **(a) Empty / first-day state** — Just-onboarded user with no logged data. Every metric card shows "Let's set it up now" empty-state copy. **Built 2026-05-13** as sub-frame `24380:14915` "7.1d Home (empty / first-day)" inside 7.1, cloned from template `22405:53581`. Same screen as the canonical home at t=0 — user transitions to 7.1a as they log data.
- **(b) No upcoming session** — Upcoming Session card replaced with empty-state: "Ready to book your first session?" + "Book a session" CTA. Per US-024.
- **(c) PAYG / Essential plan** — Tab Bar **center Crisis Support button** rendered in disabled/locked state with padlock overlay. Tap → upgrade prompt modal. Per US-033.5. (See chrome note below — Crisis lives in the Tab Bar center button, not a separate FAB.)
- **(d) Plan expired** — Amber Alert & Notification banner prepended above the metrics: "Access ends [date]" / "Renew now" CTA. Per US-031.5.
- **(e) Matches ready** — Therapist Appointment card replaced with "Your therapist matches are ready" variant linking to Flow 5. Surfaces post-async-matching, post-onboarding.

### 7.1 chrome (always-on UI elements)

Documented as components used by 7.1, not separate screens.

- **Notification bell** — Top-right of Top Nav. Bell icon with optional red-dot badge for unread. Tap → Flow 16 Notifications. DS: Top Nav (right-icon variant), Badge Icon (dot).
- **Bottom Tab Bar** — Persistent nav, 4 tabs flanking a prominent center button:
  - **Home** · **Companion** · 🚨 **Crisis Support (center)** · **Resources** · **Profile**
  - **Center button = Crisis Support primary action + brand mark.** Visually elevated (40×40 Button Icon, distinct from flat tab items). Most reachable thumb position. The button uses the **Mindenity brand mark as its icon** — intentional dual-use: brand recognition + crisis affordance. Mental model: "tap brand = get help." Pattern matches 7Cups and Wysa. Tap → opens **12.2 Crisis bottom sheet** (confirm-step pattern prevents accidental dial / escalation). The crisis sheet then routes to 12.3 (message therapist) or 12.4 (call support line).
  - This **replaces** the originally-planned bottom-right Crisis Support FAB — single source of Crisis affordance, no competing FABs on home. Pattern matches Instagram/Calm "center button = primary action".
  - **Per US-033.5 (PAYG / Essential plan):** Center button rendered in disabled/locked state with padlock overlay. Tap → upgrade prompt modal. Plan label clarifies the gating.
  - DS: Tab Bar, Button Icon (center, primary variant), Badge Icon (lock state).
  - **Open work:** Tab labels worth confirming with product (current: Home/Companion/Resources/Profile — should "Companion" be "Therapy" / "Sessions" to surface therapist-related views? TBD).

### - [x] 7.2 Today's mood prompt (sheet)
- **Status:** ✅ Done 2026-05-13 — frame `24367:140743` in Patient page > Flow 7 section, row 1 col 2
- **Purpose:** Sheet for quick mood log from the 7.1 Mood card or daily-check-in nudge. Feeds 7.1's Mood metric + 2.14 Wellness Score over time.
- **User stories:** wellness tracking (mood capture)
- **Copy:** "How are you feeling today?" / Dynamic selected-mood label "I'm feeling calm" (updates with selected emoji) / "Log mood"
- **Source:** Mood Tracker > daily check-in prompt (`22499:47583`)
- **DS components:** Mood Emoji Picker (5 levels), Button (primary)
- **Open work:** Source template has no Input Textarea for an optional note — spec called for one. Defer to v2 unless user research shows users want to annotate moods on this fast-log surface. The richer note + context capture happens in the dedicated Mood Tracker section (Flow 8) anyway.

### ~~7.3 Quick actions menu (drawer)~~ — **Dropped 2026-05-13**

Built then dropped after design review. Reasons:
1. **No clean trigger affordance** — bottom-right FAB conflicts with Crisis Support; top-right "+" has low discoverability; gestures are invisible.
2. **Functional redundancy** — every action a quick-actions drawer would expose is already reachable via Home cards (Mood / Journal / Therapist / AI Companion) and Tab Bar (Companion / Resources / Profile).
3. **Pattern mismatch** — peer mental-health apps (Calm, Headspace, BetterHelp, Talkspace) don't use quick-action drawers. Tab Bar + Home cards + one dominant CTA is the convention.
4. **Crisis clarity is paramount.** The Tab Bar center button is reserved for Crisis Support and **doubles as the Mindenity brand mark** — single, intentional, dual-purpose anchor (pattern: 7Cups, Wysa). Adding a quick-actions drawer would dilute both the brand recognition and the crisis affordance.

**Architectural note:** The sheet surface that opens from the Tab Bar center button (`24358:136356` / 7.1c) is the same shape a quick-actions drawer would have used. Confirmed kept as **Crisis-only** — no mixed content. The surface architecture isn't reusable for quick actions; it's a single-purpose crisis trigger.

Frame `24367:141213` deleted from Figma. If user research later shows a need for a quick-actions surface, revisit — at that point, **top-right "+" in Top Nav** is the cleanest trigger candidate (doesn't conflict with Crisis or sacrifice a Tab slot).

---

## Flow 8 — Mental Health Metrics

Tracking surfaces from the dashboard. Includes mood, sleep, stress, heart rate. Many components already designed.

**Source sections:** `Mood Tracker` (`22556:45332`), `Sleep Level` (`22557:63998`), `Stress Management` (`22550:44765`), `Home & Mental Health Metrics`.

### - [x] 8.1 Mental health metrics
- **Status:** ✅ Done 2026-05-15 — frame `24491:159783` in Patient page > Flow 8 section. Consolidated from old 8.1 (`24358:137760`, deleted) + the Wellness Score / AI Recommendations sub-frame from 7.1 (`24358:137400`, relocated and re-parented).
- **Purpose:** Single canonical home for all wellness tracking. Hosts Wellness Score composite + per-metric cards (Stress, Mood, Sleep) with weekly strips and insights + AI Recommendations strip. Replaces the original spec's separate Mood/Sleep/Stress home screens (old 8.3, 8.6, 8.9 — killed in audit).
- **User stories:** US-032
- **Copy / content:**
  - Top Nav: "Mental health metrics" / "Track and analyze your wellness"
  - Date filter: "January 2025"
  - **Wellness Score hero:** 88 / out of 100 · "Last updated: 3s ago" · "You are a very healthy individual. There's still room for improvement." · range legend (10–15 Depressed / 15–40 Stressed / 40–70 Moderate / 70–100 Thriving)
  - **Stress card:** "Stress" · 32 / 100 · −4 vs last week · "Within optimal range" · 7-day strip · "Your stress is slightly elevated today. A 5-minute breathing break or a journal entry can help."
  - **Mood card:** "Mood" · 4 / 5 · "Steady this week" · "Daily check-ins on track" · 7-day strip · "Your mood is steady this week — keep up the daily check-ins."
  - **Sleep Level card:** "Sleep Level" · 7h 15m · +8.8% vs last month · "Reach at least 8h average" · 7-day strip · "You're almost there! A consistent sleep schedule will help you meet your sleep goals."
  - **AI Recommendations:** Mindfulness > "Do Breathing Exercise" / "Take 3 minutes for box breathing. Lowers stress quickly." · Sleep > "Improve Sleep Hygiene" / "Wind down 30 min before bed. No screens, dim lights."
- **DS components:** Top Nav, Section Header ×N, Health Metric Widget pattern ×3, Line Chart ×3, Button (Weekly toggle), Wellness Score legend
- **Cleanup history (2026-05-15):**
  - Score Breakdown section dropped (5 rows duplicated per-metric cards; clinical labels like "Insomniac" violated tone rules).
  - Stale "Increase your daily water intake" descriptions in AI Recommendations replaced with metric-relevant copy.
  - "Mindfulness Level" relabeled to "Mindfulness" for consistency.
  - Frame renamed `8.1 Home & Mental Health Metrics` → `8.1 Mental health metrics`.
  - Top nav copy applied (was `Title Text` / `Supporting Text` placeholders).
  - Old 8.1 frame `24358:137760` deleted.
- **Open work flagged:**
  - **Per-card "Log" CTAs missing** — Stress, Mood, Sleep cards need entry-point buttons routing to 8.2/8.3/8.4 entry screens. Without these, the entry screens have no source.
  - **AI Recommendations placement** — does this section belong on the metrics screen, or on 7.1 Home, or in Flow 9 (AI Companion)? Currently lives on metrics; revisit when Flow 9 is built.
  - **Wellness Score data:** "88/100 demo" + range legend feel disconnected. Either explain how the score is computed or simplify.
- **Structural note:** This single screen replaces the intent of original Flow 8 spec entries 8.1 / 8.3 / 8.6 / 8.9. The original Flow 8 was over-decomposed (14 screens for 3 metrics). Audit applied: collapsed to 6 canonical screens (8.1 metrics overview + 8.2/8.3/8.4 entries + 8.5 unified history + 8.6 entry detail). Heart rate (old 8.11) and Connect device (old 8.13) deferred to V2 wearable scope.

### - [x] 8.2 Mood log entry
- **Status:** ✅ Done 2026-05-15 — frame `24488:158854` in Patient page > Flow 8 section, placed to right of 8.1 at (507, 100).
- **Purpose:** Capture a mood entry — emotion level (1–5) + contextual activity tags + optional note. Save returns user to 8.1 with the new entry reflected.
- **User stories:** wellness tracking (was originally split across 8.3 / 8.4 in spec — collapsed into 8.2 per DSI-8).
- **Source template:** `22499:47958` (Mood Tracker section — "Why do you feel depressed?" mood-entry form). Stripped activity-level / sleep-hours / socialize-count sliders, repurposed for clean mood log.
- **DS components used:** Top Nav (Type=Title), Mood Illustration (Level=3 Neutral, Size=md), Slider Mood (Emotion=3 Neutral, Type=Simple), Button (chip = Outlined Gray Md) ×9, Input Textarea, Button (Primary Brand Lg, full-width).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Log mood |
  | Top nav subtitle | How are you feeling right now? |
  | Emotion section header | Your mood |
  | Slider current-state label | (driven by Slider Mood variant — 1 - Depressed … 5 - Overjoyed) |
  | Activities section header | What's been going on? |
  | Activity chip options | Work · Sleep · Family · Social · Exercise · Therapy · Money · Health · Other |
  | Note section header | Anything you want to add? |
  | Note placeholder | Optional — a sentence is enough |
  | Primary CTA | Save entry |
- **Default state on open:** Slider at `3 - Neutral`, no chips selected, note empty, Save enabled.
- **Reassignment note:** Originally slotted as "Wellness history" — that screen is now deferred (covered partially by 8.1 deep-dive). 8.2 is the mood log entry per DSI-8.

### - [x] 8.3 Sleep log entry
- **Status:** ✅ Done 2026-05-15 — frame `24493:179070` in Patient page > Flow 8 section, placed at (3400, 100).
- **Purpose:** Conversational AI Freud-style log: "How many hours did you sleep last night?" — slider-driven single-question form. Diverges from the multi-field Mood entry (8.2) pattern; matches the Sleep Level section's conversational template style.
- **User stories:** wellness tracking
- **Source template:** `22502:31464` (Sleep Level — "How many hours of sleep do you usually aim for each night?" slider question, AI Freud onboarding pattern). Per-user direction.
- **DS components used:** AI Companion Text (Logomark + heading), Slider Single, Button (Primary Brand Lg, no icons).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | AI heading | How many hours did you sleep last night? |
  | Big number value | 7 (default; tracks slider) |
  | Caption | I slept around 7 hours last night |
  | Primary CTA | Save entry |
- **Entry point:** `Log` CTA on the Sleep card of 8.1 (still to be added — flagged in 8.1 open work).
- **Open polish:** Bed/wake separate times, quality slider, factor chips, and optional note were dropped — single-slider scope matches Sleep Level section template intent. If richer data is needed, follow up with sequential AI Freud-style questions (8.3a/b/c) rather than densifying this screen.

### - [x] 8.4 Stress log entry
- **Status:** ✅ Done 2026-05-15 — frame `24493:180411` in Patient page > Flow 8 section, placed at (3850, 100).
- **Purpose:** Conversational AI Freud-style log: "How stressed are you right now?" — 5-level slider (Level 1 → Level 5) with state heading + caption that mirror the slider value. Mirrors 8.3 sleep entry pattern.
- **User stories:** wellness tracking
- **Source template:** `22498:46901` (Stress Management — "How stressed are you today?" 5-level slider, AI Freud onboarding pattern).
- **DS components used:** AI Companion Text (Logomark + heading), 5-dot stepper slider, Button (Primary Brand Lg, no icons).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | AI heading | How stressed are you right now? |
  | Slider level label | Level 3 (default) |
  | State heading | Moderate |
  | Caption | I'm feeling some pressure but managing |
  | Slider hint | Drag the slider to adjust |
  | Primary CTA | Save entry |
- **Entry point:** `Log` CTA on the Stress card of 8.1 (still to be added — flagged in 8.1 open work).
- **Scale change flagged:** Template uses 1–5 levels, but 8.1 Stress card currently displays "32 / 100". **Mismatch.** Either update 8.1 Stress card to "Level 3 / 5" + matching insight thresholds, or accept the inconsistency. Recommend aligning 8.1 to 1–5 for parity.
- **Open polish:** Trigger chips and optional note were dropped — same single-slider scope as 8.3. If richer triggers/notes are needed, follow up as sequential AI Freud-style questions.

### - [x] 8.5 Wellness history
- **Purpose:** Single screen showing all past entries across Mood / Sleep / Stress, date-grouped. Replaces what would have been per-metric history screens. Entry detail expands inline within list rows (no separate entry-detail screen).
- **User stories:** wellness tracking, US-032
- **Key elements:** Top nav (`History` / `Your wellness over time`), metric tab group (`All · Mood · Sleep · Stress`), date range filter (`Week · Month · Year`), date-grouped list of entries (each row: metric icon + value + timestamp + tap-to-expand for note/tags/related session).
- **Status:** ✅ Done 2026-05-16 — frame `24498:180615` in Patient page > Flow 8 section, placed at (4300, 100).
- **Source template:** `22499:15602` (Stress Management — "Stress Level History" pattern). Generalized to unified wellness history.
- **DS components used:** Top Nav (Title variant), Section Header, Button (Link, "Newest first"), Health Metrics History ×6 (one per row), iPhone X status bar, Home Indicator.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Wellness history |
  | Top nav subtitle | Your wellness over time |
  | Filter label | All metrics |
  | Sort label | Newest first |
  | Date group 1 | Today |
  | Today row 1 | Level 4 · Happy mood · 11:42 PM |
  | Today row 2 | Level 3 · Moderate stress · 4:15 PM |
  | Today row 3 | 7h 15m · Good sleep · 7:30 AM |
  | Date group 2 | Yesterday |
  | Yesterday row 1 | Level 4 · Elevated stress · 9:08 PM |
  | Yesterday row 2 | Level 3 · Neutral mood · 2:30 PM |
  | Yesterday row 3 | 6h 40m · Fair sleep · 6:45 AM |
- **Entry point:** `History` link/button on 8.1 (placement TBD — flagged in 8.1 open work).
- **Open polish:**
  - **Filter is a label, not a tab group.** Spec called for `All · Mood · Sleep · Stress` tabs. Current state uses single "All metrics" label as a dropdown/filter. Replace with Tab Group instance when metric-filtering UX is needed.
  - **Row placeholder text** ("Item 1 / Item 2 / Status Text" + one "Consult with your doctor.") may still render if Health Metrics History inner booleans aren't fully toggled. Verify visually and toggle `Is Metadata Text` / `Is Status Text` false consistently across all 6 instances.
  - **Date range filter** (Week/Month/Year) from spec not yet added.
- **Note:** Original spec had separate per-metric history screens (8.2 Wellness history + 8.5 Mood history detail + 8.8 Sleep history + 8.12 Health metrics history list) — collapsed into this single unified view per Flow 8 audit (DSI-8). Entry detail expands inline (no dedicated detail screen — old "8.6 Entry detail" was killed in collapse).

---

**Flow 8 audit history (2026-05-15):** Original spec had 14 screens for 3 metrics. Collapsed to 5 canonical:
- **Killed (covered by 8.1 overview):** old 8.3 Mood home, old 8.6 Sleep home, old 8.9 Stress home, old 8.14 Metric widget detail.
- **Killed (covered by 8.5 unified history):** old 8.2 Wellness history, old 8.5 Mood history detail, old 8.8 Sleep history, old 8.12 Health metrics history list.
- **Killed (entry detail folded inline into 8.5 list rows):** old "8.6 Entry detail" — no separate screen.
- **Deferred to V2 (wearable scope):** old 8.11 Heart rate zones, old 8.13 Connect device. Mindenity is mental health — wearables need an explicit business case before we build.
- **Renumbered:** old 8.4 Mood entry → new 8.2 ✅; old 8.7 Sleep entry → new 8.3; old 8.10 Stress entry → new 8.4.

---

## Flow 9 — AI Companion

Conversational AI companion for daily check-ins, breathing breaks, and reflective support between therapist sessions. Feeds into the wellness profile.

**Source section:** `Mindful AI Companion` (`22572:67306`).

**Audit (2026-05-16):** Symptom Checker sub-feature (originally 9.6–9.13, 8 screens — anatomy diagram, severity sliders, Green/Amber/Red triage, etc.) **killed**. No user story mandates it (US-032 = "AI Mental Wellness Assessment" is covered by Flow 2 intake; US-025 is therapist-side; no other US references symptom triage). The screens existed only because the design system shipped an `AI Symptom Checker` UI kit section — pure DS noise. Mindenity is mental-health, not general medical; clinical body-part triage is wrong product direction. Defer to V2 only if a business case emerges.

### - [x] 9.1 AI Companion intro
- **Status:** ✅ Done 2026-05-16 (user-added) — frame `24502:220615` in Patient page > Flow 9 section, placed at (100, 100).
- **Purpose:** First-run intro that introduces the AI Companion to new users. One-time screen — does not show after first acknowledgement.
- **User stories:** AI onboarding, US-032 (adjacent)
- **Source template:** Mindful AI Companion section frame (user-picked from section `22572:67306`).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Heading | Your empathic AI health companion is here. |
  | Subtitle | Meet the next-generation assistant made to improve mental health |
  | Primary CTA | Get Started |
- **First-run gating:** show only when `user.has_seen_ai_companion_intro = false`. After acknowledgement, route directly to 9.3 home on subsequent visits.

### - [x] 9.2 AI Companion precautions
- **Status:** ✅ Done 2026-05-16 (user-added) — frame `24502:220541` in Patient page > Flow 9 section, placed at (575, 100).
- **Purpose:** Second first-run screen — sets safety expectations and discloses AI model limitations before the user starts using the companion. One-time screen — does not show after first acknowledgement.
- **User stories:** AI safety, regulatory disclosure, US-032 (adjacent)
- **Source template:** Mindful AI Companion section frame (user-picked from section `22572:67306`).
- **Final copy (sections):**
  | Section | Title | Body |
  | --- | --- | --- |
  | 1 | Not a Mental Health Advice | The AI Companion is not a substitute for medical advice — it's just an assistant. |
  | 2 | Information is Limited | Our LLM is trained on existing datasets, so it may not know recent info. |
  | 3 | Data Accuracy | Recommendations depend on the accuracy of your input and synced data. |
  | Heading | Precautions & Limitations | — |
- **First-run gating:** show only when `user.has_acknowledged_ai_companion_precautions = false`. Pair with 9.1 — both must be acknowledged before reaching 9.3.
- **Open polish:**
  - **Copy edits:** "Not a Mental Health Advice" → "Not medical advice" (sentence case, drop redundant "a"). "Our LLM is trained on existing data set" → "Trained on existing datasets" (sentence case, plural).
  - **Acknowledge CTA missing from current copy dump** — verify a "Got it" / "Continue" button exists; if not, add one.

### - [x] 9.3 AI Companion home
- **Status:** ✅ Done 2026-05-16 — frame `24501:220511` in Patient page > Flow 9 section (`24501:220510`, created), placed at (1050, 100). Renumbered from 9.1 → 9.3 when user added 9.1 intro + 9.2 precautions.
- **Purpose:** Canonical AI Companion entry. Greeting hero + single-prompt input row with a suggested starting prompt as placeholder. Reached after 9.1 + 9.2 on first run, directly thereafter. Matches the Mindful AI Companion section's immersive-mode pattern (one greeting + one input, no chip wrap).
- **User stories:** US-032 (AI assessment is a sibling), AI tools general
- **Source template:** `22537:55301` (Mindful AI Companion — Immersive Mode home, cleanest variant; tooltip-bearing sibling `22537:55344` rejected).
- **DS components used:** AI Assistant Immersive Text (sparkle icon + greeting), Frame (input row with microphone, prompt text, attachment, send-arrow icons), iPhone X status bar, Home Indicator.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Greeting | Hi Ada — I'm your Mindenity AI companion. Here for daily check-ins, breathing breaks, and a friendly ear between sessions. |
  | Input prompt (placeholder) | Tell me about your day |
- **Open polish:**
  - **No suggestion chips.** Original spec wanted `Talk about my day · Help me reframe · Just listen` chips above the input. Template doesn't ship them; matched template instead. Add as a chip wrap above input if quick-start UX is needed.
  - **No tab bar.** AI Companion is reachable from Tab Bar (per Flow 7 convention) — should the tab chrome be visible here? Decide based on whether 9.x screens are tab-rooted or modal-rooted.
  - **AI safety disclaimer redundancy?** 9.2 precautions covers this on first run, but on every visit consider a subtle inline tag (e.g. "Not a substitute for professional care") below the input.

### - [x] 9.4 AI Chat
- **Status:** ✅ Done 2026-05-16 — frame `24502:220819` in Patient page > Flow 9 section, placed at (1525, 100).
- **Purpose:** Active chat thread between user and Mindenity AI. Top nav identifies the AI, scrollable bubble history with timestamps, typing indicator, and a bottom input with privacy/safety helper text.
- **User stories:** AI tools, US-032 (adjacent)
- **Source template:** `22530:36839` (Mindful AI Companion — "Hello, who is this?" active-chat variant; cleanest opening exchange in the section).
- **DS components used:** Chat Top Nav (Name + Caption + Button Icon ×1), Chat Bubble ×3 (Recipient · Sender · Recipient), Chat Bubble (Typing variant), Chat Bottom Input (Input Text + Button Icon for send), iPhone X status bar, Home Indicator.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav name | Mindenity AI |
  | Top nav caption | Always here for you |
  | Bubble 1 (user) | Hi, I've had a rough day |
  | Bubble 2 (AI) | Hey Ada — I'm sorry to hear that. Want to tell me what happened, or would a breathing break help first? |
  | Bubble 3 (user) | Let me talk about it |
  | Bubble 4 | (typing indicator — AI is composing) |
  | Input label | Reply |
  | Input helper text | Your conversations are private — not a substitute for professional care. |
- **Open polish:**
  - **Suggestion chips below AI messages** (per original spec: e.g. "Breathing break", "Journal it", "Talk to a therapist") not added. Template doesn't ship them. Add as a chip wrap under the AI bubble when needed.
  - **Risk-threshold "Talk to a therapist" upsell** not represented. Likely a separate variant (9.4b) when the AI detects elevated risk language.
  - **Bubble timestamps** all show `11:25` from template — fine for demo but flag for real implementation.
  - **Input main-text placeholder** still reads `Type to start chatting...` (template default) — already on-brand; leave or change to "Type a message…" in polish pass.

### - [x] 9.5 AI immersive view
- **Status:** ✅ Done 2026-05-16 — frame `24502:220954` in Patient page > Flow 9 section, placed at (1950, 100).
- **Purpose:** Full-screen voice-mode reflective AI experience. User speaks; live transcript renders centered on a calming gradient backdrop. Tap microphone to start/stop. Companion view to 9.4 AI Chat — same brain, different modality.
- **User stories:** AI tools (voice mode), US-032 (adjacent)
- **Source template:** `22532:58578` (Mindful AI Companion — Voice Mode active state). Layered ellipses provide depth/halo aesthetic.
- **DS components used:** Badge Text ("Voice Mode" with status dot), centered transcript text node, Monotone microphone icon (48px fill), Rounded Section, iPhone X status bar (dark), Home Indicator (dark).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Status badge | Voice Mode |
  | Live transcript | I've been feeling overwhelmed lately. Too much at work and I can't switch off in the evening. |
  | Session timer | 02:25 |
- **Spec divergence flagged:**
  - **Breath pacer animation** from original spec not built — no DS component exists for it. If needed, this is closer to Flow 10 Self-Care territory (breathing exercises) than AI Companion.
  - **Soundscape control** from original spec not built — no DS component exists. Defer or add as polish with a Settings affordance.
  - The DS's "immersive" pattern is voice-first transcript display, not meditation/breath UX. Matched what shipped.
- **Open polish:**
  - **Stop / End session** affordance missing — only a microphone icon visible. Tap to stop OR a dedicated "End" button needed.
  - **AI response visualization** — currently only shows user transcript. When AI replies in voice, what visual indicator? (Pulsing halo? AI text overlay?) Decide pattern.
  - **Transcript timestamp** `02:25` could be ambiguous (session length vs clock time). Label as "Session 02:25" for clarity.

**Killed in 2026-05-16 audit (Symptom Checker sub-feature):**
- Old 9.6 Symptom Checker home
- Old 9.7 Symptom Checker — anatomy / body selection
- Old 9.8 Symptom Checker — symptom selection
- Old 9.9 Symptom Checker — duration / severity
- Old 9.10 Symptom Checker — additional context
- Old 9.11 Symptom Checker — analysis loading
- Old 9.12 Symptom Checker — result (risk level)
- Old 9.13 Symptom Checker — history

Reason: no user story mandates this sub-feature. US-032 ("AI Mental Wellness Assessment") is covered by Flow 2 intake + 9.3 AI Companion home — not a clinical anatomy/severity workflow. Symptom Checker came from the underlying Asklepios/Freud UI kit, not Mindenity requirements. Wrong product direction for mental-health focus. Defer to V2 only if a business case emerges.

**Downstream cleanup completed 2026-05-16:** AI Symptom Checker card removed from 7.1 Home dashboard (sub-frame `24358:137326` in 7.1a populated state, `24380:15388` in 7.1d empty state). AI Companion card retained on Home as the canonical AI surface.

---
## Flow 10 — Appointment Management

Manage existing sessions. Reached from the **Tab Bar 4th slot** (replacing the dead Self-Care destination). Users see the month at a glance, their next session as a hero card, and can drill into individual sessions to reschedule, cancel, join, or review feedback.

**Source section:** `Therapist Appointment` (`22571:47187`).

**Audit (2026-05-16):**
- **Renamed slot:** Was "Flow 10 — Self-Care Features" (18 screens — journaling, meditation, soundscape, breathing exercises). Zero user-story backing — same situation as Symptom Checker. Killed entirely.
- **Merged Flow 11 (Appointment Management) here.** Flow 11 had 13 screens; consolidated to 8 via audit (see below). Old Flow 11 is now a tombstone — no doc entries under that number.
- **Added new 10.1 Appointments home** — month calendar + next-session hero card. This screen didn't exist in old Flow 11. It's the Tab Bar destination and the most-used surface in the appointment system.
- **Collapsed:** old 11.1/11.2/11.3 (Upcoming · Past · By Therapist) → single tabbed `10.2 My sessions`. Old 11.4/11.5 (detail upcoming · detail past) → single tabbed `10.3 Session detail`. Old 11.10/11.11 (feedback + thanks) → `10.8 Post-session feedback` with inline thanks state.
- **Demoted to inline alerts/banners on 10.1 home** (no separate screens): old 11.12 Session expired, old 11.13 Therapist canceled.

### - [x] 10.1 Appointments home
- **Status:** ✅ Done 2026-05-16 — frame `24506:226448` in Patient page > Flow 10 section (`24504:221483`). Tab Bar destination. (User-picked frame; my original `24506:224891` deleted — week-strip pattern was weaker than the monthly subscription-aware design.)
- **Purpose:** Tab Bar destination for appointment management. Monthly view with subscription-aware booked/total progress (`2/4`), 4 session slot cards (booked + open), "Upcoming Appointment" hero card with quick actions, "How did it go?" prompt for the most recent past session. Plan-aware UX without extra chrome — the `N/M` progress label is the cleverest part.
- **User stories:** US-007, US-017, US-040 (cross-TZ display when applicable), US-031 (plan coverage visibility)
- **Source frame:** User-built `24506:226448` (template lineage unrecorded — likely derived from Therapist Appointment section + subscription-aware composition).
- **DS components used:** Top Nav (Type=Title), Section Header ("February 2026" + "2/4" progress label), 4 session slot cards (booked = therapist name; empty = "Open slot — book when ready"), Section Header ("Upcoming Appointment"), Doctor Card (Upcoming hero with avatar + specialty + Reschedule/Cancel), Section Header ("How did it go?"), Doctor Card (Needs-review hero with "Write a review" CTA), Tab Bar (Home · Companion · Sessions · More).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav (center title) | Appointments |
  | Subtitle | Here are your booked appointments for February |
  | Month header | February 2026 · 2/4 |
  | Slot 1 | Session 1 · Dr. Adaeze Nwosu — Wed, 7 Feb · 10:30 AM |
  | Slot 2 | Session 2 · Dr. Adaeze Nwosu — Wed, 14 Feb · 10:30 AM |
  | Slot 3 (empty) | Session 3 — Open slot — book when ready |
  | Slot 4 (empty) | Session 4 — Open slot — book when ready |
  | Upcoming section header | Upcoming Appointment · See All |
  | Upcoming card | Wed, 7 Feb · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · Weekly session · 50 min · Video · [Reschedule] [Cancel] |
  | Past-session prompt header | How did it go? |
  | Needs-review card | Wed, 31 Jan · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · "How was your last session?" · [Write a review] |
  | Tab Bar | Home · Companion · Sessions · More |
- **Cleanup applied (2026-05-16):**
  - **Typo fixed:** "you booked appointments" → "your booked appointments".
  - **Western placeholder names** (`Doctor Jamie F. Jones` ×3) → `Dr. Adaeze Nwosu` (Mindenity-branded, continuity across all sessions since they're on a 4-session plan with one therapist).
  - **Therapist ratings stripped** — `4.5 (1,587)` removed from both Upcoming hero card AND Needs-review card. Wrong UX on a personal appointments view (you're not shopping; the therapist is already yours).
  - **Specialty corrected:** `ADHD` → `Anxiety specialist`. Original read ambiguously — could imply the user has ADHD. Reframed as the therapist's specialty.
  - **Separator normalised:** `.` → `·` interpunct in "Session N · Dr. ...".
  - **Awkward session label:** "Usual Session & CBT Therapy" → "Weekly session · 50 min · Video".
  - **Empty-slot copy warmed:** "Appointment not booked yet" → "Open slot — book when ready".
  - **Needs Review label warmed:** "Needs Review" → "How did it go?"; review-prompt rewritten to "How was your last session?".
  - **Tab Bar:** "AI Buddy" → "Companion" (Mindenity convention from Flow 9). "Sessions" kept for brevity (vs. "Appointments" which is the screen title).
- **Open polish:**
  - **Tab Bar consistency:** `Sessions` here vs `Appointments` in the screen title is mild inconsistency. Confirm naming pact across all built screens before final.
  - **"See All"** on Upcoming Appointment section header should route to **10.2 My sessions**.
  - **Plan-aware progress (`2/4`)** semantics assume subscription. PAYG users need a different label (e.g. show booked-this-month count without denominator). Build a `10.1b PAYG variant` or handle inline.
  - **Empty-state (no sessions at all)** — template `22520:26819` exists ("You don't have any appointment for today / Explore Therapist"). Build as `10.1c Empty state` when needed.
  - **Exception banners** (Session expired · Therapist canceled) — add Alert & Notification area between top nav and month header when those states fire.

### - [x] 10.2 My sessions
- **Status:** ✅ Done 2026-05-17 — frame `24510:246529` in Patient page > Flow 10 section. (User-built; my original `24507:245326` deleted — single-section flat list was weaker than the time-grouped + filter-row design.)
- **Purpose:** Past-only feed of session abstracts, time-grouped (Last 30 days · January 2026 · …). Each row shows the therapist, date, and a 1–2 sentence excerpt summarizing what was discussed and recommended. Reads like a therapy memory / journal — patient can recall key takeaways without re-watching a recording. Reached from 10.1 "See All" link.
- **User stories:** US-017 (session history visibility), US-025 (post-session summary access)
- **Source frame:** User-built (`24510:246529`) — composed from Section Header chrome + filter row (search input + sort) + Upcoming Consultation card pattern repurposed as session summary card.
- **DS components used:** Top Nav (Type=Title), Filter row (Search Input + sort label `Newest first` + filter label `All sessions`), Section Header per time group, Upcoming Consultation ×5 (re-purposed as session summary cards — Avatar + therapist name + specialty + excerpt body + chevron-right for drill-into).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav (center title) | My sessions |
  | Filter label | All sessions |
  | Sort label | Newest first |
  | Search placeholder | Search sessions |
  | Time group 1 | Last 30 days |
  | Card 1 (Last 30 days) | Wed, 31 Jan · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · "Reviewed cognitive reframing for work stress. Dr. Nwosu suggested box breathing before meetings and journaling triggers nightly." |
  | Card 2 | Wed, 24 Jan · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · "Discussed sleep disruption and screen habits. Set a goal: no phone after 10 PM for a week." |
  | Card 3 | Wed, 17 Jan · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · "Mapped main stress triggers around deadlines. Dr. Nwosu recommended a 5-minute morning grounding practice." |
  | Time group 2 | January 2026 |
  | Card 4 | Wed, 10 Jan · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · "Onboarding deep-dive — Dr. Nwosu mapped your main stressors (work, sleep, social) and set the cadence for weekly sessions." |
  | Card 5 | Wed, 3 Jan · 10:30 AM · Dr. Adaeze Nwosu · Anxiety specialist · "First session — discussed goals for the year. Agreed to focus on workplace anxiety and sleep hygiene before holiday plans." |
  | Per-card action | (chevron-right — tap to drill into 10.3 Session detail) |
- **Excerpt source:** AI-generated summary of the session transcript + recommendations. Therapist can optionally add notes (Mindenity's clinical-grade addition layered on top of the AI summary). Surface a small "Therapist note added" indicator on cards where the therapist has annotated (not yet built — flagged below).
- **Cleanup applied (2026-05-17):**
  - `Search Mood` (template leftover from Mood Tracker source) → `Search sessions`
  - `All History` (template leftover) → `All sessions`
  - `Newest First` (Title Case) → `Newest first` (Mindenity sentence-case rule)
  - `January, 2026` (non-standard comma) → `January 2026` (matches Flow 8 convention)
  - Diversified the 3 cloned "Wed, 17 Jan" cards in January 2026 section: top card → `Wed, 10 Jan` (onboarding deep-dive), middle → `Wed, 3 Jan` (first session). Dropped the duplicate Jan 17 card from January 2026 section (already shown as the oldest in Last 30 days).
- **Open polish:**
  - **Date filter is a static label**, not an interactive dropdown. Add chevron-down icon + dropdown behavior (Last 30 days / Last 3 months / All time) in polish pass.
  - **No "Therapist note added" indicator** on cards. Add a small badge (e.g. `+ therapist note`) on cards where the therapist annotated the AI summary.
  - **Card tap target** — confirm whole card is tappable (routes to 10.3), not just the chevron.
  - **Empty state** for new users / users with zero past sessions — not built. Add `10.2b Empty state` ("Your sessions will appear here after your first one.")
  - **Tab Bar inconsistency** — `Sessions` here is fine (matches 10.1) but conceptually this screen IS the Sessions tab content; the active tab indicator should highlight Sessions. Verify Tab Bar Type variant + selected state during a polish pass across all Flow 10 screens.

### - [x] 10.3 Session detail
- **Status:** ✅ Done 2026-05-17 (rebuilt with richer template same day) — frame `24515:250174` in Patient page > Flow 10 section. (User-picked template `24515:250174`; my earlier frames `24510:249458` and the v1 deleted.)
- **Purpose:** Past-session executive summary — drilled into from 10.2 cards. The patient's recall surface: hero card with the session theme + meta, then a four-section deep dive — what was discussed, recommended actions, how to put them into practice (5 steps), and suggested resources. Closes with two CTAs.
- **User stories:** US-017, US-025 (past-session view of summary)
- **Source template:** `24515:250174` (user-picked from Therapist Appointment / Mental Health Metrics templates). Original frame name was "Home & Mental Health Metrics" — renamed to "10.3 Session detail" in place.
- **DS components used:** Top Nav (Title + supporting), Hero card (session theme + Dr. attribution + date/session#/time meta), Section Header ×4, Quote block, Recommended action cards ×3 (title + body + chevron), Step list ×5 (numbered with title + body), Resource cards ×2 (date + tag + title + counts), Final CTAs (Primary + Secondary Button), status bar, Home Indicator.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav (center title) | Session detail |
  | Top nav heading | Session summary |
  | Top nav subtitle | Wed, 31 Jan with Dr. Adaeze Nwosu |
  | Hero title | Cognitive reframing for work stress |
  | Hero body | You worked on noticing self-critical thoughts and reframing them in real time. |
  | Hero attribution | Dr. Adaeze Nwosu · 31 Jan 26 · Session 12 · 10:30 AM |
  | Section 1 header | What we discussed |
  | Section 1 body | You walked Dr. Nwosu through a rough work week — back-to-back meetings, sleep slipping. You mapped how self-criticism amplifies the stress and practiced reframing three real moments from your week. |
  | Section 1 quote | "You left with a clearer plan for high-stakes meetings." |
  | Section 2 header | Recommended actions |
  | Action 1 | Box breathing before meetings · 4-7-8 pattern, two cycles before any high-stakes call |
  | Action 2 | Trigger journal · Note one stress trigger nightly for two weeks |
  | Action 3 | Cognitive reframing · Use the 3-question check when self-criticism spikes |
  | Section 3 header | How to put this into practice |
  | Step 1 | Notice the spike — When stress lands, pause for 5 seconds before reacting. Name what you feel. |
  | Step 2 | Run the 3-question check — Is this thought true? Is it helpful? What would I tell a friend? |
  | Step 3 | Breathe before responding — Two cycles of 4-7-8 breathing settles the nervous system fast. |
  | Step 4 | Capture it tonight — One sentence in your trigger journal — what set it off, what you did instead. |
  | Step 5 | Review with Dr. Nwosu next week — Bring two real examples to next session — what worked, what didn't. |
  | Section 4 header | Suggested resources |
  | Resource 1 | 31 Jan 2026 · Stress · Cognitive reframing — a 5-minute primer |
  | Resource 2 | 31 Jan 2026 · Breathing · How box breathing calms a racing mind |
  | Primary CTA | Back to my sessions |
  | Secondary CTA | Ask the AI Companion |
- **Adaptation from template (2026-05-17):**
  - Template was a generic "recommendation deep-dive" page (centered on one health goal). Repurposed for session summary: hero card became the session theme card, "Summary" section renamed to "What we discussed", "Recommended Actions" populated with the session's 3 takeaways, "How to do it" repurposed as concrete steps for the lead recommendation (Cognitive reframing).
  - **Dropped "Recommended Therapists" section** — irrelevant on a past-session view (the patient already has Dr. Nwosu; this isn't a discovery surface).
  - **Replaced "Resolve Recommendation" / "Consult AI Assistant" CTAs** with "Back to my sessions" / "Ask the AI Companion".
  - All template's generic blood-pressure / step-by-step body copy rewritten Mindenity-tone for cognitive reframing + work stress narrative.
  - Sentence case applied ("Recommended Actions" → "Recommended actions", "Summary" → "What we discussed", "Suggested Resources" → "Suggested resources").
- **Spec divergence:** Original spec had state-aware Upcoming/Past behavior. Build is **past-only** to match 10.2 → 10.3 drill-in. Upcoming-state detail lives on 10.1 (Upcoming hero card) with Join/Reschedule/Cancel inline.
- **Open polish:**
  - **Therapist avatar** would strengthen the hero card — visual continuity with 10.2 cards.
  - **"Therapist's note"** distinct callout (separate from AI summary) not built in this version — the v1 had it; template doesn't naturally surface this distinction. Consider adding a small note block between the quote and Recommended actions.
  - **AI vs Therapist source tag** on recommendations / resources — small badge could clarify provenance.
  - **Resource cards' engagement counts (`878 · 3`)** — likes / saves carryover from template. Either populate with real numbers or hide if Mindenity doesn't surface social proof on therapeutic resources.
  - **"How to put this into practice"** is focused on the lead recommendation (Cognitive reframing). If the page is showing steps for ONE recommendation, label which recommendation. Or extract Steps into a recommendation-detail sub-screen (10.3b).

### - [x] 10.4 Reschedule session
- **Status:** ✅ Done 2026-05-17 — frame `24510:249588` in Patient page > Flow 10 section, placed at (1465, 100).
- **Purpose:** Pick a new slot from the therapist's availability. Same booking shell pattern as Flow 6.1, tagged for reschedule context.
- **User stories:** US-007, US-017
- **Source template:** `22520:27145` (Therapist Appointment — "Reschedule Your Appointment" with therapist card + availability calendar + slot grid + Today/Tomorrow groups).
- **DS components used:** Top Nav (Title + supporting), Therapist Mini Card (Avatar + name + specialty + status), Availability calendar (5 day pills), Section Header ("Choose Your Slot"), Today/Tomorrow grouped slot pills, Selected-slot summary line, Primary Button.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Reschedule |
  | Heading | Reschedule session |
  | Subtitle | Pick a new time with your therapist. |
  | Therapist card | Dr. Adaeze Nwosu · Anxiety specialist · Remote · Available this week |
  | Selected slot summary | New time: Today, 10:30 AM |
  | Primary CTA | Confirm reschedule |
- **Cleanup applied:** Therapist rating stripped (`4.5 (500)` removed — wrong UX, already chosen). Western name → Mindenity-branded. "500m" distance → "Remote" (no GPS).
- **Open polish:**
  - **Current slot highlight** not yet wired — slot grid shows generic Available/Unavailable. The user's CURRENT slot should be visually marked so they know what they're moving from.
  - **Reschedule policy line** ("Free up to 24 hours before") not surfaced inline. Add below the heading.

### - [x] 10.5 Cancel session
- **Status:** ✅ Done 2026-05-17 — frame `24510:249724` in Patient page > Flow 10 section, placed at (1920, 100).
- **Purpose:** Confirm cancellation, show policy upfront, collect a non-judgmental reason.
- **User stories:** US-031 (cancellation pattern), US-017
- **Source template:** `22520:50527` (Therapist Appointment — "Cancel Appointment" with therapist card + reason radio list + free-text + destructive CTA).
- **DS components used:** Top Nav (Title + supporting), Therapist Mini Card, Section Header ("Why are you cancelling?"), Radio + Text ×5, "Other" option, Input Textarea, Primary Button (destructive intent).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Cancel |
  | Heading | Cancel session |
  | Subtitle | Free up to 24 hours before. After that, the session is non-refundable. |
  | Therapist card | Dr. Adaeze Nwosu · Anxiety specialist · Remote · Wed, 7 Feb · 10:30 AM |
  | Reasons header | Why are you cancelling? |
  | Reason 1 | I have a scheduling conflict |
  | Reason 2 | I'm feeling unwell |
  | Reason 3 | I want a different therapist |
  | Reason 4 | My therapist asked to cancel |
  | Reason 5 | I don't need a session right now |
  | Reason 6 | Other |
  | Free-text placeholder | Optional — anything you'd like us to know |
  | Helper text | Shared with your therapist if you choose 'Other'. |
  | Primary CTA | Cancel session |
- **Cleanup applied:** Original template reasons were insurance/provider-language (clinical-medical context); rewritten Mindenity-tone. Therapist rating stripped, "500m" distance → "Remote". Subtitle line warned about ban ("Too many cancellation will get you banned") rewritten as factual refund policy (less punitive).
- **Open polish:**
  - **Destructive CTA visual** — primary button should use the Destructive variant (red) rather than Brand. Verify color swap.
  - **"Keep session" secondary CTA** missing — add a clear escape hatch above or beside the primary cancel.
  - **Sliding-scale refund policy** (e.g. "100% refund · 50% refund · No refund" based on time-to-session) not shown. Subtitle is binary; consider richer policy display when refund tiers apply.

### - [x] 10.6 Pre-session prep
- **Status:** ✅ Done 2026-05-17 — frame `24510:249857` in Patient page > Flow 10 section, placed at (2375, 100).
- **Purpose:** Pre-flight checklist shown shortly before the session start. Confirms readiness across connection, environment, and hardware.
- **User stories:** US-007 (onboarding to session)
- **Source template:** `22520:51005` (Therapist Appointment — "Before your consultation" checklist).
- **DS components used:** Heading + supporting line, 3× Checklist Item rows (title + Required pill), Primary Button.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Heading | Before you join |
  | Subtitle | A few quick things will help your session run smoothly. |
  | Item 1 | Stable internet · Required |
  | Item 2 | Quiet, private space · Required |
  | Item 3 | Headphones and camera · Required |
  | Primary CTA | Join session |
- **Cleanup applied:** "Psst..." playful copy → calm direct ("Before you join"). Items rewritten for clarity ("Stable Connection" → "Stable internet", "Well Lit Space" → "Quiet, private space", "Hi-Res Camera" → "Headphones and camera"). CTA "Understood, Join Call" → "Join session".
- **Open polish:**
  - **No countdown timer** — spec wanted a live 15-min countdown. Template doesn't ship one. Add a small Loader/timer above the heading in a polish pass.
  - **No "Test your audio/video" CTA** — useful affordance before joining. Could be a secondary button below the checklist.
  - **No "How have you been feeling?" prep reflection** — original spec wanted a short pre-session reflection. Optional; could push to AI Companion handoff instead.

### - [x] 10.7 In-call
- **Status:** ✅ Done 2026-05-17 — frame `24510:249927` in Patient page > Flow 10 section, placed at (2830, 100).
- **Purpose:** Active video session UI shell. Wrapper around the video SDK — visible chrome only (therapist name, timer, control buttons). Real video tiles + mute/camera state are SDK-rendered.
- **User stories:** US-007
- **Source template:** `22520:54105` (Therapist Appointment — In-session view with therapist label + timer + control bar).
- **DS components used:** Therapist label (name + specialty), Session timer, Control bar (icons), iPhone X status bar, Home Indicator.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Therapist name | Dr. Adaeze Nwosu |
  | Therapist specialty | Anxiety specialist |
  | Session timer | 02:55 |
- **Notes:** Most in-call UI (video tiles, mute, camera, chat) is provided by the video SDK. Only the chrome overlay is captured here.
- **Open polish:**
  - **"End session" CTA** not visible in the chrome — likely SDK-provided but confirm.
  - **Chat side panel** entry not designed — SDK or in-app surface?
  - **Connection-quality indicator** not present — important for therapy sessions where audio dropouts disrupt the conversation.
  - **Error variant** `22571:46725` ("Woops! We're experiencing issue!") exists — clone as `10.7b In-call error` when needed.

### - [x] 10.8 Post-session feedback
- **Status:** ✅ Done 2026-05-17 — frame `24510:249987` in Patient page > Flow 10 section, placed at (3285, 100).
- **Purpose:** Rate the session, leave a private note. Includes a "Skip for now" escape — feedback is optional, not a guilt-trip.
- **User stories:** US-025 (therapist-side reciprocity), US-017 (close the loop)
- **Source template:** `22520:51209` (Therapist Appointment — "Your Review" view with rating + textarea).
- **DS components used:** Therapist label (name + specialty), Section Header ("How was the session?"), Rating Bar (5-star), Section Header ("Your review"), Input Textarea, Primary Button, Link button.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Therapist name | Dr. Adaeze Nwosu |
  | Therapist specialty | Anxiety specialist |
  | Rating section | How was the session? |
  | Review section | Your review |
  | Review placeholder | How did it feel? What helped, what could be different? |
  | Review helper text | Only your therapist sees this. Stays private. |
  | Primary CTA | Submit feedback |
  | Secondary CTA | Skip for now |
- **Cleanup applied:** Placeholder text "Dr hannah was amazing, as usual but very boring xD 😊" → calm prompt. "Submit Review" → "Submit feedback" (Mindenity uses "feedback" elsewhere). "Skip this" → "Skip for now" (warmer).
- **Open polish:**
  - **Inline thanks state** (spec) not built — after Submit, the screen should swap to a thanks panel with "Book next session" + "Back to home". Build as `10.8b Thanks state` or a single-screen state swap.
  - **Quick chip feedback** (Helpful · Felt heard · Professional · Easy to talk to) from original spec not added. Template only ships rating + textarea. Add a chip row between rating and review if quick feedback is valuable.

---

## Flow 11 — MERGED INTO FLOW 10 (2026-05-16)

Flow 11 content (Appointment Management) has been moved to Flow 10's slot after Self-Care was killed for lack of user-story backing. The 13 original screens were audited down to 8 canonical screens (see Flow 10 audit note above). Flow 11 is now an intentional gap — keep the number reserved as a tombstone rather than renumbering all downstream flows (12–18) for cosmetic reasons.

Old Flow 11 entries mapped:
- 11.1/11.2/11.3 (Upcoming · Past · By-therapist) → **10.2 My sessions** (tabbed)
- 11.4/11.5 (Session detail upcoming · past) → **10.3 Session detail** (state-aware)
- 11.6 Reschedule → **10.4 Reschedule session**
- 11.7 Cancel → **10.5 Cancel session**
- 11.8 Pre-session prep → **10.6 Pre-session prep**
- 11.9 Join/in-call → **10.7 In-call**
- 11.10/11.11 (Feedback + Thanks) → **10.8 Post-session feedback** (inline thanks)
- 11.12 Session expired → demoted to inline alert on **10.1 Appointments home**
- 11.13 Therapist canceled → demoted to inline alert on **10.1 Appointments home** + push notification


---

## Flow 12 — Crisis Support

Crisis surface reached from Tab Bar center button (replacing the originally-planned FAB). 12.2 Crisis bottom sheet is the canonical surface; downstream actions (call · message · upgrade prompt) are sheets/links handled inline, not separate screens.

### ~~12.1 Crisis Support FAB~~ — **Restructured 2026-05-13**

The originally-planned soft-magenta FAB at bottom-right of 7.1 has been **replaced by the Bottom Tab Bar center button** (see 7.1 chrome). Single source of Crisis authority — no competing FAB. Tab Bar center button → opens 12.2 Crisis bottom sheet. Label "Crisis Support Access" per US-026.6 surfaces on the 12.2 sheet.

### - [x] 12.2 Crisis bottom sheet
- **Status:** ✅ Done 2026-05-13 — frame `24358:136386` in Patient page (lives inside 7.1's Tab Bar tapped-state at parent `24358:136385`).
- **Purpose:** Calm welcome with 2 actions per US-033.3. Reached from 7.1 Tab Bar center button.
- **User stories:** US-033, US-026
- **Copy:** "You are not alone." / "Reach out — we are here." / **Call a support line** (primary, urgent) / **Message my therapist** (secondary, async) / **Don't worry, I'm alright** (dismiss)

### Remaining Flow 12 entries — consolidated 2026-05-20

- **12.3 Message therapist — crisis context** — *handed off to 9.4 AI Chat pattern with a "Crisis context" banner overlay.* Therapist messaging at MVP is treated as a context-tagged variant of the AI Chat shell rather than a separate screen.
- **12.4 Call local crisis line** — *native OS handler.* Tapping "Call a support line" triggers the device's native `tel:112` (NG) or localized line per US-033.4. No designed screen — the action leaves the app.
- **12.5 PAYG upgrade prompt** — *modal/sheet, not a numbered screen.* Surfaces inline on 12.2 when a PAYG user taps the crisis button; reuses Flow 4 plan picker for the upgrade path.
---

## Flow 13 — DEFERRED TO V2 (2026-05-18)

**Killed:** Community feed sub-feature (originally 9 screens: feed, post detail, comments, create/edit/report post, notifications, following list, guidelines).

**Reason:** Zero user-story backing in `Mindenity_UserStories_v5_1.md`. Searched `communit`, `forum`, `group`, `peer.support` — only matches were group-therapy plans (Couple/Family), not community feeds. Same pattern as old Flow 9 Symptom Checker and old Flow 10 Self-Care: design-system template noise from the underlying Asklepios/Freud UI kit, not Mindenity product requirements.

**Why this kill matters more than the others:** Community in a mental-health app carries elevated risk the PRD doesn't address:
- **Moderation cost** — every post is a moderation surface; US-026 covers therapist crisis response to clients, not community moderation
- **Safe-messaging mandates** — flagged self-harm content needs automatic Flow 12 Crisis Support routing; building UI without policy is irresponsible
- **Privacy / consent** — peer-shared mental-health content needs different retention than 1:1 therapy data
- **Product fit** — Mindenity is positioned as 1:1 therapy; community is a strategic shift, not a UI sprint

**V2 path:** If product adds community to the PRD, build with proper moderation infrastructure + crisis triage + safe-messaging guidelines as prerequisites. No build until then.

---

## Flow 14 — DEFERRED TO V2 (2026-05-20)

**Killed:** Resources / Content hub (originally 16 screens — resources home, articles, videos, courses, course detail, lesson player, library, etc.).

**Reason:** Zero user-story backing. Searched the PRD for `resource / content / library / article / video` — no patient-app US references. Same pattern as Symptom Checker, original Self-Care, and Community: design-system template noise from the Asklepios/Freud UI kit, not Mindenity requirements.

**V2 path:** If product adds content/learning to the PRD, build with proper editorial/curation policy + content moderation prerequisites.
---

## Flow 15 — DEFERRED TO V2 (2026-05-20)

**Killed:** Achievements / gamification (originally 6 screens — overview, badges, streaks, levels, share achievement, milestone celebration).

**Reason:** Zero user-story backing. PRD `badge` references are admin-side plan-acceptance markers and therapist-tier badges, not client gamification. Same pattern as Symptom Checker / Self-Care / Community / Resources kills.

**Domain risk:** Gamifying therapy is risky in mental health contexts — incentivises performance over genuine engagement and can shame missed days. Defer until product has explicit safe-engagement policy.

**V2 path:** If product adds gamification, build with mental-health-safe engagement guidelines (no streaks that shame, no leaderboards, no public sharing).
---

## Flow 16 — Search & Notifications

Global search + notification center.

**Source section:** `Search & Notifications` (`22576:70870`) — 9 screens.

**Audit (2026-05-20):** Originally 7 screens. Old 16.5 Notification detail **dropped** — most Mindenity notifications route directly to the relevant screen (session reminder → 10.3; stress alert → 8.4; mood nudge → 8.2). A dedicated full-screen detail adds friction without unique value. Renumbered: old 16.6 → 16.5, old 16.7 → 16.6. Net 6 canonical screens.

### - [x] 16.1 Global search entry
- **Status:** ✅ Done 2026-05-20 — frame `24613:263235` in Patient page > Flow 16 section, placed at (100, 100).
- **Purpose:** Search across Mindenity (therapists, wellness metrics, AI surfaces). Auto-focus input, recent searches.
- **User stories:** discovery
- **Source template:** Search & Notifications section.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Search input | Search Mindenity |
  | Section | Recent searches |
  | Recent 1 | Dr. Adaeze Nwosu |
  | Recent 2 | Box breathing |
  | Recent 3 | Crisis support |
  | Recent 4 | Dr. Taiwo Adekunle |
  | Recent 5 | Sleep quality |
- **Cleanup:** `Search freud AI` → `Search Mindenity`; Western placeholder therapists → Mindenity-branded; killed-feature recents (Daily Affirmation, Journal Dec 22) → Mindenity-real (Box breathing, Crisis support); `Sleep Quality` → sentence case.

### - [x] 16.2 Search results — multi-tabbed
- **Status:** ✅ Done 2026-05-20 — frame `24613:263476` in Patient page > Flow 16 section, placed at (539, 100).
- **Purpose:** Search results scoped to therapist cards (primary search target). Future: more tabs (Resources, AI Companion threads).
- **User stories:** discovery
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Title | Search results |
  | Sort | Most relevant |
  | Card 1 | Dr. Adaeze Nwosu · Anxiety specialist · Remote · Available this week |
  | Card 2 | Dr. Taiwo Adekunle · Anxiety specialist · Remote · Available this week |
- **Cleanup:** Therapist names rebranded (Marjorie Black, Hannah Lector → Adaeze Nwosu, Taiwo Adekunle); ratings `4.5 (500)` stripped (consistent with 10.x); `500m` distance → `Remote` (no GPS rule); `Anxiety Expert` → `Anxiety specialist`; `Available Remotely` → `Available this week`; `Most Relevant` → sentence case.

### - [x] 16.3 Search empty state
- **Status:** ✅ Done 2026-05-20 — frame `24613:263271` in Patient page > Flow 16 section, placed at (978, 100).
- **Purpose:** No-results state with calm guidance.
- **User stories:** discovery graceful failure
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Heading | No results |
  | Body | Nothing matched "box breathing". Try a different word or browse therapists from Home. |
  | Query echoed | box breathing |
- **Cleanup:** `No result found.` exclamation tone → calm `No results`; oopsie copy → on-task guidance; `geGGVVV` gibberish placeholder → realistic query.

### - [x] 16.4 Notifications list
- **Status:** ✅ Done 2026-05-20 — frame `24613:264090` (was extra frame "Search & Notifications", **renamed** + repurposed; original empty 16.4 `24613:263265` deleted) in Patient page > Flow 16 section.
- **Purpose:** Notification center grouped by time (Earlier / Yesterday / Today). Tabs Unread/Read. Each card has actions inline for fast triage.
- **User stories:** engagement, US-007 (session reminders), US-033 (crisis follow-ups)
- **Final copy:**
  | Card | Title · Body · Inline actions |
  | --- | --- |
  | Daily journal nudge | "You haven't logged a mood today. A quick check-in helps your insights stay accurate." |
  | Box breathing reminder | "Your 3 PM box-breathing reminder is in 2 hours." · [Start now] |
  | Stress is climbing | "Stress hit Level 4 today. A short breathing break or chat with your AI Companion can help." · [Breathing break] [Talk to Companion] |
  | Session tomorrow | "Session with Dr. Adaeze Nwosu in 1 hour. We'll send a 15-min reminder before it starts." · [Reschedule] [Cancel] |
- **Cleanup:** All emoji + exclamations stripped (`Stress level increased! 😡` → `Stress is climbing`); `Write 100 word for today` (journaling — killed feature) → mood check-in nudge; `Grateful Meditation` (Self-Care killed) → `Start now`; `Dr. Hannibal lector` → Mindenity therapist; `Chat with AI` → `Talk to Companion`.

### - [x] 16.5 Notification preferences
- **Status:** ✅ Done 2026-05-20 — frame `24613:263248` (renumbered from old 16.6) in Patient page > Flow 16 section.
- **Purpose:** Per-category notification toggles. Reached from 16.4 link OR from 17.11 Notifications settings.
- **User stories:** US-001, US-033
- **Final copy (categories):** Wellness score · Wellness metrics · AI Companion · Mindenity AI · Therapy sessions · …
- **Cleanup:** `Freud AI` → `Mindenity AI`; `Mental Health Score/Metrics/Assistant` → Mindenity vocabulary (Wellness score, Wellness metrics, AI Companion); `Therapist Appointment` → `Therapy sessions`.
- **Open polish:** This screen overlaps with 17.11 Notifications. Decide: link from 16.4 → 17.11 directly and drop 16.5, OR keep 16.5 as a slimmer in-context subset.

### - [x] 16.6 Empty notifications
- **Status:** ✅ Done 2026-05-20 — frame `24613:263165` (renumbered from old 16.7) in Patient page > Flow 16 section.
- **Purpose:** Empty state for notification center.
- **User stories:** -
- **Final copy:** "You're all caught up." · "There are no notifications to show. Pull down to refresh the list." · Tabs: Unread · Read
- **Status:** OK — Mindenity tone-compliant, no exclamation, calm.

---

## Flow 17 — Settings & Profile

Account, subscription, preferences, privacy, help.

**Source section:** `Profile Settings & Help Center` (`22583:67135`) — 34 screens.

### - [x] 17.1 Profile view
- **Status:** ✅ Done 2026-05-18 (rebuilt same day with richer template) — frame `24534:252020` in Patient page > Flow 17 section (`24533:251634`). Original short-template frame `24533:251635` deleted.
- **Purpose:** Profile + Settings landing. Header with avatar + name + plan badge, 3-stat row, weekly streak card, then 4 grouped menu sections (General Settings · Security & Privacy · Help & Support · Danger Zone) leading into 17.2–17.20. Closes with Log out button + version footer.
- **User stories:** US-001, US-024, US-031 (Subscription menu), US-019/US-037 (Payments), US-042 (Privacy & data, Export), US-036/US-040 (Language & Region)
- **Source template:** `22539:78523` (Profile Settings & Help Center — long grouped-sections variant; user-picked over the shorter `22539:78366`).
- **DS components used:** Profile header (avatar + plan badge + name + 3 stat cells), Streak card, Section Header ×4 (one per menu group), Menu row pattern (label + supporting + chevron) ×12 visible, Section Header (Danger Zone), Sign-out button, footer (version + copyright).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Plan badge | Balance Plan |
  | Member-since | Member since Aug 2025 |
  | Name | Ada Okafor |
  | Stat 1 | 12 · Sessions |
  | Stat 2 | Calm · Today's mood |
  | Stat 3 | 24 days · Streak |
  | Streak card | Your streak · This week · 24 days · "Steady habit forming" · "Consistent check-ins improve your wellness over time." |
  | **General Settings** | section header |
  | General 1 | Profile Settings · Name · Email · Avatar |
  | General 2 | Subscription & Billing · Balance Plan · Renews 14 Mar |
  | General 3 | Payments · Visa •• 4242 · Receipts |
  | General 4 | Notifications · On for sessions and check-ins |
  | General 5 | Language & Region · English · Nigeria · WAT |
  | **Security & Privacy** | section header |
  | Security 1 | Change Password · Last changed 3 months ago |
  | Security 2 | Privacy & Data · Consent · Data sharing |
  | Security 3 | Export my data · Download a full copy (NDPR/GDPR) |
  | Security 4 | Terms & Conditions · Privacy Policy · Legal |
  | **Help & Support** | section header |
  | Help 1 | FAQs · Common questions |
  | Help 2 | Contact us · Chat or email Mindenity support |
  | Help 3 | About Mindenity · Our mission · Team |
  | **Danger Zone** | section header |
  | Danger 1 | Delete Account · Permanently remove your data |
  | Sign out button | Log out |
  | Version | Mindenity v1.0.0 |
  | Copyright | © 2026 Mindenity |
- **Cleanup applied:**
  - **Hidden sections (no Mindenity user-story backing):** Invite Friend banner, Sharing is caring card, Achievements section (header + 4 level cards). Frame height: 2928 → 2268.
  - **Hidden rows (overlap or out-of-scope):** Linked Devices (deferred V2 wearables), Reset & Clear Data (overlaps Delete), Change Passcode (overlaps Change Password), Feature Request (no US), What's New (no US). The freed rows were repurposed for Payments, Notifications, Language & Region, Export my data, About Mindenity.
  - **Western placeholder names** `Shinomiya Kaguya` ×2 → `Ada Okafor`
  - **Plan badge** `freud plus` → `Balance Plan`
  - **Age `18y / Age`** → `12 / Sessions` (session count is more useful on a Profile landing for a therapy app)
  - **Stats** `Sad/Mood · 65kg/Weight` → `Calm · Today's mood / 24 days · Streak` (dropped weight as wrong domain)
  - **Streak headline** `You're on fire!` (exclamation) → `Steady habit forming` (Mindenity calm tone)
  - **Streak body** `Keep using the app to get benefits!` → `Consistent check-ins improve your wellness over time.`
  - **Menu row labels** rewritten from clinical/general-health (Linked Devices, Wellness Goals, Units & Metrics, Live Chat, Reset & Clear Data, Change Passcode) to Mindenity-app grouping
  - **Each row's `Family` placeholder** supporting text → real context (renewal date, masked card, language, last changed, etc.)
  - **Footer** `freud v2.6.2_bugfix8 / All rights reserved, 2028©` → `Mindenity v1.0.0 / © 2026 Mindenity`
- **Open polish:**
  - **Tab Bar missing** — this IS the Tab Bar 5th destination but the template doesn't include one. Inject Tab Bar instance from 7.1 / 10.x patterns in polish pass.
  - **Edit profile CTA** missing from the header — spec wanted an avatar tap-target or pencil. Profile Settings row in menu does cover this but a header affordance is more discoverable.
  - **Streak appears twice** — in stats row (Stat 3) + in dedicated streak card. Pick one location; drop from stats row in favor of e.g. "Last session: 3 days ago" or just keep the streak card and remove the stat tile.
  - **Stat 1 number `12`** is placeholder — should be live session count.
  - **Mood stat** `Calm` is static — should reflect today's actual mood log (from Flow 8 mood entry).
  - **Region menu** — currently a single row "Language & Region"; per US-036.5 region change requires admin approval. Tap should route to 17.14 (admin-approval-gated region screen), not a simple selector.

### - [x] 17.2 Edit profile
- **Status:** ✅ Done 2026-05-18 — frame `24535:252788` in Patient page > Flow 17 section, placed at (555, 100).
- **Purpose:** Form to update profile fields. Reached from 17.1 → Profile Settings menu row. Pre-filled, sticky "Save changes" CTA.
- **User stories:** US-001
- **Source template:** `22539:73847` (Profile Settings & Help Center — "Profile Settings" form).
- **DS components used:** Top Nav (Title + supporting), Input Text ×5 (Full Name, Nationality with country chip, Pronouns, DOB picker, Mobile phone with country code), Input Text Scroller-style Address textarea, Primary Button, footer privacy note.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Edit profile |
  | Subtitle | Update your details. Only your therapist sees what you share with them. |
  | Full Name | Ada Okafor |
  | Nationality | Nigerian (NG) |
  | Pronouns | She / her |
  | Date of Birth | 12 / 04 / 1995 |
  | Mobile Phone | +234 801 234 5678 |
  | Address (optional) | 12 Awolowo Way · Ikoyi, Lagos · Nigeria |
  | Primary CTA | Save changes |
  | Footer note | Your details are encrypted and never shared without your consent. |
- **Cleanup applied:**
  - Subtitle "Your health privacy matters. Control and own your data here." → "Update your details. Only your therapist sees what you share with them." (more on-task for profile edit).
  - Name `Shinomiya Kaguya` → `Ada Okafor`
  - Nationality `Japanese · JP` → `Nigerian · NG`
  - `Gender` field relabeled to `Pronouns`; value `Transgender Female` → `She / her` (inclusive, less prescriptive)
  - DOB → `12 / 04 / 1995`
  - Phone country code `+44` → `+234`, number → realistic Lagos format
  - `Street Address` → `Address (optional)` (sentence case, mark optional explicitly)
  - Address content → Mindenity-relevant Lagos address
  - CTA `Update Profile` → `Save changes` (Mindenity convention from other screens)
  - Footer note rewritten — less marketing, more concrete encryption claim
  - Helper text nodes (×5) updated with field-specific guidance; currently template defaults Helper-Text boolean to false on these instances so they're hidden — content saved for when designer wants to expose them.
- **Open polish:**
  - **Avatar change** — spec wanted a "change avatar tap target". Not present in template. Add Avatar with overlay camera icon at the top.
  - **Email** field missing from template — required per US-001. Add Input Text above Full Name.
  - **Pronouns** is freeform Input Text — consider Dropdown with common options (He/him, She/her, They/them, Custom) for ease + consistency.
  - **DOB** is a static text-formatted field — confirm it's a Date Picker instance on tap, not a plain input.
  - **Address** is optional — could be collapsed behind a "Add address" link until needed (most patients won't need to share address with a remote therapy app).
  - **Sticky CTA** — confirm "Save changes" button is pinned to the bottom of viewport rather than scrolling away on long forms.

### - [x] 17.3 Subscription view
- **Status:** ✅ Done 2026-05-18 — frame `24536:252979` in Patient page > Flow 17 section, placed at (1010, 100).
- **Purpose:** Subscription home. Plan card with next-billing meta + "Manage plan" entry to upgrade/downgrade/pause/cancel (17.21-17.25). Also surfaces saved payment methods inline (quick visibility without leaving the screen).
- **User stories:** US-031, US-030, US-019/US-037 (payment method visibility)
- **Source template:** `22539:81567` (Profile Settings & Help Center — "My Subscription" + "Payment Methods" combined view).
- **DS components used:** Top Nav (Title + supporting), Section Header ×2, Plan summary card (label + value + secondary action link), Payment method row ×3, Add-new link.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Subscription |
  | Subtitle | Your plan, billing, and payment methods. |
  | Section 1 | Your plan |
  | Plan card label | Next billing |
  | Plan name | Balance Plan |
  | Billing meta | 14 Mar 2026 · ₦18,000 |
  | Plan CTA | Manage plan |
  | Section 2 | Payment methods |
  | Card 1 | Ending in ••8812 |
  | Card 2 | Ending in ••2142 |
  | Card 3 | Ending in ••3321 |
  | Add CTA | Add new |
- **Cleanup applied:**
  - Top nav title `Subscription Setting` → `Subscription`; subtitle reframed
  - Section header `My Subscription` → `Your plan` (warmer)
  - Plan name `freud plus+` → `Balance Plan`
  - Billing label `Current Billing` → `Next billing`; date format `04/04/2026` → `14 Mar 2026 · ₦18,000`
  - CTA `Manage Subscription` → `Manage plan`
  - `Payment Methods` → `Payment methods` (sentence case); `Add New` → `Add new`

### - [x] 17.4 Payment methods
- **Status:** ✅ Done 2026-05-18 — frame `24536:253278` in Patient page > Flow 17 section, placed at (1465, 100).
- **Purpose:** Dedicated payment methods management. Reached from 17.1 Payments menu row. Lists saved cards; tap a card → Set default / Remove (not yet built — flagged).
- **User stories:** US-019, US-037
- **Source template:** `22539:81567` (same as 17.3 — pivoted focus by hiding the subscription card section).
- **DS components used:** Top Nav, Section Header ("Saved cards"), Payment method row ×3, Add-new link.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Payment methods |
  | Subtitle | Cards saved for sessions and subscriptions. |
  | Section | Saved cards |
  | Card 1 | Ending in ••8812 |
  | Card 2 | Ending in ••2142 |
  | Card 3 | Ending in ••3321 |
  | Add CTA | Add new card |
- **Cleanup applied:**
  - Subscription section (My Subscription + plan card + Manage button) **hidden** entirely — this screen focuses on cards only; subscription mgmt lives on 17.3.
  - Section header `Payment Methods` → `Saved cards` (less redundant with screen title).
  - CTA `Add New` → `Add new card`.
- **Open polish:**
  - **Per-card actions** (Set default · Remove) missing — template shows cards as rows without per-row affordances. Add chevron-right per card to drill into a card-detail action sheet, OR a kebab menu inline.
  - **Default card indicator** not present — most-recently-used card should show a `Default` badge.
  - **Card brand icons** — verify visa/mastercard/verve icons appear on each row (template likely uses Payment Method component with brand variants).
  - **Region routing** — per US-037, NG users see Paystack-attached cards, international see Stripe-attached. Confirm Add-new flow routes to 17.5 with region-aware SDK.
  - **Empty state** (no cards) — not built. Should say "No saved cards yet" + "Add a card to speed up future bookings".

### - [x] 17.5 Add payment method
- **Status:** ✅ Done 2026-05-18 — frame `24538:253603` in Patient page > Flow 17 section, placed at (1920, 100).
- **Purpose:** Add a new card. Region-aware (US-037 — Paystack for NG, Stripe for Int'l). Card visual previews live as user types.
- **User stories:** US-019, US-037
- **Source template:** `22520:25269` (Therapist Appointment — "Add New Debit" card form).
- **DS components used:** Top Nav, Card visual preview (cardholder name + expiry + masked number), Section Header ("Card details"), Input Text ×4 (Full Name, Card Number, Expire, CVV), Primary Button.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Add card |
  | Heading | Add payment method |
  | Subtitle | Saved securely. Used for sessions and subscriptions. |
  | Card visual | Ada Okafor · 08/29 · •••• •••• •••• 4242 |
  | Section | Card details |
  | Field 1 | Full Name · Ada Okafor |
  | Field 2 | Card Number · 0000 0000 0000 0000 |
  | Field 3 | Expire · 08/48 |
  | Field 4 | CVV · 123 |
  | Primary CTA | Save card |
- **Cleanup applied:**
  - Top nav `Add New Debit` → `Add payment method`; center title `Book Session` → `Add card`; subtitle reframed
  - Cardholder `jane doe` → `Ada Okafor`; card date `08/11` → `08/29`; card number `0087 1157 0587 6187` → `•••• •••• •••• 4242`
  - Section header `General Information` → `Card details`
  - **Billing Address section hidden** entirely (390h freed) — same Mindenity precedent as Flow 6.7 (no need for billing address on a remote-therapy card add; processor handles it)
  - CTA `Continue` → `Save card`

### - [x] 17.6 Payment history
- **Status:** ✅ Done 2026-05-18 — frame `24538:253841` in Patient page > Flow 17 section, placed at (2375, 100).
- **Purpose:** Transaction log per US-020. Time-grouped list (This month · February · …) with filter + sort row. Tap a row → 17.7 Receipt detail.
- **User stories:** US-020
- **Source template:** Adapted from `24498:180615` (8.5 Wellness history pattern). Health Metrics History rows repurposed for transaction rows.
- **DS components used:** Top Nav, Filter row (filter label + sort label + search), Section Header per time group, Health Metrics History row ×6 (Title = amount, Supporting = item, Date = day).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Payment history |
  | Subtitle | All your past payments and receipts. |
  | Filter label | All payments |
  | Sort label | Newest first |
  | Row 1 | ₦18,000 · Balance Plan · April 2026 · 14 Apr |
  | Row 2 | ₦18,000 · Balance Plan · March 2026 · 14 Mar |
  | Row 3 | ₦18,000 · Balance Plan · February 2026 · 14 Feb |
  | Row 4 | ₦18,000 · Balance Plan · January 2026 · 14 Jan |
  | Row 5 | ₦18,000 · Balance Plan · December 2025 · 14 Dec |
  | Row 6 | ₦18,000 · Balance Plan · November 2025 · 14 Nov |
  | Row 7 | ₦18,000 · Balance Plan · October 2025 · 14 Oct |
  | Row 8 | ₦18,000 · Balance Plan · September 2025 · 14 Sep |
  | Row 9 | ₦18,000 · Balance Plan · August 2025 · 14 Aug |
- **Cleanup applied:**
  - Metric history → transactions (NGN amounts as title, plan period as supporting, payment day as date)
  - **One subscription item per month** (user-clarified 2026-05-18) — Mindenity bills monthly per US-031; no per-session line items on the history (sessions are covered by the subscription). 9 rows spanning Aug 2025 (member since) → Apr 2026 = 9 monthly payments.
  - Row metadata text + status text booleans turned off (`Is Metadata Text = false`, `Is Status Text = false`) to hide template placeholders ("Item 1 · Item 2 · Status Text")
  - Time-group headers (`Today / Yesterday`) **removed** in restructure — single continuous list is cleaner for a subscription's monthly history
  - Filter `All metrics` → `All payments`
- **Open polish:**
  - **Tap target on rows** — needs explicit chevron-right + tap routes to 17.7 Receipt detail.
  - **Status indicator per row** — Paid / Refunded / Pending. Currently no status visible.
  - **Filter dropdown** — `All payments` is static; should open a filter sheet (All / Subscriptions / Refunds / PAYG sessions for one-off payers).
  - **PAYG vs subscription distinction** — currently shows subscription items only. PAYG users (no subscription) need per-session line items + different empty state. Build `17.6b PAYG variant` when needed.
  - **Currency assumption** — all NGN. International (USD) users need currency switching per US-037.
  - **Year separators** — 9 rows spanning two years (2025 + 2026); consider adding subtle year separators between Jan 2026 and Dec 2025 rows for scannability.

### - [x] 17.7 Receipt detail
- **Status:** ✅ Done 2026-05-18 — frame `24538:254186` in Patient page > Flow 17 section, placed at (2830, 100).
- **Purpose:** Single transaction receipt with itemised fees and download. Reached from 17.6 row tap. Per US-020.4.
- **User stories:** US-020
- **Source template:** Adapted from Flow 6.5 Pricing breakdown (`24466:57988`) — itemised fee list naturally matches receipt structure.
- **DS components used:** Top Nav, Therapist line (name + specialty + payment method), Section Header ("Transaction reference"), Reference badge, Section Header ("Payment summary"), Itemised row ×4, Total row, Primary Button ("Download PDF"), Footer note.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Receipt |
  | Subtitle | Session payment · 7 Mar 2026 |
  | Therapist line | Dr. Adaeze Nwosu · Anxiety & stress · Paystack · Visa •• 4242 |
  | Reference section | Transaction reference · TX-2026-031507-NWS |
  | Payment summary header | Payment summary |
  | Item 1 | 1× Online session · ₦8,000.00 |
  | Item 2 | Discount · -₦4,000.00 |
  | Item 3 | Service fee · ₦200.00 |
  | Item 4 | Platform fee · ₦100.00 |
  | Total | ₦4,300.00 |
  | Primary CTA | Download PDF |
  | Footer note | Sent to ada.okafor@email.com on 7 Mar 2026 at 10:38 AM |
- **Cleanup applied:**
  - Top nav `Payment` → `Receipt`; subtitle added
  - Therapist rating chip + count stripped (`4.5 (500)` removed — not relevant on a past receipt)
  - "Available this week" → "Paystack · Visa •• 4242" (the actual payment method used)
  - Section `Payment Method` → `Transaction reference`; first method chip repurposed as the reference code; **other method chips (Flutterwave, USSD) hidden** — receipts show ONE method, not options
  - **Coupon section hidden entirely** — coupon entry doesn't belong on a past receipt; the discount it produced is preserved as the "-₦4,000.00" line in summary
  - CTA `Continue to payment` → `Download PDF`
  - Footer cancellation policy → email-sent confirmation
- **Open polish:**
  - **Mindenity logo** at top — spec wanted brand presence on the receipt (matches printable PDF). Add a small logo above the therapist line.
  - **PDF download behavior** — confirm tap triggers native iOS share sheet OR downloads to Files.
  - **International USD variant** — per US-037, Stripe users see USD. Build `17.7b USD variant` or handle inline.
  - **Refund state** — if a transaction is refunded, the receipt should display a strikethrough total + "Refunded on [date]" stamp.

### - [ ] 17.8 Privacy & data settings
- **Purpose:** Privacy controls landing per US-042 (GDPR/NDPR rights).
- **User stories:** US-042
- **Key elements:** Sections — Consent record, "Export my data" entry, "Delete my account" entry, "Data residency: [NG/EU/US]" indicator, Data sharing toggles
- **DS components:** Settings Complex, Toggle + Text, Button
- **Build note (2026-05-18):** Initial build attempt (clone of 17.1 Profile view with sections stripped) failed — over-aggressive hide chain blanked the content area. Reverted. Needs a dedicated settings landing template OR hand-built composition. Flagged for retry. Meanwhile, 17.1 already has Privacy & Data as a menu row (under Security & Privacy), and the destinations 17.9 + 17.10 are reachable directly — 17.8 as a landing is nice-to-have, not blocking.

### - [x] 17.9 Data deletion
- **Status:** ✅ Done 2026-05-18 — frame `24538:258254` in Patient page > Flow 17 section, placed at (3740, 100).
- **Purpose:** Right-to-erasure flow per US-042.5. Three tiered options: clear tracking data only, reset account (keep account), or full account deletion. Each option carries different impact severity.
- **User stories:** US-042
- **Source template:** `22539:74204` (Profile Settings — "Reset Data?" 3-option destructive screen).
- **DS components used:** Top Nav, Heading + warning subtitle, 3× Settings Simple option rows (title + supporting), Primary Button (destructive intent).
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Delete data |
  | Top nav subtitle | Choose what to remove and how. |
  | Heading | Delete your data? |
  | Warning | This action can't be undone. Take a moment to choose what to delete. |
  | Option 1 | Clear my tracking data · Mood logs, sleep, stress entries, sessions notes |
  | Option 2 | Reset my account · Keep account, clear all journals, history, preferences |
  | Option 3 | Delete my account · Permanently remove everything. We'll process within 30 days (NDPR/GDPR). |
  | Primary CTA | Confirm |
- **Cleanup applied:**
  - Template `Reset Data?` → `Delete your data?` (clearer intent)
  - Warning rewritten — template's `Warning: This action is irrevirsible!` (typo + scream) → calmer, sentence-case
  - Options Mindenity-tone: clinical `Erase History / Start Fresh / Full Wipe Out` → `Clear my tracking data / Reset my account / Delete my account`
  - Supporting copy per option spells out what's affected; option 3 includes the 30-day processing note per US-042.6
  - CTA `Reset Data` → `Confirm` (the actual action depends on which option is selected)
- **Open polish:**
  - **Destructive button variant** — confirm "Confirm" button uses red/destructive color, not Brand
  - **Secondary "Cancel" CTA** missing — needs an escape hatch ("Keep my data") above or beside Confirm
  - **Reason field** from spec not present — optional textarea for users to explain why they're deleting (helpful for product feedback)
  - **Auth gate** — final account deletion should require password re-entry or biometric confirm before processing

### - [x] 17.10 Export my data
- **Status:** ✅ Done 2026-05-18 — frame `24538:258365` in Patient page > Flow 17 section, placed at (4195, 100).
- **Purpose:** Request a copy of all user data per US-042. Three format choices (PDF / JSON / CSV), each with use-case guidance. Submission triggers a 48-hour email-delivery promise.
- **User stories:** US-042
- **Source template:** `22539:74204` (same as 17.9, pivoted to format choices).
- **DS components used:** Top Nav, Heading + subtitle, 3× option rows (format + use case), Primary Button.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Export data |
  | Top nav subtitle | Download a copy of everything you have on Mindenity. |
  | Heading | Export your data |
  | Subtitle | Choose your format. We'll email you the file within 48 hours. |
  | Option 1 | PDF · Readable summary — best for printing or sharing |
  | Option 2 | JSON · Machine-readable — best for developers |
  | Option 3 | CSV · Spreadsheet format — best for analysis |
  | Primary CTA | Request export |
- **Cleanup applied:**
  - Template heading + warning copy adapted for export context
  - 3 destructive options re-purposed as 3 format choices with use-case guidance per option
  - CTA `Reset Data` → `Request export`
- **Open polish:**
  - **Email destination field** missing from spec — currently assumes the account email. Add `Send to: ada.okafor@email.com` (read-only) + "Change" link, OR an editable Input Text for one-off destination
  - **Selection state** — no clear indication which format is selected when the user taps; needs Radio + Text variant per option rather than tappable rows
  - **Format icons** — small file-type icons (PDF/JSON/CSV) would make scanning faster
  - **Last export date** — show "Last export: 15 days ago" if applicable, so users know they have a recent copy

### - [x] 17.11 Notifications
- **Status:** ✅ Done 2026-05-18 — frame `24540:258499` in Patient page > Flow 17 section, placed at (100, 2400).
- **Purpose:** Granular notification preferences for Mindenity events. Two sections: General (transactional) + Insights & content (proactive/AI).
- **User stories:** US-001, US-033 (Crisis follow-ups), US-007 (session reminders)
- **Source template:** `22539:81139` (Profile Settings — Notification Settings).
- **DS components used:** Top Nav, Section Header ×2 (General · Insights & content), Settings Complex row (title + supporting + toggle) ×7.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Notifications |
  | Subtitle | What we tell you about, and when. |
  | **General** | section header |
  | Toggle 1 | Session reminders · Day-before and 15-min-before reminders for your therapy sessions |
  | Toggle 2 | Mood check-ins · Daily gentle prompts to log how you feel |
  | Toggle 3 | Push notifications · Allow Mindenity to send push to this device |
  | Toggle 4 | Crisis follow-ups · After a crisis-support tap, we check in with you the next day |
  | Toggle 5 | AI Companion replies · When the AI sends you a proactive nudge or follow-up |
  | **Insights & content** | section header |
  | Toggle 6 | Weekly wellness insight · Your stress/mood/sleep summary every Sunday evening |
  | Toggle 7 | New resources · When your therapist shares a new article or exercise |
- **Cleanup applied:**
  - Template's general/wellness toggles (Health Metrics Reminder · Meditation Reminder · Hydration Reminder · Journaling Reminder) → Mindenity-relevant toggles tied to actual product surfaces
  - Generic supporting copy `Shake your phone to randomize your acocunt balances.` (placeholder typo + wrong domain) → real category-specific descriptions
  - Section header `Insight` → `Insights & content` (sentence case, broader)
- **Open polish:**
  - **Push vs Email split** missing — spec wanted per-category toggles for push AND email channels. Currently single toggle per row. Add a small `Push · Email` segmented control per row.
  - **Quiet hours** band missing — many wellness apps add a "Don't disturb between [time] and [time]" toggle group.
  - **Save behavior** — confirm toggles auto-save on flip OR add a sticky "Save changes" button.

### - [x] 17.12 Language
- **Status:** ✅ Done 2026-05-18 — frame `24540:258561` in Patient page > Flow 17 section, placed at (555, 2400).
- **Purpose:** Language picker. English-only at launch; other languages listed as coming soon for Mindenity's NG-first + International expansion roadmap.
- **User stories:** localization (no explicit US — i18n surface)
- **Source template:** `22539:74526` (Profile Settings — Language picker with current + searchable list).
- **DS components used:** Top Nav, Selected language card, Section Header, Input Text (search), Language row ×6.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Language |
  | Subtitle | Choose how the app speaks to you. |
  | Section 1 | Your language · English is the default. More languages coming soon. |
  | Selected | English |
  | Section 2 | Other languages · Coming soon |
  | Search label / placeholder | Search · Search languages... |
  | Search helper | More languages added as Mindenity expands. |
  | List | Yoruba (YO) · Igbo (IG) · Hausa (HA) · French (FR) · Arabic (AR) · Portuguese (PT) |
- **Cleanup applied:**
  - Top nav generic `Data Export` → `Language`
  - Template's `English (US)` → `English` (no US bias for a Nigeria-first product)
  - Template's irrelevant languages (Sweden · Korean · Turkish · Vietnamese · New Zealand) → Nigerian languages + Mindenity's expansion targets (Yoruba, Igbo, Hausa, French, Arabic, Portuguese)
  - Section subtitles rewritten — honest "coming soon" rather than implying selection
- **Open polish:**
  - **Disabled state** on coming-soon languages — should be visually dimmed/non-tappable; currently tappable like English. Add `Locked` badge or 40% opacity.
  - **App requires restart** notice not present — language changes typically need an app reload.

### - [x] 17.13 Timezone
- **Status:** ✅ Done 2026-05-18 — frame `24540:258793` in Patient page > Flow 17 section, placed at (1010, 2400).
- **Purpose:** Timezone override per US-040.2. Auto-detected from device by default; user can pick a different timezone for cross-region scenarios (e.g. travel, expat users).
- **User stories:** US-040
- **Source template:** `22539:74526` (same as 17.12 — list pattern adapted).
- **DS components used:** Top Nav, Selected timezone card, Section Header, Input Text (search), Timezone row ×6.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Timezone |
  | Subtitle | Used for session reminders and timestamps. |
  | Section 1 | Auto-detected · Mindenity will use your device timezone unless you override below. |
  | Selected | West Africa Time (WAT, UTC+1) |
  | Section 2 | Pick a different timezone |
  | Search label / placeholder | Search · Search a city or timezone... |
  | Search helper | Cross-timezone sessions are displayed in both timezones automatically. |
  | List | GMT, London · EST, New York · PST, Los Angeles · CAT, Johannesburg · GST, Dubai · IST, Mumbai |
- **Cleanup applied:**
  - All language-picker copy rewritten for timezone context
  - 6 list items repurposed from language labels (Yoruba/Igbo/etc.) to common Mindenity-market timezones (London, New York, LA, Johannesburg, Dubai, Mumbai)
  - Helper text per US-040.3 — explicit note about dual-timezone display for cross-region sessions
- **Open polish:**
  - **Override toggle** missing — spec wanted explicit "Use auto-detected" toggle that, when off, surfaces the picker. Currently both are visible simultaneously.
  - **Current local time** under the timezone label would help users orient ("Currently 14:32 WAT").
  - **DST notice** — for timezones that observe DST, surface a note about automatic adjustment.

### - [x] 17.14 Region
- **Status:** ✅ Done 2026-05-18 — frame `24540:259152` in Patient page > Flow 17 section, placed at (1465, 2400).
- **Purpose:** Region change per US-036.5. Sets currency track + pricing + data residency. **Requires admin approval** — not a self-service change.
- **User stories:** US-036
- **Source template:** `22539:74526` (same list pattern, adapted).
- **DS components used:** Top Nav, Selected region card, Section Header, Input Text (search), Country row ×6.
- **Final copy:**
  | Slot | Copy |
  | --- | --- |
  | Top nav title | Region |
  | Subtitle | Sets your currency, pricing track, and data residency. Changes need admin approval. |
  | Section 1 | Current region · NGN pricing track · Paystack · Data stored in Lagos region. |
  | Selected | Nigeria (NG) |
  | Section 2 | Request region change · Needs admin approval |
  | Search label / placeholder | Search · Search a country... |
  | Search helper | Region change requests are reviewed within 3 business days (US-036.5). |
  | List | United States (US) · United Kingdom (UK) · Ghana (GH) · Kenya (KE) · South Africa (ZA) · Canada (CA) |
- **Cleanup applied:**
  - All language-picker copy rewritten for region context
  - Subtitle explicitly flags admin-approval gating (matches US-036.5)
  - Current region card surfaces the downstream impact (currency, processor, data residency) — sets expectations for the consequences
  - 6 list items are Mindenity's expected target countries
- **Open polish:**
  - **Reason textarea** from spec missing — admin needs context for the change request. Add a Textarea below the country list before submission.
  - **"Submit for approval" CTA** missing — currently tapping a country has no submit step; should require explicit submit + display pending status.
  - **Approval status badge** (Pending / Approved / Rejected) not visible — needed for users who've submitted a request.
  - **Locked-state warning** — first-time region pick on signup vs. mid-account region change have different friction; this screen is post-signup so should warn about data migration timeline.

### Remaining Flow 17 entries — consolidated 2026-05-20

**Flow 17 marked complete at 13 canonical screens** per user verdict. Remaining 12 spec entries consolidated below — each is either covered by another built screen or deferred to V2 with reasoning.

- **17.15 Help center home** — *deferred V2.* No US backing for in-app help center. External support email + Mindenity website cover this until product adds a `US-help` story.
- **17.16 FAQ list / detail** — *deferred V2.* Same — no US backing. FAQs can live as a web page reachable from 17.5 menu rows.
- **17.17 Contact support** — *deferred V2.* No US backing. Crisis contact is owned by Flow 12; regular support is email/web until US story emerges.
- **17.18 About / Legal pages** — *deferred V2 / web view.* App-store compliance covered by linking to mindenity.com/legal from the 17.1 menu row "About Mindenity". Native legal screens not required at MVP.
- **17.19 Delete account confirmation** — *covered by 17.9 Data deletion* option 3 ("Delete my account · Permanently remove everything. We'll process within 30 days (NDPR/GDPR).")
- **17.20 Log out confirmation** — *bottom sheet, not a full screen.* Triggered by tapping the Log out button on 17.1. Modal pattern, not numbered.
- **17.21 Change plan — upgrade** — *covered by Flow 4 plan picker (4.2)* reused via 17.3 "Manage plan" CTA. No separate screen needed.
- **17.22 Change plan — downgrade** — *covered by Flow 4 plan picker* with a "downgrade at end of cycle" inline confirmation. Same reuse pattern as 17.21.
- **17.23 Pause subscription** — *covered by inline confirm modal* triggered from 17.3 Manage plan. No separate screen needed.
- **17.24 Cancel subscription** — *covered by 17.9 Data deletion option 2 ("Reset my account")* + 17.3 Manage plan inline confirm. Cancellation flow doesn't need its own screen since the destructive UX is consolidated in 17.9.
- **17.25 Cancellation confirmed** — *covered by inline toast / 17.3 banner.* Confirmation is ephemeral feedback, not a dedicated screen.

---

## Flow 18 — DROPPED (2026-05-20)

**Dropped:** Error & Utility States (originally 9 screens — no internet, 404, server error, maintenance, force update, app-store rating, share app, in-app survey, biometric prompt).

**Reason:** Error and utility states are **cross-cutting overlays/sheets**, not standalone numbered screens. They live inline on the affected screen as Alert & Notification components, native iOS sheets, or device-level handlers. Building them as full canonical screens duplicates UI without architectural value.

**Coverage map:**
- **No internet / offline** → inline banner on any data-fetching screen (Tab Bar, 8.1, 10.1)
- **404 / route error** → inline empty state per screen
- **Server error / outage** → Alert & Notification banner + retry CTA inline
- **Maintenance mode** → full-screen overlay, build only if/when first scheduled
- **Force update** → native iOS prompt (App Store handles)
- **Rate app prompt** → covered by 17.1 "Love the app? Rate us" + native iOS SKStoreReviewController
- **Share app** → dropped (no referral US backing per earlier audit)
- **In-app survey** → V2 — no US backing for surveys
- **Biometric / passcode prompt** → native iOS prompt (Face ID / Touch ID)
---

## What's NOT in this flow (deferred or out of scope)

- **Therapist-facing screens** — separate doc when patient app wraps.
- **Admin desktop console** — separate doc; third app.
- **In-call video/audio UI** beyond the wrapper — handled by SDK provider (Daily / Twilio / Agora).
- **Paystack / Stripe checkout interiors** — black-box gateway UI.
- **Marketing landing pages / web app** — different surface entirely.
- **Push notification system tray** — OS-rendered, not in-app.

## Next steps after patient app screens land

1. Promote each canonical screen out of the `Mobile template - light` exploratory grid into a clean working page (suggest: `Patient App — Production` page).
2. Each screen frame should be named per the convention `Patient / [Flow] / [Screen Name]` for easy search.
3. Bind every fill/stroke/text to Semantic tokens (consistent with Phase 2 work). Surface/base for cream backgrounds, surface/primary for white cards, etc.
4. Auto-layout from the start — no fixed-position absolutes inside layout containers.
5. Wire up component instances rather than detached copies (so component updates propagate).
