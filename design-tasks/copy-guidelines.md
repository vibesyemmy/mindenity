# Mindenity Copy Guidelines

Living reference for all user-facing copy in the Mindenity apps. **Strict process: every screen must pass review against this doc before its checkbox flips to `[x]`.**

Version 1 (minimal) — 2026-05-12. Append edge cases as we encounter them; promote to full guideline when patterns stabilize.

---

## 1. Brand voice

Warm. Calm. Professional. Hopeful. Conversational but respectful. Inclusive.

**Voice in one sentence:** Like a thoughtful friend with clinical training — knowledgeable but never preachy, supportive but never patronizing.

### Avoid
- Clinical jargon ("psychosis", "major depressive disorder", "diagnosis")
- Alarmist language ("emergency", "urgent" — except in Crisis Support context)
- Sales-y exclamation marks
- Promises ("cure", "fix", "guarantee")
- Comparisons to other platforms in user-facing copy
- Medical advice tone ("you should take")
- Imperative-only voice ("You must")
- Cultural references that don't translate across NG/Int'l

---

## 2. Tagline

**Locked tagline:** *Your Path to a Clearer Mind*

Use on splash, marketing surfaces, brand-hero contexts. Single canonical form — don't rephrase. Pair with the Mindenity wordmark or on its own as a sub-line.

---

## 3. Product positioning

**One-liner:** Therapy and AI-powered mental wellness, built for Nigeria and the world.

**Long form:** Mindenity connects clients with licensed therapists, supports daily wellness with AI tools, and offers immediate crisis support — at fair, transparent pricing in your local currency.

---

## 4. Terminology dictionary

These are non-negotiable. Use the "Always" column verbatim.

| Always use | Never use |
|------------|-----------|
| **Client** | Patient, user, customer |
| **Therapist** | Doctor, counselor, expert, professional, shrink |
| **Session** | Appointment, meeting, call (when referring to therapy) |
| **Subscription** | Membership, package, tier |
| **Crisis Support Access** | Panic Button, SOS, Emergency Button, Help Button |
| **AI Companion** | Bot, chatbot, AI assistant (in user-facing copy) |
| **AI Symptom Checker** | Diagnosis tool, symptom analyzer |
| **Mental health** / **Wellness** | (interchangeable — use whichever reads better in context) |
| Plan names: **Essential, Balance, Thrive, Together, Harmony, Restore, Home, Family Care, Family Thrive** | Generic "basic", "premium", "pro" |
| **Sign in** / **Sign up** | Login, log in (verbs in copy use "sign in") |
| **Book a session** | Schedule, request a session |

---

## 5. Region-specific copy

- **Currency:** Nigerian clients see ₦ NGN; International clients see $ USD. **Never both for the same user.** Never machine-translate between them in-app.
- **Privacy consent:** NDPR copy for Nigerian users; GDPR-aligned copy for International. Two variants of the same screen — design both.
- **Crisis line:** Nigeria default `112`. International shows the localized line per country where available.
- **Timezone:** Always display in the user's local timezone. When cross-timezone is involved (e.g. NG client + Int'l therapist), show both with timezone labels per US-040.
- **Tagline / brand copy:** English only for now. Future translations deferred.

---

## 6. UI string conventions

### Case
- **Buttons / CTAs:** Sentence case. "Get started", "Sign in", "Continue", "Book session", "Reschedule". Never "Get Started" or "GET STARTED".
- **Headings (H1, H2):** Title Case. "Welcome Back", "Your Mental Wellness Today".
- **Body copy:** Sentence case. Full sentences with periods.
- **Labels (form fields, badges, tabs):** Sentence case, no period.
- **Section headers (in lists):** Sentence case OR Title Case — pick one and stick to it per screen.

### Punctuation
- Periods only on full sentences. No periods on button labels or single-word labels.
- No exclamation marks except where genuinely warranted (rare — never on greetings or CTAs).
- Use em-dashes ( — ) for asides; never replace with double hyphens.
- Curly quotes ( "" ) for human-readable copy. Straight quotes for code.

### Character limits
| Element | Max chars |
|---------|-----------|
| Button label | 20 |
| CTA / link | 30 |
| Headline (above the fold) | 60 |
| Subheading | 90 |
| Body paragraph | 200 |
| Empty-state message | 80 |
| Toast / notification | 80 |

### Bold and emphasis
- Use sparingly. Never bold a full sentence.
- Bold proper nouns when first introducing them ("Welcome to **Mindenity**.").

---

## 7. Don'ts (consolidated)

- ❌ Clinical jargon
- ❌ Cure / fix / guarantee language
- ❌ Comparisons to BetterHelp or other competitors in user copy
- ❌ Sales-y exclamations
- ❌ Generic UI-kit placeholders (Lorem ipsum, "UI Kit", anime/character names, generic Twitter-style hashtags)
- ❌ Imperative-only voice ("You must")
- ❌ Medical advice tone
- ❌ Cross-currency UI ("₦30,000 / $55")

---

## 8. Voice examples

| Context | ✅ Good | ❌ Avoid |
|---------|---------|---------|
| Welcome headline | "Welcome to Mindenity — Your Path to a Clearer Mind." | "Welcome to Mindenity: AI Mental Health App UI Kit!" |
| Welcome supporting text | "Therapy and AI-powered mental wellness, made for you." | "We bring all of your health information together on one app." |
| Feature intro | "Track your mood, sleep, and mindfulness — all in one place." | "A Mental Health Metrics That Understands You" |
| Achievement name | "Mindful streak", "First reflection", "Seven nights of rest" | "Saving Expert", "Wellness God" |
| Empty state | "No therapists match your filters. Try adjusting them." | "Nothing here!" / "Oops!" |
| Error | "We couldn't reach the server. Please try again." | "Oh no! Something broke!" |
| Crisis Support | "Crisis Support Access" | "Panic Button", "SOS" |
| Plan card | "Balance — 4 sessions a month" | "Our most popular plan!" |
| Form helper | "We'll send a verification code to this number." | "Don't worry — your data is safe!" |

---

## 9. Process

1. **Before flipping `[x]` on any screen** in `client-app-flow.md`: walk every text node, check against this doc.
2. Replace template / UI-kit placeholder copy with real Mindenity-context copy.
3. Confirm regional variants exist where relevant (privacy consent, currency, crisis line).
4. Confirm case + punctuation + char limits.
5. For ambiguous cases, ask in conversation.
6. Append the case + resolution to this doc when a new pattern emerges.

---

## 10. Open items / future iteration

- **Translations:** Strategy for Yoruba / Igbo / Hausa / French / Arabic — deferred.
- **Accessibility:** Plain-language pass for screen readers — TBD.
- **Voice/audio prompts:** AI Companion + meditations need spoken-voice copy guidelines separately.
- **Marketing copy:** Different surface; separate guideline doc when needed.
