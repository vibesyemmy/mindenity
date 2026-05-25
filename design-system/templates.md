# Template pages

Three foundational pages hold pre-built screens. **To build a new screen, find the closest section, copy a screen frame, swap content via component instances and text changes.** Do not start from a blank artboard.

## Mobile template — light

- **Page nodeId:** `20307:23730`
- **Page name in Figma:** `Mobile template - light`
- **Standard frame:** 375 × 812
- **21 sections, ~516 screen frames total**

| Section | nodeId | Screen count | Use for |
|---------|--------|--------------|---------|
| Splash & Loading | `22543:56128` | 5 | App launch, progress, splash |
| Welcome Screen | `22543:60702` | 14 | Onboarding hero, intro carousels |
| Authentication | `22543:61121` | 8 | Sign in, sign up, OTP, passcode |
| Comprehensive Mental Health Assessment | `22544:67968` | 31 | Multi-step assessment flows |
| Profile Setup & Account Completion | `22545:60042` | 30 | Profile creation, occupation, gender, app purpose |
| Home & Mental Health Metrics | `22548:102299` | 8 | Dashboard, home, metric widgets |
| Mindful AI Companion | `22572:67306` | 2 | AI chat companion |
| AI Symptom Checker | `22576:67293` | 42 | AI symptom flows |
| Gratefulness & Affirmations | `22573:60811` | 14 | Gratitude entries, affirmation cards |
| Self Journaling | `22549:64318` | 52 | Journal entries, prompts, history |
| Stress Management | `22550:44765` | 30 | Stress intake, exercises, results |
| Mood Tracker | `22556:45332` | 40 | Mood logging, history, sliders |
| Sleep Level | `22557:63998` | 32 | Sleep tracking, schedule |
| Mindful Minutes | `22570:49353` | 37 | Meditation, soundscape, sessions |
| Therapist Appointment | `22571:47187` | 37 | Therapist booking, profiles, calls |
| Search & Notifications | `22576:70870` | 9 | Search input, notification list |
| Error & Utility | `22579:48841` | 14 | 404, empty states, errors |
| Mental Health Resources | `22582:53319` | 27 | Articles, blog, courses, videos |
| Mindful Community | `22582:75676` | 22 | Posts, comments, community feed |
| Profile Settings & Help Center | `22583:67135` | 34 | Settings lists, account, help, FAQ |
| Achievements | `22583:72850` | 7 | Streaks, badges, leaderboard |

## Mobile template — Dark

- **Page nodeId:** `22590:65589`
- **Page name in Figma:** `Mobile template - Dark`
- **Same 21 sections as light, mirror counts.** Use this page when the request is for dark mode.

| Section | nodeId | Screen count |
|---------|--------|--------------|
| Splash & Loading | `22590:66191` | 5 |
| Welcome Screen | `22590:66303` | 14 |
| Authentication | `22590:71078` | 8 |
| Comprehensive Mental Health Assessment | `22590:73817` | 31 |
| Profile Setup & Account Completion | `22597:68668` | 30 |
| Home & Mental Health Metrics | `22599:70005` | 8 |
| Mindful AI Companion | `22621:93197` | 2 |
| AI Symptom Checker | `22622:83296` | 42 |
| Gratefulness & Affirmations | `22622:79701` | 14 |
| Self Journaling | `22605:77291` | 52 |
| Stress Management | `22619:63055` | 30 |
| Mood Tracker | `22619:69600` | 40 |
| Sleep Level | `22620:85360` | 32 |
| Mindful Minutes | `22620:91476` | 37 |
| Therapist Appointment | `22620:99069` | 37 |
| Search & Notifications | `22622:93577` | 9 |
| Error & Utility | `22622:93965` | 14 |
| Mental Health Resources | `22622:99360` | 27 |
| Mindful Community | `22623:87957` | 22 |
| Profile Settings & Help Center | `22623:111881` | 34 |
| Achievements | `22623:124034` | 7 |

## Desktop template

- **Page nodeId:** `22620:108381`
- **Page name in Figma:** `Desktop template`
- **3 dashboard frames** (early-stage; expand here as desktop work grows).

| Frame | nodeId | Inner artboard |
|-------|--------|----------------|
| Dashboard #1 | `22632:171187` | 1440 × 1028 |
| Dashboard #2 | `22632:171339` | 1440 × 960 |
| Dashboard #3 | `22632:171592` | 1520 × 1024 |

## How to use this for a screen-build prompt

Given a request like "Build me a sleep tracking detail screen, mobile dark":

1. Open page `22590:65589` (Mobile template - Dark).
2. Drill into section `22620:85360` (Sleep Level).
3. List screen frames in that section, pick the closest match, capture screenshot.
4. Duplicate the frame, rename, place in the same page (or a new page reserved for the work).
5. Swap content: text via direct edits, components via `setProperties`, instance swaps for icons/avatars.
6. Verify via screenshot after each mutation.

## Why screen frames share a generic name

All screens in a section share the section's name (e.g. every screen in "Mood Tracker" is literally named "Mood Tracker"). They're identified only by **nodeId** + **position in the section**. To pick the right starting screen, capture the section overview first via `figma_capture_screenshot` of the parent section frame, then choose visually.

## Icon Set

- **Page nodeId:** `5367:38988`
- Hosts the project's icon library used for `INSTANCE_SWAP` props throughout components.
- Icons live under `Icon Set` frame (`20304:20086`) — group children are categorized by purpose. Use `figma_search_components` filtered to this page to grab a specific icon by name.
