# Mindenity – User Stories & Acceptance Criteria v5.0

> **Confidential**
> Version 5.0 | May 2026
> Platform: Nigeria (NGN) + International (USD) | iOS & Android
> Includes: Dual-region pricing, BetterHelp rates, Epic 12 – Global Access, Epic 13 – Profit Sharing Model

---

## Document Overview

This document contains all user stories and acceptance criteria for the Mindenity platform. Version 4.0 adds full international support: clients and therapists outside Nigeria can access Mindenity using USD-denominated pricing, set at 30% below BetterHelp's 2026 reference rates. Nigeria-based users continue to use NGN pricing as defined in v3.0.

Version 5.0 adds Epic 13: Therapist Profit Sharing & Commission Model, covering the full hybrid tiered commission structure, Tier+ performance bonuses, payout mechanics, and admin commission governance. All previous epics and stories from v4.0 are retained unchanged.

### Personas

| Persona | Role | Goal |
|---|---|---|
| **Client (Nigeria)** | Mental health service user — Nigeria | Access therapy in NGN via Mindenity plans |
| **Client (International)** | Mental health service user — outside Nigeria | Access therapy in USD at competitive global rates |
| **Therapist (Nigeria-based)** | Licensed Nigerian therapist | Serve local and international clients through the platform |
| **Therapist (International)** | Licensed therapist outside Nigeria | Onboard and serve international clients in USD |
| **Admin** | Platform operations manager | Govern pricing, currency, users, content, and compliance |
| **Super Admin** | Executive / Technical lead | Platform-wide oversight, analytics, and global configuration |

---

## International Pricing Methodology

Mindenity's international pricing is benchmarked against BetterHelp, the world's largest online therapy platform, as the reference market rate. Mindenity international prices are set at 30% below BetterHelp's 2026 rates, positioning Mindenity as a premium-quality but more accessible global alternative.

### BetterHelp 2026 Reference Rates

| BetterHelp Plan | Sessions | Price (USD) | Source |
|---|---|---|---|
| Individual subscription | 4 sessions/month (1/week) | $260–$400/mo · mid: $330 | Multiple 2026 published reviews |
| Individual per-session equiv. | 1 session | ~$80/session | Weekly rate ÷ 4 |
| Couples (via Regain) | 4 sessions/month | $280–$400/mo · mid: $340 | BetterHelp/Regain 2026 |
| Couples per-session equiv. | 1 session | ~$90/session | Weekly rate ÷ 4 |
| Family | Not offered | Extrapolated | 1.45× couple rate |

> *BetterHelp does not offer a family plan or an 8-session/month Pro tier. Family rates and Pro tier rates are extrapolated: Family = 1.45× Couple; Pro (8 sessions) = 2× Lite rate before discount.*

### Mindenity International Pricing (BetterHelp −30%)

> *Formula: Mindenity International Price = BetterHelp Reference × 0.70. All prices in USD. Rounded to the nearest clean dollar.*

**Individual Plans — International USD Pricing**

| Plan | BetterHelp Reference | × 0.70 | Mindenity International Price | NGN Equivalent* |
|---|---|---|---|---|
| Essential (1 session PAYG) | $80/session | × 0.70 | $55 per session | ₦30,000 |
| Balance (4 sessions/mo) | $330/month | × 0.70 | $229 per month | ₦120,000 |
| Thrive (8 sessions/mo) | $660/month* | × 0.70 | $459 per month | ₦350,000 |

**Couple Plans — International USD Pricing**

| Plan | BetterHelp Reference | × 0.70 | Mindenity International Price | NGN Equivalent* |
|---|---|---|---|---|
| Together (1 session PAYG) | $90/session | × 0.70 | $62 per session | ₦50,000 |
| Harmony (4 sessions/mo) | $340/month | × 0.70 | $235 per month | ₦220,000 |
| Restore (8 sessions/mo) | $680/month* | × 0.70 | $475 per month | ₦450,000 |

**Family Plans — International USD Pricing**

| Plan | BetterHelp Reference | × 0.70 | Mindenity International Price | NGN Equivalent* |
|---|---|---|---|---|
| Home (1 session PAYG) | $125/session* | × 0.70 | $85 per session | ₦100,000 |
| Family Care (4 sessions/mo) | $490/month* | × 0.70 | $339 per month | ₦350,000 |
| Family Thrive (8 sessions/mo) | $980/month* | × 0.70 | $679 per month | ₦650,000 |

> *\* Extrapolated — BetterHelp does not offer these tiers directly.*
> *NGN Equivalent column is informational only. Nigeria users always pay in NGN. International users always pay in USD. Prices are not converted in-app — they are separate pricing tracks.*

### Full Dual-Region Plan Comparison

| Plan | Segment | Type | Nigeria (NGN) | International (USD) | Sessions / Month |
|---|---|---|---|---|---|
| Essential | Individual | PAYG | ₦30,000 | $55 | 1 |
| Balance | Individual | Monthly | ₦120,000 | $229 | 4 |
| Thrive | Individual | Monthly | ₦350,000 | $459 | 8 |
| Together | Couple | PAYG | ₦50,000 | $62 | 1 group |
| Harmony | Couple | Monthly | ₦220,000 | $235 | 4 group |
| Restore | Couple | Monthly | ₦450,000 | $475 | 8 group |
| Home | Family | PAYG | ₦100,000 | $85 | 1 group |
| Family Care | Family | Monthly | ₦350,000 | $339 | 4 group |
| Family Thrive | Family | Monthly | ₦650,000 | $679 | 8 group |

---

## EPIC 1: Client Registration & Onboarding

**Persona: Client**

### US-001 – Client Account Registration · Must Have · SP: 5

**User Story**
As a new client, I want to create an account using my email or phone number so that I can securely access the Mindenity platform from anywhere in the world.

**Acceptance Criteria**
1. System displays a registration form with fields: full name, email/phone, password, and date of birth
2. System detects user's country via IP geolocation on registration and assigns a region: 'Nigeria' or 'International'
3. OTP is sent to email or phone within 30 seconds of submission
4. Client verifies OTP to activate account
5. System displays the appropriate consent form: NDPR for Nigerian users, GDPR-aligned privacy notice for international users
6. Upon successful registration, client is redirected to onboarding questionnaire
7. Duplicate email/phone triggers: 'Account already exists. Please log in.'

---

### US-002 – Client Onboarding Mental Health Intake · Must Have · SP: 8

**User Story**
As a new client, I want to complete a brief mental health intake questionnaire so that the platform can suggest appropriate therapists and the most suitable Mindenity plan — priced in my local currency.

**Acceptance Criteria**
1. Intake form presented immediately after registration
2. Questions cover: primary concern category (from 13 Mindenity categories), urgency level, preferred session format, language, and segment (individual/couple/family)
3. AI processes responses and presents: top 3 therapist matches AND recommended Mindenity plan
4. Recommended plan price is displayed in NGN for Nigerian users and USD for international users
5. Recommended plan is pre-highlighted on the Plan Selection screen on arrival
6. Client can dismiss the plan recommendation and browse all plans independently
7. Intake responses stored securely; accessible only to the client's therapist after booking

---

## EPIC 2: Therapist Availability Management

**Persona: Therapist**

### US-003 – Set Weekly Availability Schedule · Must Have · SP: 8

**User Story**
As a therapist, I want to set my weekly availability by selecting working days and time slots so that clients from Nigeria and internationally can only book sessions when I am available.

**Acceptance Criteria**
1. Availability settings accessible from: Therapist Dashboard > My Schedule
2. Therapist selects working days using a weekly grid (Mon–Sun)
3. Time slots set using time picker (15-min increments) in the therapist's local timezone
4. All slots displayed to clients in the client's own local timezone (auto-detected; changeable manually)
5. Option to copy schedule to all weekdays with one click
6. Changes saved automatically and reflected on client-facing calendar within 2 minutes
7. System confirms save with toast: 'Availability updated successfully'

---

### US-004 – Set Session Duration and Buffer Time · Must Have · SP: 5

**User Story**
As a therapist, I want to set my preferred session durations and buffer time between sessions so that I am not overbooked.

**Acceptance Criteria**
1. Therapist selects default session duration: 30 min or 60 min (aligned with Mindenity plan session lengths)
2. Buffer time options: 0 min, 10 min, 15 min, 30 min
3. System blocks client booking during buffer periods automatically
4. Changes apply from the next calendar day unless overridden for same-day slots

---

### US-005 – Mark Specific Dates as Unavailable · Must Have · SP: 5

**User Story**
As a therapist, I want to mark specific dates as unavailable so that clients cannot book on those days.

**Acceptance Criteria**
1. One-off unavailability accessible via calendar date-picker in Schedule settings
2. Therapist selects date(s) and marks as 'Unavailable' with optional reason (not visible to clients)
3. Affected dates shown in red on therapist's own calendar
4. Any existing bookings on affected dates trigger an alert: 'You have X booking(s) on this date. Resolve before marking unavailable.'
5. System does not allow new bookings on marked dates

---

### US-006 – View Client Bookings in Availability Calendar · Must Have · SP: 8

**User Story**
As a therapist, I want to see my confirmed client bookings overlaid on my availability calendar so that I have a single view of my schedule.

**Acceptance Criteria**
1. Dashboard calendar shows confirmed sessions in blue, available slots in green, blocked slots in grey
2. Each session block shows: Client ID (anonymous), session type, session format, plan type, and client region flag (Nigeria / International)
3. Therapist can navigate calendar week-by-week and month-by-month
4. Calendar syncs in real-time when new bookings arrive

---

### US-027 – Therapist Selects Accepted Subscription Plans · Must Have · SP: 8

**User Story**
As a verified therapist, I want to select which Mindenity subscription plans I am willing to accept so that only compatible clients can book sessions with me.

**Acceptance Criteria**
1. Plan preferences accessible from: Therapist Dashboard > My Profile > Plan Preferences
2. All 9 plans displayed grouped by segment (Individual, Couple, Family) with NGN and USD prices shown
3. Therapist can select or deselect any plan; at least one plan must be selected before profile can be published
4. Selecting Couple or Family plans prompts confirmation of group therapy experience
5. Selections saved in real time with toast: 'Plan preferences updated'
6. Profile updated within 2 minutes; clients immediately see the updated accepted plans
7. If a therapist deselects a plan with active future bookings under it, system warns: 'You have X upcoming session(s) under [Plan]. This change applies to new bookings only.'

---

## EPIC 3: Client Views Therapist Availability

**Persona: Client**

### US-007 – View Therapist Available Slots Before Booking · Must Have · SP: 8

**User Story**
As a client, I want to see a therapist's available days and time slots on their profile so that I can choose a time that suits me before committing to book.

**Acceptance Criteria**
1. Therapist profile includes an 'Availability' section below the bio
2. Available dates shown as green tiles on a monthly calendar view
3. Clicking a green date shows available time slots for that day
4. Time slots displayed in the client's local timezone (auto-detected; changeable manually)
5. Unavailable dates appear greyed out and non-clickable
6. Calendar updates within 2 minutes of therapist changes
7. If no slots available in the current month: 'No availability this month. Check next month.'

---

### US-008 – Filter Therapists by Date Availability · Must Have · SP: 5

**User Story**
As a client, I want to filter the therapist directory by a specific date so that I only see therapists who are available when I need them.

**Acceptance Criteria**
1. Therapist search page includes a date-picker filter: 'Available on...'
2. Selecting a date filters the list to show only therapists with at least one open slot on that date
3. Each therapist card shows their earliest available slot on the selected date
4. Results update without full page reload
5. Filter can be cleared to return to the full therapist list

---

## EPIC 4: Pricing Transparency for Clients

**Persona: Client**

### US-009 – View Therapist Accepted Plans on Profile · Must Have · SP: 5

**User Story**
As a client, I want to see which Mindenity subscription plans a therapist accepts on their profile, with pricing shown in my currency, so that I can confirm compatibility before booking.

**Acceptance Criteria**
1. Therapist profile includes an 'Accepted Plans' section above the 'Book Now' button
2. Accepted plans shown as badges grouped by segment: Individual, Couple, Family
3. Nigerian clients see prices in NGN; international clients see prices in USD
4. Client's current active plan highlighted with a 'Your plan' indicator in Navy
5. If client's plan is not in the therapist's accepted plans: 'This therapist does not accept your current plan. View compatible therapists or explore plan options.'
6. Clients without an active plan see all accepted plans with both NGN and USD prices

---

### US-010 – View Full Pricing Breakdown Before Payment · Must Have · SP: 8

**User Story**
As a client, I want to see a complete fee breakdown on the booking confirmation screen, in my currency, before I make payment so that I know exactly what I am paying for.

**Acceptance Criteria**
1. Booking confirmation screen displays: Plan Name, Session Format, Session Duration, Base Price, Platform Fee, Total Amount Due
2. Nigerian users see all amounts in NGN; international users see all amounts in USD
3. Promotional discounts shown as a separate line item
4. Client must check: 'I agree to the session fee of [amount]' before proceeding to payment
5. Price breakdown cannot be skipped

---

### US-011 – Multi-Therapist Pricing and Plan Comparison · Must Have · SP: 8

**User Story**
As a client with saved therapists, I want to see a side-by-side pricing and plan comparison in my currency so that I can decide which therapist to book.

**Acceptance Criteria**
1. Multi-therapist comparison panel accessible from 'My Therapists' section
2. Panel displays up to 5 therapists in columns showing: Specialisation, Rating, Next Available Slot, Accepted Plans, Pricing
3. Prices shown in NGN for Nigerian users, USD for international users
4. Client's active plan highlighted green in each column where it is accepted
5. If a therapist does not accept the client's plan, their column shows an amber warning badge
6. Each therapist column has a 'Book Session' button routing to that therapist's booking flow

---

### US-028 – Filter Therapist Directory by Plan Compatibility · Must Have · SP: 5

**User Story**
As a client, I want to filter the therapist directory by my current subscription plan so that I only see therapists who accept my plan.

**Acceptance Criteria**
1. Therapist search page includes a 'My Plan' filter toggle
2. When enabled, directory shows only therapists who have accepted the client's active Mindenity plan
3. Each filtered therapist card shows a green 'Accepts your plan' badge
4. If no therapists accept the client's plan: 'No therapists currently accept your plan. Try browsing all therapists or contact support.'
5. Unauthenticated users see: 'Select a plan to filter by plan compatibility'

---

## EPIC 5: Admin Pricing Management

**Persona: Admin**

### US-012 – View and Edit Platform Pricing Table (NGN and USD) · Must Have · SP: 8

**User Story**
As a platform admin, I want to view and edit both the NGN and USD pricing tables so that I can keep all plan rates aligned with market conditions.

**Acceptance Criteria**
1. Admin Console > Pricing Management shows two tabs: 'Nigeria (NGN)' and 'International (USD)'
2. Each table displays all 9 plans with: current price, sessions included, last updated timestamp
3. Admin can edit NGN and USD prices independently
4. Changes to USD pricing do not automatically update NGN pricing and vice versa
5. System displays confirmation: 'This change will affect all upcoming bookings for [region]. Confirm?'
6. On confirmation, notifications sent to therapists who accept the affected plan and region

---

### US-013 – Set Minimum and Maximum Price Bands per Region · Must Have · SP: 8

**User Story**
As a platform admin, I want to set separate min/max price bands for NGN and USD pricing so that therapist custom pricing stays within acceptable ranges for each market.

**Acceptance Criteria**
1. Price Bands tab has two sub-tabs: Nigeria (NGN) and International (USD)
2. Admin sets Min and Max per plan per region independently
3. System validates that Min < Max in each region
4. When a therapist requests custom pricing, the validation checks against the relevant region's bands
5. Super admin can override bands for individual therapists on a case-by-case basis

---

### US-014 – Create Promotional Pricing Windows · Should Have · SP: 5

**User Story**
As a platform admin, I want to create time-limited promotional discounts on Mindenity plans so that we can incentivise new client acquisitions in both Nigeria and internationally.

**Acceptance Criteria**
1. Admin sets: promo name, discount type (% or flat amount), currency region (NGN / USD / Both), applicable plans, start and end datetime
2. Promo code (optional) can be generated for targeted campaigns
3. Active promos appear as banners on the Plan Selection screen in the relevant region
4. System auto-deactivates promo at end datetime
5. Promo usage analytics: subscriptions under promo, revenue impact, breakdown by region

---

### US-015 – Approve Therapist Custom Pricing Requests · Should Have · SP: 5

**User Story**
As a platform admin, I want to review and approve or reject custom pricing requests from therapists so that pricing integrity is maintained in both NGN and USD.

**Acceptance Criteria**
1. Therapist submits custom pricing request specifying plan, currency (NGN/USD), and justification
2. Admin reviews against the relevant region's price band
3. Admin can approve, reject, or counter-offer
4. Approved prices apply immediately; rejection requires a mandatory admin note
5. Pricing request audit log maintained

---

### US-029 – Admin Manages Plan-Therapist Eligibility Rules · Should Have · SP: 8

**User Story**
As a platform admin, I want to manage which therapist tiers are eligible for which plans so that quality standards are maintained across both markets.

**Acceptance Criteria**
1. Admin Console > Pricing Management > Plan Eligibility
2. Matrix of all 9 plans vs therapist verification tiers (Standard, Senior, Clinical)
3. Admin can enable/disable each plan-tier combination
4. Ineligible therapists notified by email of any eligibility changes affecting their selections
5. Audit log maintained for all eligibility changes

---

## EPIC 6: Multi-Therapist Selection

**Persona: Client**

### US-016 – Save Multiple Therapists to My Panel · Must Have · SP: 5

**User Story**
As a client, I want to save multiple therapists to a 'My Therapists' panel so that I can manage ongoing relationships with more than one therapist.

**Acceptance Criteria**
1. Therapist profile includes a 'Save Therapist' button (bookmark icon)
2. Panel supports up to 5 therapists; exceeding this shows: 'You can save up to 5 therapists.'
3. Each saved therapist card shows: name alias, specialisation, rating, next available slot, accepted plans, and currency-appropriate pricing
4. Panel persists across sessions

---

### US-017 – Book Sessions with Multiple Therapists Independently · Must Have · SP: 8

**User Story**
As a client with multiple saved therapists, I want to book sessions independently with each so that I can maintain separate therapeutic relationships.

**Acceptance Criteria**
1. Each booking flow is independent — selecting a slot with Therapist A does not affect Therapist B
2. System checks for time conflicts across all active bookings before confirming
3. Session history stored separately per therapist under 'My Sessions > By Therapist'
4. Unified 'Schedule View' shows all upcoming sessions across therapists

---

### US-018 – Compare Therapists Side by Side · Must Have · SP: 5

**User Story**
As a client, I want to compare my saved therapists side by side so that I can decide which is most appropriate for my current need.

**Acceptance Criteria**
1. Comparison table shows per therapist: Specialisations, Languages, Rating, Next Available Slot, Accepted Plans, Pricing in client's currency
2. Columns sortable by any attribute
3. Accessible on mobile as a horizontally scrollable table

---

## EPIC 7: Payment Processing

**Persona: Client**

### US-019 – Complete Session Payment · Must Have · SP: 8

*Paystack for Nigeria, Stripe for International*

**User Story**
As a client, I want to pay for my session using a payment gateway appropriate for my region so that I can confirm my booking securely without leaving the Mindenity platform.

**Acceptance Criteria**
1. Nigerian clients (region = Nigeria) are routed to Paystack: accepts card, bank transfer, USSD, Mindenity Wallet
2. International clients (region = International) are routed to Stripe: accepts credit/debit card, Google Pay, Apple Pay, PayPal
3. Payment screen shows total in the client's currency (NGN or USD); no cross-currency conversion shown
4. On successful payment: session confirmed, client receives in-app and email confirmation with plan name, amount, currency, and reference
5. On failed payment: client returned to booking screen; session NOT confirmed; retry up to 3 times
6. After 3 failed attempts, the slot is released and the client is prompted to try a different payment method

---

### US-020 – View Payment History and Receipts · Should Have · SP: 3

**User Story**
As a client, I want to view my payment history and download receipts so that I can track my therapy spend.

**Acceptance Criteria**
1. Payment history accessible from Account > Payments
2. Each entry shows: date, therapist alias, plan name, amount, currency (NGN or USD), and status
3. Client can download a PDF receipt for any completed transaction
4. Receipts include: Mindenity logo, transaction reference, itemised fee breakdown, plan name, currency, and payment method

---

## EPIC 8: Therapist Onboarding & Verification

**Persona: Therapist**

### US-021 – Register as a Therapist · Must Have · SP: 8

**User Story**
As a licensed therapist anywhere in the world, I want to create a professional account on Mindenity so that I can start offering sessions to clients locally and internationally.

**Acceptance Criteria**
1. Registration form collects: full legal name, email, phone, country of practice, primary language
2. After OTP verification, therapist completes: specialisations (multi-select from 13 care categories), languages offered, years of experience, bio
3. Therapist uploads: professional license, government ID, and optional certifications
4. System assigns therapist region (Nigeria or International) based on country of practice — affects which currency their earnings are processed in
5. Submission triggers admin review; therapist receives: 'Application under review. We will notify you within 48 hours.'
6. After verification, therapist is prompted to complete Plan Preferences (US-027) and International Visibility settings (US-038) before profile goes live

---

### US-022 – Set Custom Session Pricing Within Plan Bands · Must Have · SP: 8

**User Story**
As a verified therapist, I want to set my own session pricing within the allowed price bands, in my operating currency, so that my rates reflect my experience.

**Acceptance Criteria**
1. Custom pricing accessible from Dashboard > My Profile > Pricing
2. Nigeria-based therapists set NGN prices; international therapists set USD prices
3. Therapists operating in both markets can set both NGN and USD prices independently
4. System validates each price against the relevant region's admin-defined bands in real time
5. Pricing update takes effect after admin approval (if outside band) or immediately (if within band)
6. Therapist pricing history log maintained for audit

---

## EPIC 9: Admin Platform Management

**Persona: Admin**

### US-023 – Verify Therapist Applications · Must Have · SP: 8

**User Story**
As a platform admin, I want to review and approve or reject therapist applications from Nigeria and internationally so that only qualified professionals are on the Mindenity platform.

**Acceptance Criteria**
1. Admin receives in-platform notification for new therapist application
2. Application review page shows: personal details, country of practice, uploaded documents, specialisations, AI pre-screening flag
3. Admin can Approve, Reject, or Request More Information
4. Approve: activates account; prompts therapist to complete Plan Preferences and International Visibility; triggers welcome email
5. Reject: requires rejection reason; triggers notification to therapist with resubmission link

---

### US-024 – Monitor Platform Analytics Dashboard · Must Have · SP: 8

**User Story**
As a platform admin, I want to view a live analytics dashboard segmented by region so that I can monitor platform health, revenue, and plan adoption in Nigeria and internationally.

**Acceptance Criteria**
1. Admin Dashboard includes global metrics and a region toggle: 'All / Nigeria / International'
2. Revenue metrics show NGN and USD separately — never combined
3. Plan adoption panel: subscribers per plan, broken down by region
4. Therapist plan coverage panel: therapist count per plan, flagging plans with fewer than 3 therapists as 'Low coverage'
5. International onboarding funnel: signups, intake completions, plan purchases by region
6. All metrics refresh every 5 minutes; exportable as CSV or PDF

---

## EPIC 10: Clinical Safety & Risk Management

**Persona: Therapist & Admin**

### US-025 – Complete Post-Session Risk Assessment · Must Have · SP: 8

**User Story**
As a therapist, I want to complete a structured risk assessment after every session so that high-risk clients receive appropriate follow-up care regardless of their location.

**Acceptance Criteria**
1. Risk assessment form appears automatically when a session ends
2. Form includes: Risk Level (Green / Orange / Red), Behavioural Indicators, Emotional Pattern Notes, Action Plan
3. AI pre-fills a suggested risk level; therapist must confirm or override
4. Red flag submission triggers: internal admin alert, priority flag, and auto-suggested follow-up in 24–48 hours
5. For international clients at Red level: admin is prompted to verify local emergency services information for the client's country
6. Risk data stored encrypted; accessible only to therapist and authorised admin

---

### US-026 – Respond to Client Crisis Support Alert · Must Have · SP: 13

**User Story**
As a therapist, I want to receive an immediate alert when a client activates Crisis Support so that I can respond as quickly as possible, wherever the client is located.

**Acceptance Criteria**
1. Crisis Support Access available on: Balance, Thrive, Harmony, Restore, Family Care, Family Thrive plans
2. Activating Crisis Support triggers: push notification to dedicated therapist, flash alert on therapist dashboard, distinct audio alert
3. Alert includes: Client ID, time, last recorded risk level, active plan, client region (Nigeria or International)
4. If no response within 5 minutes: escalates to next available therapist and admin
5. For international clients: Crisis bottom sheet also shows the relevant local crisis line for the client's country (where available)
6. Button label is always 'Crisis Support Access' — never 'Panic Button', 'SOS', or 'Emergency'

---

## EPIC 11: Mindenity Subscription Plan Management

**Persona: Client, Therapist, Admin**

### US-030 – Client Selects a Subscription Plan · Must Have · SP: 8

**User Story**
As a new client, I want to browse and select a Mindenity plan after my intake assessment, with pricing shown in my currency, so that I can access therapy at the right price and intensity.

**Acceptance Criteria**
1. Plan Selection screen presented at end of onboarding intake
2. Nigerian users see prices in NGN; international users see prices in USD
3. Segment pre-selected based on intake response
4. Intake-recommended plan is pre-highlighted with a 'Recommended for you' label
5. Secondary CTA: 'Not sure? Find my plan' routes to recommendation flow
6. Tertiary CTA: 'Compare all plans' opens full-feature comparison
7. On plan selection: routed to payment screen with plan summary and currency-correct price pre-filled

---

### US-031 – Client Upgrades or Downgrades Plan · Must Have · SP: 8

**User Story**
As an existing client, I want to upgrade or downgrade my Mindenity plan so that my level of support can change as my needs evolve.

**Acceptance Criteria**
1. Plan change accessible from Account > Subscription > Change Plan
2. Upgrade: shows credit calculation in client's currency
3. Downgrade: two-step — feature diff shown, then explicit confirmation required
4. Cancellation: client offered 'Pause for 1 month' before cancel confirmation
5. Cancelled state: 'Access ends [date]' in amber — never red
6. All plan changes logged with timestamp in account history

---

### US-032 – Client Accesses AI Mental Wellness Assessment · Must Have · SP: 5

**User Story**
As a client on any Mindenity plan, I want to complete the AI Mental Wellness Assessment so that I receive a personalised baseline of my mental wellness status.

**Acceptance Criteria**
1. Assessment accessible from dashboard on all plans in all regions
2. Covers: current mood, stress indicators, sleep quality, and primary concern category
3. AI generates a wellness summary report after completion
4. Report shared with dedicated therapist on Lite and Pro plans
5. PAYG clients can complete once per session purchase; subscription clients can retake at any time
6. Data stored encrypted; client can request deletion under NDPR (Nigeria) or GDPR-aligned rights (International)

---

### US-033 – Client Accesses Crisis Support on Eligible Plans · Must Have · SP: 8

**User Story**
As a client on an eligible plan, I want to access Crisis Support so that I can reach my therapist immediately when in distress, regardless of my location.

**Acceptance Criteria**
1. Crisis Support Access available on: Balance, Thrive, Harmony, Restore, Family Care, Family Thrive
2. Crisis Support button displayed as a persistent soft-magenta floating action button on eligible dashboards
3. Tapping opens a calm bottom sheet: 'You are not alone.' with actions: 'Message my therapist' and 'Call a support line'
4. Support line shown is localised: Nigeria emergency (112) for Nigerian users; local crisis line for international users where available
5. PAYG plan clients (Essential, Together, Home) see a greyed padlock version; tapping opens upgrade prompt

---

### US-034 – Therapist Views Client Plan Details Before Session · Must Have · SP: 3

**User Story**
As a therapist, I want to see a client's active Mindenity plan and region before our session so that I can prepare appropriately.

**Acceptance Criteria**
1. Client profile visible to their dedicated therapist shows: plan name, tier, segment, session duration, sessions remaining, and client region
2. Therapist dashboard session card shows plan badge alongside client alias and a region flag
3. If client's plan expires before a booked session: 'Client [ID]'s plan has expired. Session may be affected.'

---

### US-035 – Admin Monitors Plan Adoption and Coverage Metrics · Must Have · SP: 5

**User Story**
As a platform admin, I want to monitor plan adoption and therapist coverage by region so that every plan has adequate supply in both markets.

**Acceptance Criteria**
1. Admin Dashboard > Plan Metrics panel: active subscribers per plan, broken down by Nigeria and International
2. Therapist Coverage panel: therapist count per plan and region; plans with fewer than 3 therapists flagged
3. Admin can send targeted notifications to therapists not yet accepting a flagged plan
4. All plan metrics exportable as CSV or PDF

---

## EPIC 12: Global Access & Multi-Currency Support

> This epic covers all stories related to international clients and therapists accessing Mindenity outside Nigeria. It includes region detection, currency display, international payment processing, therapist international visibility, and multi-timezone session management.

**Persona: Client, Therapist, Admin**

### US-036 – Platform Detects User Region and Assigns Correct Currency · Must Have · SP: 5

**User Story**
As a user anywhere in the world, I want the platform to automatically detect my region and show pricing in the correct currency so that I am never confused by a foreign price.

**Acceptance Criteria**
1. On first app launch and registration, system detects user's country via IP geolocation
2. Nigeria (NG): assigned NGN pricing track; payment via Paystack
3. All other countries: assigned International (USD) pricing track; payment via Stripe
4. Region assignment shown to user during onboarding: 'We detected you are in [Country]. Prices will be shown in [USD/NGN].'
5. User can manually override region from Account > Settings > Region & Currency if needed (requires admin approval for currency switch to prevent abuse)
6. Region is stored on the user's profile; re-detected only on explicit change request
7. Therapists are assigned a region based on their country of practice set during registration

---

### US-037 – International Client Pays via Stripe · Must Have · SP: 8

**User Story**
As an international client, I want to pay for my Mindenity plan and sessions using an internationally accepted payment method so that I can complete my purchase without friction.

**Acceptance Criteria**
1. International clients (region = International) are routed exclusively to Stripe at checkout
2. Stripe accepts: Visa, Mastercard, American Express, Google Pay, Apple Pay, and PayPal
3. All amounts shown and charged in USD; Stripe handles local card conversion transparently
4. On successful payment: session confirmed, client receives confirmation email with USD amount and Stripe transaction reference
5. On failed payment: client returned to booking screen with Stripe error message; retry up to 3 times
6. Platform fee (if applicable) shown as a USD line item on the checkout screen
7. Stripe webhooks update session and subscription status in real time
8. Refunds processed via Stripe back to original payment method within 5–10 business days

---

### US-038 – Therapist Sets International Profile Visibility · Must Have · SP: 5

**User Story**
As a therapist, I want to control whether my profile is visible to international clients so that I can manage my capacity and choose which markets I serve.

**Acceptance Criteria**
1. International visibility toggle accessible from Dashboard > My Profile > Visibility Settings
2. Options: 'Nigeria only', 'International only', 'Both Nigeria and International'
3. Default for Nigeria-based therapists: 'Nigeria only'; therapist must explicitly opt in to international visibility
4. Default for international therapists: 'International only'; therapist must explicitly opt in to Nigeria visibility
5. When international visibility is enabled, therapist profile appears in search results for international clients
6. International clients see therapist's pricing in USD; Nigerian clients see NGN pricing on the same profile
7. Change takes effect within 2 minutes of save

---

### US-039 – International Client Browses and Filters Therapists · Must Have · SP: 5

**User Story**
As an international client, I want to browse therapists who are available to international users and see their pricing in USD so that I can make an informed booking decision.

**Acceptance Criteria**
1. International clients see only therapists with international visibility enabled by default
2. Filter toggle: 'Show all therapists' allows international clients to see Nigeria-only therapists (with a note: 'This therapist may not be available for international bookings')
3. All prices on therapist cards shown in USD for international clients
4. Therapist search filters available: language, specialisation, plan accepted, availability, rating
5. Therapist card for international clients shows: name alias, specialisation, languages, rating, USD price range, and 'Accepts international clients' badge

---

### US-040 – Multi-Timezone Session Scheduling · Must Have · SP: 8

**User Story**
As an international client or therapist, I want all session times to be displayed in my local timezone so that I never miss a session due to timezone confusion.

**Acceptance Criteria**
1. Therapist availability calendar always displays in the viewing user's local timezone (auto-detected from device)
2. User can manually override their timezone from Account > Settings > Timezone
3. Session confirmation emails include the session time in: the client's timezone AND the therapist's timezone
4. Example format: 'Your session is at 3:00 PM WAT (Nigeria) / 4:00 PM BST (UK)'
5. 24-hour session reminder notification sent in client's local time
6. System handles daylight saving time transitions automatically for all supported timezones
7. If client and therapist are more than 8 hours apart, a tooltip warns: 'This therapist is in a significantly different timezone. Please confirm the session time carefully.'

---

### US-041 – International Therapist Onboarding and Earnings · Must Have · SP: 8

**User Story**
As an international therapist, I want to onboard onto Mindenity and receive my earnings in USD so that I can offer therapy services globally through the platform.

**Acceptance Criteria**
1. International therapist registration accepts: license from any recognised professional body in the therapist's country
2. Admin review considers international licensing standards; admin can flag for additional verification
3. Earnings for international therapists processed in USD via Stripe Connect
4. Therapist sets a USD payout bank account during onboarding (Stripe Connect onboarding flow)
5. Earnings dashboard shows: sessions completed, USD earned, pending payout, payout history
6. Payouts processed weekly; minimum payout threshold: $50 USD
7. Platform commission for international therapists: same percentage as Nigerian therapists
8. Therapist can see a breakdown of Nigerian-client earnings (NGN converted to USD at the transaction rate) and international-client earnings (USD) separately in their dashboard

---

### US-042 – Admin Manages International Compliance and Data Residency · Must Have · SP: 8

**User Story**
As a platform admin, I want to ensure international client data is handled in compliance with applicable data protection laws so that Mindenity operates legally in all supported regions.

**Acceptance Criteria**
1. System displays GDPR-aligned privacy notice and consent form to all non-Nigerian users at registration
2. Nigerian users receive the NDPR consent form
3. Client session data and personal data for international users stored in a data centre outside Nigeria (EU or US region, configurable by admin)
4. Admin Console > Compliance shows: data residency setting, consent rates by region, data deletion requests
5. Client can submit a GDPR-aligned right-to-erasure request from Account > Privacy > Delete My Data
6. Right-to-erasure requests processed and confirmed within 30 days
7. Super admin can view a compliance audit log of all data access and deletion events by region

---

## Sprint Planning Summary

Sprint allocation for all 42 user stories. Epics 1–11 follow the v3.0 structure. Epic 12 (Global Access & Multi-Currency) is added to Sprint 3 and Sprint 4.

| Story ID | Title | Sprint | Points | Priority |
|---|---|---|---|---|
| US-001 | Client Account Registration (with region detection) | Sprint 1 | 5 | Must Have |
| US-002 | Client Onboarding Intake (with plan + currency) | Sprint 1 | 8 | Must Have |
| US-003 | Set Weekly Availability Schedule | Sprint 1 | 8 | Must Have |
| US-004 | Session Duration & Buffer | Sprint 1 | 5 | Must Have |
| US-005 | Mark Dates Unavailable | Sprint 1 | 5 | Must Have |
| US-006 | View Bookings on Calendar | Sprint 1 | 8 | Must Have |
| US-007 | Client Views Therapist Availability | Sprint 1 | 8 | Must Have |
| US-021 | Therapist Registration (global) | Sprint 1 | 8 | Must Have |
| US-023 | Admin Verify Therapists | Sprint 1 | 8 | Must Have |
| US-008 | Filter Therapists by Date Availability | Sprint 2 | 5 | Must Have |
| US-009 | View Therapist Accepted Plans (NGN + USD) | Sprint 2 | 5 | Must Have |
| US-010 | Pricing Breakdown Before Payment (NGN + USD) | Sprint 2 | 8 | Must Have |
| US-011 | Multi-Therapist Pricing & Plan Comparison | Sprint 2 | 8 | Must Have |
| US-012 | Admin Edit Pricing Table (NGN + USD) | Sprint 2 | 8 | Must Have |
| US-013 | Admin Price Bands (per region) | Sprint 2 | 8 | Must Have |
| US-016 | Save Multiple Therapists | Sprint 2 | 5 | Must Have |
| US-017 | Book Multiple Therapists | Sprint 2 | 8 | Must Have |
| US-019 | Payment (Paystack + Stripe) | Sprint 2 | 8 | Must Have |
| US-022 | Therapist Custom Pricing (NGN + USD) | Sprint 2 | 8 | Must Have |
| US-025 | Post-Session Risk Assessment | Sprint 2 | 8 | Must Have |
| US-026 | Respond to Crisis Support Alert | Sprint 2 | 13 | Must Have |
| US-027 | Therapist Selects Accepted Plans | Sprint 2 | 8 | Must Have |
| US-028 | Filter Therapist Directory by Plan | Sprint 2 | 5 | Must Have |
| US-030 | Client Selects Subscription Plan (NGN + USD) | Sprint 2 | 8 | Must Have |
| US-032 | AI Mental Wellness Assessment | Sprint 2 | 5 | Must Have |
| US-033 | Crisis Support on Eligible Plans | Sprint 2 | 8 | Must Have |
| US-034 | Therapist Views Client Plan Details | Sprint 2 | 3 | Must Have |
| US-036 | Region Detection & Currency Assignment | Sprint 2 | 5 | Must Have |
| US-037 | International Payment via Stripe | Sprint 2 | 8 | Must Have |
| US-038 | Therapist Sets International Visibility | Sprint 2 | 5 | Must Have |
| US-014 | Promotional Pricing (NGN + USD) | Sprint 3 | 5 | Should Have |
| US-015 | Approve Custom Pricing Requests | Sprint 3 | 5 | Should Have |
| US-018 | Compare Therapists Side by Side | Sprint 3 | 5 | Must Have |
| US-020 | Payment History & Receipts | Sprint 3 | 3 | Should Have |
| US-024 | Admin Analytics (with regional breakdown) | Sprint 3 | 8 | Must Have |
| US-029 | Admin Plan-Therapist Eligibility Rules | Sprint 3 | 8 | Should Have |
| US-031 | Client Upgrades or Downgrades Plan | Sprint 3 | 8 | Must Have |
| US-035 | Admin Plan Adoption & Coverage Metrics | Sprint 3 | 5 | Must Have |
| US-039 | International Client Browses Therapists | Sprint 3 | 5 | Must Have |
| US-040 | Multi-Timezone Session Scheduling | Sprint 3 | 8 | Must Have |
| US-041 | International Therapist Onboarding & Earnings | Sprint 3 | 8 | Must Have |
| US-042 | International Compliance & Data Residency | Sprint 3 | 8 | Must Have |

### Sprint Point Totals

| Sprint | Stories | Total Points | Key Deliverables |
|---|---|---|---|
| Sprint 1 | 9 stories | 63 | Registration, onboarding, availability, therapist verification |
| Sprint 2 | 21 stories | 152 | Pricing UI (NGN+USD), plan selection, Stripe, region detection, therapist plan prefs, payments, crisis |
| Sprint 3 | 12 stories | 76 | Advanced features, analytics, international therapists, timezone, compliance, upgrade/downgrade |

---

## EPIC 13: Therapist Profit Sharing & Commission Model

> Mindenity operates as a marketplace — it provides client acquisition, AI tools, payment processing, crisis infrastructure, and platform maintenance. In return, it earns a commission on every session. The model is designed to be fairer than BetterHelp (where only 17% of therapists feel fairly paid), competitive with Bolt and Uber's regulated African rate of 18%, and structured to reward both loyalty (lifetime sessions) and active performance (monthly volume).

**Persona: Therapist, Admin**

### Commission Structure Overview

| Level | Unlock Condition | Therapist % | Mindenity % | Permanent? |
|---|---|---|---|---|
| New | Join platform (0–49 lifetime sessions) | 70% | 30% | — |
| Tier 1 | 50 lifetime sessions completed | 75% | 25% | Yes — never lost |
| Tier 1+ | Tier 1 + 3-month avg ≥20 sessions/month | 77% | 23% | No — activity-based |
| Tier 2 | 100 lifetime sessions completed | 80% | 20% | Yes — never lost |
| Tier 2+ | Tier 2 + 3-month avg ≥20 sessions/month | 82% | 18% | No — activity-based |
| Tier 3 | 200 lifetime sessions completed | 85% | 15% | Yes — never lost |
| Tier 3+ | Tier 3 + 3-month avg ≥20 sessions/month | 87% | 13% | No — activity-based |
| Tier 4 | 250 lifetime sessions completed | 88% | 12% | Yes — never lost |
| Tier 4+ | Tier 4 + 3-month avg ≥20 sessions/month | 90% | 10% | No — activity-based |

> *Tier+ adds 2% to the therapist share. It is earned by maintaining a 3-month rolling average of 20+ sessions/month. If a therapist goes on break, they keep their base tier rate permanently — only the Tier+ bonus is paused until the average recovers.*
> *International (USD/Stripe) modifier: Mindenity retains an additional 3% on international sessions to cover Stripe processing costs (~2.9% per transaction). The therapist's effective share is unchanged — the 3% is a cost pass-through, not a profit increment.*

---

### US-043 – Platform Calculates and Displays Therapist Commission Tier in Real Time · Must Have · SP: 8

**User Story**
As a verified therapist, I want the platform to automatically calculate my commission tier based on my lifetime session count so that I always know my current rate and how close I am to the next tier.

**Acceptance Criteria**
1. System tracks each therapist's total completed sessions as a lifetime counter, incrementing by 1 on every confirmed and completed session
2. Commission tier is recalculated automatically after each session completes
3. Tier thresholds: New = 0–49 sessions (70/30), Tier 1 = 50 sessions (75/25), Tier 2 = 100 sessions (80/20), Tier 3 = 200 sessions (85/15), Tier 4 = 250 sessions (88/12)
4. Once a tier is reached it is permanent and can never be downgraded regardless of future session volume or breaks
5. Therapist Dashboard shows: current tier badge, lifetime session count, sessions to next tier, and a progress bar
6. When a therapist crosses a tier threshold mid-month, the new rate applies from the next completed session onwards
7. System sends an in-app notification and email: 'Congratulations — you have reached [Tier Name]. Your new commission rate is [X]%.'

---

### US-044 – Therapist Views Earnings Dashboard with Commission Breakdown · Must Have · SP: 8

**User Story**
As a therapist, I want to see a detailed earnings dashboard showing my commission tier, monthly earnings, per-session breakdown, and projected path to the next tier so that I can plan my practice and income.

**Acceptance Criteria**
1. Earnings dashboard accessible from Therapist Dashboard > My Earnings
2. Dashboard displays: current tier and Tier+ status, lifetime session count, 3-month rolling session average, current commission split (therapist % / Mindenity %), and monthly earnings (NGN or USD based on therapist region)
3. Monthly earnings breakdown shows: gross session revenue, Mindenity commission deducted, Tier+ bonus (if active), net therapist earnings, and pending payout amount
4. Path to next tier shows: sessions remaining to unlock next base tier, and current 3-month average vs the 20-session threshold for Tier+
5. Historical earnings view: monthly earnings chart for the past 12 months with tier changes overlaid
6. International therapist earnings shown in USD; Nigeria-based therapist earnings shown in NGN
7. Earnings data refreshes every 24 hours; pending payout updates in real time after each confirmed session

---

### US-045 – Platform Auto-Activates Tier+ When Monthly Average Reaches Threshold · Must Have · SP: 5

**User Story**
As a therapist, I want the platform to automatically upgrade me to Tier+ when my 3-month rolling session average reaches 20 or more sessions per month so that I receive the performance bonus without any manual process.

**Acceptance Criteria**
1. System calculates each therapist's 3-month rolling session average at the end of every calendar month
2. Rolling average = (sessions in month M + sessions in month M-1 + sessions in month M-2) ÷ 3
3. If the rolling average is ≥20 and the therapist is not already at Tier+: Tier+ is activated from the first session of the following month
4. Therapist receives in-app notification and email: 'You have earned Tier [N]+. Your commission rate has increased to [X]%. Keep maintaining your average to keep this bonus.'
5. Tier+ badge displayed on the therapist's dashboard and profile (visible to clients as a 'High Activity' indicator)
6. The 2% Tier+ bonus applies to all sessions in the qualifying month, not retroactively to previous months

---

### US-046 – Platform Removes Tier+ When Average Drops Below Threshold · Must Have · SP: 5

**User Story**
As a therapist, I want to understand that if my monthly average drops below the Tier+ threshold, I lose only the Tier+ bonus — never my base tier — so that taking a break does not permanently harm my commission rate.

**Acceptance Criteria**
1. If the 3-month rolling average drops below 20 sessions/month at month-end calculation: Tier+ is deactivated from the first session of the following month
2. Base tier is never affected — a Tier 3 therapist who loses Tier 3+ reverts to Tier 3 (85%), not to a lower tier
3. Therapist receives in-app notification and email: 'Your Tier [N]+ bonus has been paused as your 3-month average has dropped below 20 sessions/month. Your base Tier [N] rate of [X]% is unchanged. Rebuild your average to re-earn Tier+.'
4. Tier+ is automatically reinstated as soon as the rolling average returns to ≥20 at the next month-end calculation
5. No manual application is required to re-earn Tier+ — it is fully automated
6. Dashboard shows: current 3-month average, sessions needed this month to recover Tier+, and projected re-earn date
7. A therapist on extended leave (maternity, medical) can flag their account as 'On Leave' — the 3-month average calculation pauses and resumes when they return, protecting their Tier+ status

---

### US-047 – Admin Views Commission Analytics Across All Therapists · Must Have · SP: 5

**User Story**
As a platform admin, I want to view commission and earnings analytics segmented by tier so that I can monitor platform revenue health and therapist distribution across tiers.

**Acceptance Criteria**
1. Admin Console > Commission Analytics shows: total therapists per tier (New, T1, T1+, T2, T2+, T3, T3+, T4, T4+), commission revenue earned by Mindenity per tier per month, average therapist earnings per tier, and month-over-month tier progression
2. Revenue breakdown: total session revenue, total therapist payouts, total Mindenity commission, broken down by Nigeria (NGN) and International (USD)
3. Tier progression report: therapists who moved up a tier this month, therapists who gained or lost Tier+ this month
4. At-risk panel: therapists currently at the Tier+ threshold (3-month average between 17–19 sessions) — those close to losing or gaining Tier+
5. All commission data exportable as CSV or PDF with date range filter
6. Admin can view individual therapist commission history from the therapist detail page

---

### US-048 – Therapist Receives Itemised Payout with Commission Breakdown · Must Have · SP: 5

**User Story**
As a therapist, I want to receive a clear itemised payout statement every pay cycle so that I understand exactly what I earned, what Mindenity deducted, and why.

**Acceptance Criteria**
1. Payouts processed weekly for all therapists (minimum payout threshold: ₦5,000 for Nigeria, $50 for international)
2. Payout notification sent via email and in-app on payout date
3. Payout statement itemises: pay period dates, number of sessions completed, gross session revenue, tier rate applied (e.g. 'Tier 2+ — 82%'), Tier+ bonus amount (if applicable), Mindenity commission deducted, Stripe processing fee deduction (international only), net payout amount, and payment method
4. Therapist can view and download all past payout statements from Dashboard > My Earnings > Payout History
5. If a session is refunded after payout, the deduction is applied to the next payout cycle with a clear line item explanation
6. Nigeria therapists paid via bank transfer (Paystack); international therapists paid via Stripe Connect to their registered bank account
7. Therapists receive a monthly earnings summary email on the 1st of each month showing the prior month's total earnings, total sessions, average per session, and current tier status

---

## Sprint Planning Summary — v5.0

All 48 user stories across 13 epics.

| Story ID | Title | Sprint | Points | Priority |
|---|---|---|---|---|
| US-001 | Client Account Registration (with region detection) | Sprint 1 | 5 | Must Have |
| US-002 | Client Onboarding Intake (with plan + currency) | Sprint 1 | 8 | Must Have |
| US-003 | Set Weekly Availability Schedule | Sprint 1 | 8 | Must Have |
| US-004 | Session Duration & Buffer | Sprint 1 | 5 | Must Have |
| US-005 | Mark Dates Unavailable | Sprint 1 | 5 | Must Have |
| US-006 | View Bookings on Calendar | Sprint 1 | 8 | Must Have |
| US-007 | Client Views Therapist Availability | Sprint 1 | 8 | Must Have |
| US-021 | Therapist Registration (global) | Sprint 1 | 8 | Must Have |
| US-023 | Admin Verify Therapists | Sprint 1 | 8 | Must Have |
| US-008 | Filter Therapists by Date Availability | Sprint 2 | 5 | Must Have |
| US-009 | View Therapist Accepted Plans (NGN + USD) | Sprint 2 | 5 | Must Have |
| US-010 | Pricing Breakdown Before Payment | Sprint 2 | 8 | Must Have |
| US-011 | Multi-Therapist Pricing & Plan Comparison | Sprint 2 | 8 | Must Have |
| US-012 | Admin Edit Pricing Table (NGN + USD) | Sprint 2 | 8 | Must Have |
| US-013 | Admin Price Bands (per region) | Sprint 2 | 8 | Must Have |
| US-016 | Save Multiple Therapists | Sprint 2 | 5 | Must Have |
| US-017 | Book Multiple Therapists | Sprint 2 | 8 | Must Have |
| US-019 | Payment (Paystack + Stripe) | Sprint 2 | 8 | Must Have |
| US-022 | Therapist Custom Pricing (NGN + USD) | Sprint 2 | 8 | Must Have |
| US-025 | Post-Session Risk Assessment | Sprint 2 | 8 | Must Have |
| US-026 | Respond to Crisis Support Alert | Sprint 2 | 13 | Must Have |
| US-027 | Therapist Selects Accepted Plans | Sprint 2 | 8 | Must Have |
| US-028 | Filter Therapist Directory by Plan | Sprint 2 | 5 | Must Have |
| US-030 | Client Selects Subscription Plan | Sprint 2 | 8 | Must Have |
| US-032 | AI Mental Wellness Assessment | Sprint 2 | 5 | Must Have |
| US-033 | Crisis Support on Eligible Plans | Sprint 2 | 8 | Must Have |
| US-034 | Therapist Views Client Plan Details | Sprint 2 | 3 | Must Have |
| US-036 | Region Detection & Currency Assignment | Sprint 2 | 5 | Must Have |
| US-037 | International Payment via Stripe | Sprint 2 | 8 | Must Have |
| US-038 | Therapist Sets International Visibility | Sprint 2 | 5 | Must Have |
| US-043 | Platform Calculates Commission Tier in Real Time | Sprint 2 | 8 | Must Have |
| US-045 | Platform Auto-Activates Tier+ | Sprint 2 | 5 | Must Have |
| US-046 | Platform Removes Tier+ (Base Tier Kept) | Sprint 2 | 5 | Must Have |
| US-014 | Promotional Pricing (NGN + USD) | Sprint 3 | 5 | Should Have |
| US-015 | Approve Custom Pricing Requests | Sprint 3 | 5 | Should Have |
| US-018 | Compare Therapists Side by Side | Sprint 3 | 5 | Must Have |
| US-020 | Payment History & Receipts | Sprint 3 | 3 | Should Have |
| US-024 | Admin Analytics (with regional + commission breakdown) | Sprint 3 | 8 | Must Have |
| US-029 | Admin Plan-Therapist Eligibility Rules | Sprint 3 | 8 | Should Have |
| US-031 | Client Upgrades or Downgrades Plan | Sprint 3 | 8 | Must Have |
| US-035 | Admin Plan Adoption & Coverage Metrics | Sprint 3 | 5 | Must Have |
| US-039 | International Client Browses Therapists | Sprint 3 | 5 | Must Have |
| US-040 | Multi-Timezone Session Scheduling | Sprint 3 | 8 | Must Have |
| US-041 | International Therapist Onboarding & Earnings | Sprint 3 | 8 | Must Have |
| US-042 | International Compliance & Data Residency | Sprint 3 | 8 | Must Have |
| US-044 | Therapist Views Earnings Dashboard | Sprint 3 | 8 | Must Have |
| US-047 | Admin Views Commission Analytics | Sprint 3 | 5 | Must Have |
| US-048 | Therapist Receives Itemised Payout | Sprint 3 | 5 | Must Have |

### Sprint Point Totals

| Sprint | Stories | Total Points | Key Deliverables |
|---|---|---|---|
| Sprint 1 | 9 stories | 63 | Registration, onboarding, availability, therapist verification |
| Sprint 2 | 24 stories | 170 | Pricing UI, plans, Stripe, region detection, commission tier engine, Tier+ logic, crisis support |
| Sprint 3 | 15 stories | 101 | Analytics, international access, timezone, compliance, earnings dashboard, payout statements |

---

## Appendix A: Full Dual-Region Pricing Reference

### A1. Nigeria Pricing (NGN)

| Plan | Segment | Type | Price (NGN) | Sessions / Month |
|---|---|---|---|---|
| Essential | Individual | Pay-as-you-go | ₦30,000 | 1 session |
| Balance | Individual | Monthly subscription | ₦120,000 / month | 4 sessions |
| Thrive | Individual | Monthly subscription | ₦350,000 / month | 8 sessions |
| Together | Couple | Pay-as-you-go | ₦50,000 | 1 group session |
| Harmony | Couple | Monthly subscription | ₦220,000 / month | 4 group sessions |
| Restore | Couple | Monthly subscription | ₦450,000 / month | 8 group sessions |
| Home | Family (5+) | Pay-as-you-go | ₦100,000 | 1 group session |
| Family Care | Family (5+) | Monthly subscription | ₦350,000 / month | 4 group sessions |
| Family Thrive | Family (5+) | Monthly subscription | ₦650,000 / month | 8 group sessions |

### A2. International Pricing (USD — BetterHelp −30%)

> *BetterHelp 2026 reference: $260–$400/month for individual therapy (4 sessions/month). Midpoint $330/month used. Couples $340/month midpoint. Family extrapolated at 1.45× couple rate. Mindenity International = BetterHelp Reference × 0.70.*

| Plan | Segment | Type | BetterHelp Reference | Mindenity International (USD) | Sessions / Month |
|---|---|---|---|---|---|
| Essential | Individual | PAYG | $80/session | $55 per session | 1 session |
| Balance | Individual | Monthly | $330/month | $229 per month | 4 sessions |
| Thrive | Individual | Monthly | $660/month* | $459 per month | 8 sessions |
| Together | Couple | PAYG | $90/session | $62 per session | 1 group session |
| Harmony | Couple | Monthly | $340/month | $235 per month | 4 group sessions |
| Restore | Couple | Monthly | $680/month* | $475 per month | 8 group sessions |
| Home | Family | PAYG | $125/session* | $85 per session | 1 group session |
| Family Care | Family | Monthly | $490/month* | $339 per month | 4 group sessions |
| Family Thrive | Family | Monthly | $980/month* | $679 per month | 8 group sessions |

> *\* Extrapolated. BetterHelp does not offer these tiers. Family pricing extrapolated at 1.45× couple; Pro (8-session) tiers at 2× Lite before discount.*

### A3. Intake Category-to-Plan Recommendation Logic

| Category | Mild | Moderate | Severe | Crisis Banner |
|---|---|---|---|---|
| Abuse & Violation Trauma | Essential | Balance | Thrive | No |
| Loss, Grief & Separation | Essential | Balance | Balance | No |
| Family & Relationship Conflict | Essential | Balance | Thrive | No |
| Violence, Crisis & Accidents | Balance | Thrive | Thrive | Moderate+ |
| Workplace & Academic Stress | Essential | Balance | Balance | No |
| Health & Medical Trauma | Essential | Balance | Thrive | No |
| Identity & Social Trauma | Essential | Balance | Balance | No |
| Emotional & Internal Struggles | Essential | Balance | Thrive | Severe only |
| Addiction & Behavioural Challenges | Balance | Balance | Thrive | No |
| Child-Related Trauma & Development | Essential | Family Care | Family Thrive | No |
| Women — Pre & Post Birth Support | Essential | Balance | Thrive | No |
| Spiritual & Existential Concerns | Essential | Balance | Balance | No |
| Crisis & Immediate Support | Balance | Thrive | Thrive | Always |

---

## Appendix B: Mobile UI/UX Pricing Brief v2.0 — Key Specs

| Spec Area | Key Requirement |
|---|---|
| Currency display | Nigerian users always see ₦ NGN. International users always see $ USD. Never show both currencies simultaneously to the same user in pricing UI. |
| Region detection | IP geolocation on first launch. Region stored on user profile. Manual override requires admin approval. |
| Plan card carousel | Horizontal peek-scroll, 375pt base frame. Featured = intake-recommended plan. Price shown in user's currency. |
| Payment routing | Nigeria → Paystack (card/transfer/USSD/wallet). International → Stripe (card/Google Pay/Apple Pay/PayPal). |
| Crisis Support button | Persistent floating action button on eligible plans. Soft magenta. Label: 'Crisis Support Access'. Local crisis line shown based on client region. |
| Timezone display | All session times shown in viewing user's local timezone. Session confirmations show both timezones when client and therapist differ. |
| Confirmation screen | Replaces payment screen in nav stack. Amount shown in user's currency. Stripe reference for international users. |
| Dark mode | Full dark mode support on all pricing screens including dual-currency display. |
| Accessibility | Price read as full words: 'Two hundred and twenty-nine US dollars per month' or 'One hundred and twenty thousand naira per month'. |

---

## Appendix C: Profit Sharing Model — Full Reference

### C1. Base Tier Commission Rates

| Tier | Unlock Condition | Therapist Earns | Mindenity Earns | Example (Balance ₦120,000/mo) |
|---|---|---|---|---|
| New | 0–49 lifetime sessions | 70% | 30% | Therapist ₦84,000 / Mindenity ₦36,000 |
| Tier 1 | 50 sessions | 75% | 25% | Therapist ₦90,000 / Mindenity ₦30,000 |
| Tier 2 | 100 sessions | 80% | 20% | Therapist ₦96,000 / Mindenity ₦24,000 |
| Tier 3 | 200 sessions | 85% | 15% | Therapist ₦102,000 / Mindenity ₦18,000 |
| Tier 4 | 250 sessions | 88% | 12% | Therapist ₦105,600 / Mindenity ₦14,400 |

### C2. Tier+ Performance Bonus (+2% to therapist)

> *Tier+ is earned when a therapist's 3-month rolling session average reaches 20 or more sessions per month. It adds 2% to the therapist share. It is lost — but the base tier is kept — when the average drops below 20. Fully automated, no manual application required.*

| Tier+ | Condition | Therapist Earns | Mindenity Earns | Example (Balance ₦120,000/mo) |
|---|---|---|---|---|
| Tier 1+ | Tier 1 + avg ≥20 sessions/mo | 77% | 23% | Therapist ₦92,400 / Mindenity ₦27,600 |
| Tier 2+ | Tier 2 + avg ≥20 sessions/mo | 82% | 18% | Therapist ₦98,400 / Mindenity ₦21,600 |
| Tier 3+ | Tier 3 + avg ≥20 sessions/mo | 87% | 13% | Therapist ₦104,400 / Mindenity ₦15,600 |
| Tier 4+ | Tier 4 + avg ≥20 sessions/mo | 90% | 10% | Therapist ₦108,000 / Mindenity ₦12,000 |

### C3. Break Protection Rules

| Scenario | Base Tier | Tier+ Status | What Happens |
|---|---|---|---|
| Therapist takes 3 weeks sick leave | Kept permanently | Lost if avg drops below 20 | Returns to base tier rate. Tier+ reinstated automatically when avg recovers. |
| Therapist takes maternity/paternity leave | Kept permanently | Can flag 'On Leave' to pause avg calculation | Avg calculation pauses. Tier+ status held. Resumes on return. |
| Therapist reduces to 5 sessions/month | Kept permanently | Lost — avg below 20 | Base tier rate applies. No penalty beyond losing Tier+ bonus. |
| Therapist returns from break, avg recovers | Unchanged | Automatically reinstated at next month-end | No action needed. System recalculates at month-end. |
| New therapist does 30 sessions in first month | Still New — needs 50 lifetime sessions | Not yet applicable | Tier 1 unlocks at session 50 regardless of monthly volume. |

### C4. International Commission Modifier

| Region | Payment Gateway | Modifier | Reason | Net Therapist Impact |
|---|---|---|---|---|
| Nigeria (NGN) | Paystack | None | Standard rates apply | Full tier/Tier+ rate as above |
| International (USD) | Stripe | Mindenity retains +3% | Stripe fee ~2.9% per transaction | Therapist effective share reduces by 3% of gross — cost pass-through only |

### C5. Benchmark Comparison

| Platform | Provider Keeps | Platform Takes | Notes |
|---|---|---|---|
| BetterHelp | 35–65% | 35–65% | Widely criticised — only 17% of therapists feel fairly paid |
| Uber (Africa) | 75–82% | 18–25% | Regulated to 18% cap after driver strikes |
| Bolt (Africa) | 80–90% | 10–20% | Driver-friendly model drives supply growth |
| Mindenity New | 70% | 30% | Covers onboarding, AI matching, and infrastructure setup costs |
| Mindenity Tier 1 | 75% | 25% | Fairer than BetterHelp from first milestone |
| Mindenity Tier 4+ | 90% | 10% | Best-in-class rate for elite active therapists |

---

*Document End – Mindenity User Stories v5.0*
*Your Path to a Clearer Mind | Nigeria & Global*
*Confidential — For Internal Use Only | Mindenity © 2026*
