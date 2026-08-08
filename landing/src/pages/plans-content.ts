/*
 * Plan data as supplied by the client.
 *
 * Every figure and claim here comes from the client's FAQ document. Nothing is
 * inferred: the couple and family SUBSCRIPTION tiers and the per-plan dollar
 * prices were not supplied, so they are marked pending rather than invented.
 *
 * Note the FAQ's "a subscription costs less per session" line is deliberately
 * not repeated on this page — the supplied Naira figures do not support it
 * (Balance matches Essential per session, Thrive is higher). Raised with the
 * client; restore the line only if the numbers change.
 */

export type Plan = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  /* Named predecessor whose features carry over, so each card lists only
     what it adds — the reference pattern. */
  inherits?: string;
  includes: string[];
  /* Only set where the client's own copy supports it. Drives the featured
     card treatment; leave unset rather than inventing a claim. */
  badge?: string;
};

export type Segment = {
  id: string;
  tab: string;
  /* Narrow-screen label — the full three do not fit one row on a phone. */
  short: string;
  label: string;
  intro: string;
  plans: Plan[];
  /* Tiers the client has confirmed exist but has not yet priced. */
  pending?: string;
};

const SUBSCRIPTION_INCLUDES = [
  "A dedicated professional who keeps your history",
  "Unlimited use of the AI wellness companion",
  "In-app crisis support, one tap away",
];

export const SEGMENTS: Segment[] = [
  {
    id: "individual",
    tab: "For yourself",
    short: "Yourself",
    label: "For yourself",
    intro:
      "One-to-one therapy by voice or video. Start with a single session, or subscribe for continuity with the same professional.",
    plans: [
      {
        name: "Essential",
        price: "₦30,000",
        cadence: "per session",
        summary: "One individual session, booked when you need it.",
        /* The client's FAQ: "Most people start pay-as-you-go and move across
           once they know who they want to work with." */
        badge: "Where most people start",
        includes: [
          "45-minute session, voice or video",
          "Choose your own professional",
          "Rebook the same person subject to availability",
        ],
      },
      {
        name: "Balance",
        price: "₦120,000",
        cadence: "per month",
        summary: "Four individual sessions a month.",
        inherits: "Essential",
        includes: ["Four 45-minute sessions a month", ...SUBSCRIPTION_INCLUDES],
      },
      {
        name: "Thrive",
        price: "₦350,000",
        cadence: "per month",
        summary: "Eight individual sessions a month.",
        inherits: "Balance",
        includes: ["Eight 45-minute sessions a month"],
      },
    ],
  },
  {
    id: "couple",
    tab: "For you two",
    short: "You two",
    label: "For you two",
    intro:
      "Two people, one room. On a subscription the first session runs 60 minutes, split into two private 30-minute conversations — one with each partner. Every session after that is 45 minutes together.",
    plans: [
      {
        name: "Together",
        price: "₦50,000",
        cadence: "per session",
        summary: "One couples session.",
        includes: [
          "45-minute session, voice or video",
          "Both partners in the room",
          "Choose your own professional",
        ],
      },
    ],
    pending: "Couple subscriptions are available — monthly pricing to follow.",
  },
  {
    id: "family",
    tab: "For your family",
    short: "Family",
    label: "For your family",
    intro:
      "Support for a household, with a professional who works with the family rather than one person in it.",
    plans: [
      {
        name: "Home",
        price: "₦100,000",
        cadence: "per session",
        summary: "One family session.",
        includes: [
          "45-minute session, voice or video",
          "Covers the household",
          "Choose your own professional",
        ],
      },
    ],
    pending: "Family subscriptions are available — monthly pricing to follow.",
  },
];

export const INTERNATIONAL = {
  heading: "Paying from outside Nigeria",
  body: "Clients in Nigeria pay in naira. Clients outside Nigeria pay in US dollars — individual sessions from $55, monthly plans from $229. You see the full price in your own currency before you confirm anything.",
  note: "Mindenity's international pricing sits roughly 30% below comparable Western platforms.",
};

export const NO_FEES =
  "There is no joining fee, and no charge for creating an account or completing your wellness check-in.";
