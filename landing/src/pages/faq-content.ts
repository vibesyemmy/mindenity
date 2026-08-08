/*
 * Full FAQ copy, supplied by the client. Structured rather than raw JSX so the
 * page's search filter can derive its haystack from the same source it renders
 * — no duplicated plain-text copies to drift out of sync.
 *
 * `**bold**` is the only inline markup; see renderRich in FaqPage.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "prices"; rows: [string, string][] };

export type FaqItem = { q: string; a: Block[] };
export type FaqGroup = { label: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    label: "Getting started",
    items: [
      {
        q: "What is Mindenity?",
        a: [
          {
            kind: "p",
            text: "Mindenity is a mental health and wellness platform that connects you with licensed therapists, counsellors and wellness coaches by voice or video, from your phone. It was built for Nigeria first, and for Nigerians living abroad who want a professional who understands the context they come from.",
          },
          {
            kind: "p",
            text: "Alongside sessions, the app gives you a guided wellness check-in, a private AI wellness companion for the hours between appointments, and care plans for individuals, couples and families.",
          },
        ],
      },
      {
        q: "Do I need a diagnosis or a referral to start?",
        a: [
          {
            kind: "p",
            text: "No. You do not need a referral, a diagnosis, or a reason that sounds serious enough. People come to Mindenity for grief, work pressure, a marriage that has gone quiet, sleep that will not come, or simply a feeling they cannot name yet.",
          },
          {
            kind: "p",
            text: "The check-in you complete when you sign up asks about your mood, stress, sleep and what is on your mind, then points you toward the kind of support that fits.",
          },
        ],
      },
      {
        q: "Who can use Mindenity?",
        a: [
          {
            kind: "p",
            text: "Adults aged 18 and over can open an account themselves. Couples can share a plan, and family plans cover households of five or more.",
          },
          {
            kind: "p",
            text: "Where a young person under 18 is included in a family plan, a parent or guardian must set up the account, give consent, and remain the account holder. We follow safeguarding guidance set by our Clinical Advisory Panel for any session involving a minor.",
          },
        ],
      },
      {
        q: "Where is Mindenity available?",
        a: [
          {
            kind: "p",
            text: "Mindenity is available in Nigeria, and to Nigerians living outside the country. Wherever you are, you can create an account, complete your check-in and book sessions with a professional who understands the context you come from.",
          },
          {
            kind: "p",
            text: "We are expanding beyond that — to the United States, Europe, other countries across Africa, Asia and further regions. Each launch follows the data protection and professional licensing rules of that country, so the platform arrives properly rather than quickly.",
          },
          {
            kind: "p",
            text: "If your country is not covered yet, sign up anyway. We will tell you the moment it is.",
          },
        ],
      },
      {
        q: "How do I get the Mindenity app?",
        a: [
          { kind: "p", text: "Three ways, and they all reach the same account:" },
          {
            kind: "ul",
            items: [
              "**iPhone and iPad** — download from the Apple App Store",
              "**Android phones and tablets** — download from the Google Play Store",
              "**Any device with a browser** — sign in at mindenity.com from a laptop, desktop or tablet, no download needed",
            ],
          },
          {
            kind: "p",
            text: "Your plan, your professional and your history follow you across all three. Start a check-in on your laptop and take the session on your phone if that suits you better.",
          },
        ],
      },
      {
        q: "What do I need to use it?",
        a: [
          {
            kind: "p",
            text: "An iPhone, an Android phone, or any computer or tablet with an up-to-date browser — plus a working internet connection. Nothing else to install and no special equipment.",
          },
          {
            kind: "p",
            text: "Voice sessions use far less data than video, so if your network is unsteady, choose voice — the quality holds up better and nothing about the session is lesser for it.",
          },
          {
            kind: "p",
            text: "Somewhere private to sit matters more than the device. Headphones help if the house is full.",
          },
        ],
      },
    ],
  },
  {
    label: "Finding the right professional",
    items: [
      {
        q: "How do I find the right therapist?",
        a: [
          {
            kind: "p",
            text: "Your wellness check-in produces a short profile of what you are dealing with, and the app uses it to recommend professionals whose training matches. You see each person's specialisms, approach, languages and availability before you book anything.",
          },
          {
            kind: "p",
            text: "You can also skip the recommendations and browse the full list yourself. Nobody is assigned to you without your say-so.",
          },
        ],
      },
      {
        q: "Are the professionals licensed and verified?",
        a: [
          {
            kind: "p",
            text: "Yes. Every therapist and counsellor submits their qualifications and professional registration for verification before they can appear on the platform or take a booking. Wellness coaches are listed separately from licensed clinicians so you always know which one you are speaking to.",
          },
          {
            kind: "p",
            text: "Our Clinical Advisory Panel, made up of practising clinicians, sets the standards we verify against.",
          },
        ],
      },
      {
        q: "What if my therapist is not the right fit?",
        a: [
          {
            kind: "p",
            text: "Change them. Fit matters more than loyalty, and a first session that does not click is common rather than a failure. You can pick a different professional from the app without explaining yourself to anyone, and your remaining sessions stay with you.",
          },
        ],
      },
      {
        q: "Do I see the same person every time?",
        a: [
          {
            kind: "p",
            text: "On any subscription plan, yes — you have a dedicated professional, and your check-in results go to them so you are not starting the story again each session. That continuity is most of what makes therapy work.",
          },
          {
            kind: "p",
            text: "On pay-as-you-go you book session by session, and you can keep returning to the same person as long as they have availability.",
          },
        ],
      },
      {
        q: "What languages can I have sessions in?",
        a: [
          {
            kind: "p",
            text: "Every professional lists the languages they practise in on their profile, and you can filter by language before you book. English is available across the platform, with additional Nigerian languages depending on the professional.",
          },
        ],
      },
    ],
  },
  {
    label: "How sessions work",
    items: [
      {
        q: "How long is a session, and is it voice or video?",
        a: [
          {
            kind: "p",
            text: "A standard session is **45 minutes**, held by **voice or video** — you choose which when you book, and you can switch for the next one.",
          },
          {
            kind: "p",
            text: "Couples on a subscription plan start differently: the first session runs 60 minutes, split into two private 30-minute conversations, one with each partner. Every session after that is 45 minutes together.",
          },
        ],
      },
      {
        q: "What happens in the first session?",
        a: [
          {
            kind: "p",
            text: "Mostly listening. Your professional will already have read your check-in, so the session is spent understanding what brought you there, what you have tried, and what you want to be different. You will agree together on where to start.",
          },
          {
            kind: "p",
            text: "You are not expected to arrive with everything organised in your head. That is the work, not the entry fee.",
          },
        ],
      },
      {
        q: "Can I reschedule or cancel a session?",
        a: [
          {
            kind: "p",
            text: "Yes, from the app. Rescheduling with reasonable notice returns the session to your plan so nothing is lost. Very late cancellations and no-shows may count against the session, since your professional has held the time for you.",
          },
          {
            kind: "p",
            text: "The exact notice period is shown on the booking screen before you confirm.",
          },
        ],
      },
      {
        q: "What if the connection drops mid-session?",
        a: [
          {
            kind: "p",
            text: "Rejoin from the app and the session continues. If the network will not hold, your professional can move you to voice, or the remaining time is rescheduled at no extra cost. A bad network does not cost you a session.",
          },
        ],
      },
    ],
  },
  {
    label: "Plans and payment",
    items: [
      {
        q: "What does it cost?",
        a: [
          {
            kind: "p",
            text: "You can pay for a single session, or subscribe monthly for four or eight sessions. Nigerian pricing starts here:",
          },
          {
            kind: "prices",
            rows: [
              ["Essential — one individual session", "₦30,000"],
              ["Balance — 4 individual sessions a month", "₦120,000"],
              ["Thrive — 8 individual sessions a month", "₦350,000"],
              ["Together — one couples session", "₦50,000"],
              ["Home — one family session", "₦100,000"],
            ],
          },
          {
            kind: "p",
            text: "Couple and family subscriptions run alongside these, and the full nine plans are set out on the pricing page. There is no joining fee and no charge for creating an account or completing your check-in.",
          },
        ],
      },
      {
        q: "What is the difference between paying per session and subscribing?",
        a: [
          {
            kind: "p",
            text: "Pay-as-you-go is one session at a time, useful for trying the platform or for occasional support.",
          },
          {
            kind: "p",
            text: "A subscription costs less per session and adds the things that make care continuous: a dedicated professional, unlimited use of the AI wellness companion, and in-app crisis support. Most people start pay-as-you-go and move across once they know who they want to work with.",
          },
        ],
      },
      {
        q: "I live abroad. What currency do I pay in?",
        a: [
          {
            kind: "p",
            text: "Clients in Nigeria pay in Naira. Clients outside Nigeria pay in US dollars, with international individual sessions from $55 and monthly plans from $229. Our international pricing sits roughly 30% below comparable Western platforms.",
          },
          {
            kind: "p",
            text: "You see the full price in your own currency before you confirm anything. No conversion surprises after the fact.",
          },
        ],
      },
      {
        q: "Can I cancel or change my plan?",
        a: [
          {
            kind: "p",
            text: "Yes. You can upgrade, downgrade or cancel from your account at any time, and the app shows you exactly what changes — including how any credit is applied — before you confirm. Cancelling stops the next renewal; it is not a penalty and nobody will call to talk you out of it.",
          },
        ],
      },
      {
        q: "Does Mindenity work with health insurance or an employer?",
        a: [
          {
            kind: "p",
            text: "Individual accounts are paid directly at present. If you are an employer, HMO or organisation looking to sponsor care for a group, contact us and we will talk through how that can be set up.",
          },
        ],
      },
    ],
  },
  {
    label: "The AI tools",
    items: [
      {
        q: "Is the AI replacing the therapist?",
        a: [
          {
            kind: "p",
            text: "No, and it never will. Mindenity is built around human professionals. The AI does two supporting jobs: it guides your wellness check-in so your professional starts informed, and it gives you somewhere to think out loud at 2am when your next session is on Thursday.",
          },
          {
            kind: "p",
            text: "It does not diagnose, it does not prescribe, and it does not make decisions about your care.",
          },
        ],
      },
      {
        q: "What is the AI wellness companion?",
        a: [
          {
            kind: "p",
            text: "A private chat you can use as often as you like on any subscription plan, for the hours between sessions — working through a difficult evening, preparing what you want to raise next time, or practising a coping technique your professional taught you.",
          },
          {
            kind: "p",
            text: "It is included with every subscription and is not part of the pay-as-you-go plans.",
          },
        ],
      },
      {
        q: "Does my therapist read my AI conversations?",
        a: [
          {
            kind: "p",
            text: "Your chats are private to you. What your professional receives is your wellness check-in and anything you choose to share with them directly.",
          },
          {
            kind: "p",
            text: "The one exception is safety: if the conversation suggests you are at risk of serious harm, the app surfaces crisis support and can alert a professional. We would rather be transparent about that than quietly leave you alone with it.",
          },
        ],
      },
    ],
  },
  {
    label: "Privacy and your data",
    items: [
      {
        q: "Is what I say confidential?",
        a: [
          {
            kind: "p",
            text: "Yes. Sessions are confidential between you and your professional, who is bound by the same professional and ethical duties they would carry in a consulting room. Sessions are not recorded.",
          },
          {
            kind: "p",
            text: "The limits are the standard clinical ones: a professional may act where there is a serious risk to your life or someone else's, particularly a child's.",
          },
        ],
      },
      {
        q: "How is my information protected?",
        a: [
          {
            kind: "p",
            text: "Your data is encrypted in transit and at rest, held on regulated cloud infrastructure, and reachable only by people whose role genuinely requires it. Access is logged.",
          },
          {
            kind: "p",
            text: "We built to health-data standards from the start rather than adding them later, because a platform holding this kind of information does not get a second chance at it.",
          },
        ],
      },
      {
        q: "Do you sell my data or use it for advertising?",
        a: [
          {
            kind: "p",
            text: "No. We do not sell your data, share it with advertisers, or trade it with third parties. Our revenue comes from the plans people pay for, and we intend to keep it that way.",
          },
        ],
      },
      {
        q: "Can I delete my account and my records?",
        a: [
          {
            kind: "p",
            text: "Yes. You can request deletion of your account from your settings. Some clinical records are held for a defined retention period where professional or legal obligations require it; everything else is removed. The full detail is in our privacy policy.",
          },
        ],
      },
      {
        q: "Will anyone in my family see that I am using it?",
        a: [
          {
            kind: "p",
            text: "Not unless you tell them. Individual accounts are private to you. On a couple or family plan, each member's sessions and notes remain their own — a shared plan pays for care, it does not share the contents of it.",
          },
        ],
      },
    ],
  },
  {
    label: "If things are urgent",
    items: [
      {
        q: "What if I need help urgently?",
        a: [
          {
            kind: "p",
            text: "**Mindenity is not an emergency service.** If you or someone near you is in immediate danger, contact your local emergency services or go to the nearest hospital now — that is faster than anything an app can do.",
          },
          {
            kind: "p",
            text: "Inside the app, crisis support is always one tap away on subscription plans: it reaches your professional directly and shows the emergency and helpline numbers for where you are. If your own professional cannot respond immediately, the request is escalated so that someone qualified picks it up.",
          },
        ],
      },
      {
        q: "Can I add an emergency contact?",
        a: [
          {
            kind: "p",
            text: "Yes. You can register a trusted person on your account. In a crisis, that contact is surfaced immediately alongside professional support, so help does not depend on you being able to remember a number in a bad moment.",
          },
        ],
      },
      {
        q: "Can I book a session for someone I am worried about?",
        a: [
          {
            kind: "p",
            text: "They will need their own account and their own consent — care cannot be arranged over someone's head. What you can do is cover the cost, share the app, and be the person who sits with them while they book it. That is often the part that makes the difference.",
          },
        ],
      },
    ],
  },
  {
    label: "For therapists and coaches",
    items: [
      {
        q: "How do I join Mindenity as a professional?",
        a: [
          {
            kind: "p",
            text: "Apply through the app or the website. You will submit your qualifications, professional registration and identification for verification, build your profile and specialisms, set your availability, and add your payout details. Once verified, clients can find and book you.",
          },
        ],
      },
      {
        q: "How much do professionals earn?",
        a: [
          {
            kind: "p",
            text: "You keep 70% of each session from the start, and your share rises with the work you do:",
          },
          {
            kind: "ul",
            items: [
              "75% once you have completed 50 sessions",
              "80% at 100 sessions",
              "85% at 200 sessions",
            ],
          },
          {
            kind: "p",
            text: "These tiers are permanent — once earned, never lost. Sustaining an average of 20 or more sessions a month adds a further two points on top, which pauses if your volume drops and returns when it recovers. Your base tier is never affected.",
          },
        ],
      },
      {
        q: "When and how am I paid?",
        a: [
          {
            kind: "p",
            text: "Earnings from completed sessions accumulate in your in-app wallet and are paid to the bank account on your profile on a regular payout cycle, with every session itemised so you can check the arithmetic yourself.",
          },
          {
            kind: "p",
            text: "For sessions paid internationally, Mindenity retains an additional 3% to cover card processing costs. Your tier percentage is untouched by it.",
          },
        ],
      },
      {
        q: "Do I have to accept every client?",
        a: [
          {
            kind: "p",
            text: "No. You set your own availability and you can decline a booking that falls outside your competence or capacity. Referring a client to a better-matched colleague is good practice, not lost income, and the platform is designed to let you do it.",
          },
        ],
      },
    ],
  },
];
