// Shared types + dummy data for admin therapist module.

export type Region = "NG" | "Int'l";
export type Tier = "Standard" | "Senior" | "Clinical";
export type TherapistStatus = "Active" | "Suspended" | "On leave";
export type VerificationStatus = "Pending" | "Info requested" | "On hold";
export type AiFlag = "Clean" | "Flagged";

export type Therapist = {
  id: string;
  name: string;
  initials: string;
  email: string;
  country: string;
  region: Region;
  tier: Tier;
  status: TherapistStatus;
  plansAccepted: string[];
  sessions30d: number;
  earnings30d: { amount: number; currency: "NGN" | "USD" };
  rating: number;
  ratingCount: number;
  bio: string;
  specializations: string[];
  languages: string[];
  yearsOfPractice: number;
  licenseNumber: string;
  licenseExpiry: string;
  joinedAt: string;
  verifiedBy: string;
  verifiedAt: string;
};

export type VerificationApplication = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  country: string;
  region: Region;
  dob: string;
  timeZone: string;
  specializations: string[];
  sessionFormats: ("Video" | "Voice" | "Chat")[];
  languages: string[];
  yearsOfPractice: number;
  bio: string;
  licenseNumber: string;
  licenseIssuer: string;
  licenseExpiry: string;
  licenseFile: string;
  idFile: string;
  submittedAt: string;
  submittedAgo: string;
  status: VerificationStatus;
  aiFlag: AiFlag;
  aiChecks: {
    licenseOcr: "pass" | "fail" | "warn";
    sanctions: "pass" | "fail" | "warn";
    duplicate: "pass" | "fail" | "warn";
    bioQuality: "pass" | "fail" | "warn";
  };
  aiNote: string;
};

export type TherapistFilters = {
  q?: string;
  region?: "all" | "ng" | "intl";
  tier?: "all" | "standard" | "senior" | "clinical";
  status?: "all" | "active" | "suspended";
};

export type VerificationFilters = {
  q?: string;
  region?: "all" | "ng" | "intl";
  aiFlag?: "all" | "flagged" | "clean";
};

const THERAPISTS: Therapist[] = [
  {
    id: "t-001",
    name: "Dr. Tola Adesina",
    initials: "TA",
    email: "tola@mindenity.com",
    country: "Nigeria",
    region: "NG",
    tier: "Senior",
    status: "Active",
    plansAccepted: ["Essential", "Together", "Harmony", "Restore"],
    sessions30d: 87,
    earnings30d: { amount: 2_140_000, currency: "NGN" },
    rating: 4.9,
    ratingCount: 312,
    bio: "Couples and family therapist with 12 years of practice. CBT + EFT trained.",
    specializations: ["Couples", "Family", "Anxiety"],
    languages: ["English", "Yoruba"],
    yearsOfPractice: 12,
    licenseNumber: "NG-CLP-44211",
    licenseExpiry: "2028-08-14",
    joinedAt: "2024-03-12",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2024-03-15",
  },
  {
    id: "t-002",
    name: "Dr. Marcus Quinn",
    initials: "MQ",
    email: "marcus@mindenity.com",
    country: "United Kingdom",
    region: "Int'l",
    tier: "Clinical",
    status: "Active",
    plansAccepted: ["Essential", "Together", "Harmony", "Restore", "Home", "Family Care", "Family Thrive"],
    sessions30d: 102,
    earnings30d: { amount: 11_240, currency: "USD" },
    rating: 4.8,
    ratingCount: 198,
    bio: "Clinical psychologist specialising in trauma and CPTSD. EMDR certified.",
    specializations: ["Trauma", "PTSD", "Anxiety"],
    languages: ["English"],
    yearsOfPractice: 18,
    licenseNumber: "UK-HCPC-29128",
    licenseExpiry: "2027-02-01",
    joinedAt: "2024-01-08",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2024-01-12",
  },
  {
    id: "t-003",
    name: "Dr. Lina Park",
    initials: "LP",
    email: "lina@mindenity.com",
    country: "Singapore",
    region: "Int'l",
    tier: "Senior",
    status: "Active",
    plansAccepted: ["Together", "Harmony", "Restore"],
    sessions30d: 64,
    earnings30d: { amount: 8_120, currency: "USD" },
    rating: 4.7,
    ratingCount: 142,
    bio: "Couples therapist with a focus on cross-cultural relationships.",
    specializations: ["Couples", "Cross-cultural"],
    languages: ["English", "Korean", "Mandarin"],
    yearsOfPractice: 9,
    licenseNumber: "SG-SAC-1187",
    licenseExpiry: "2026-09-30",
    joinedAt: "2024-05-22",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2024-05-25",
  },
  {
    id: "t-004",
    name: "Dr. Aisha Bello",
    initials: "AB",
    email: "aisha@mindenity.com",
    country: "Nigeria",
    region: "NG",
    tier: "Standard",
    status: "Active",
    plansAccepted: ["Essential", "Together"],
    sessions30d: 41,
    earnings30d: { amount: 820_000, currency: "NGN" },
    rating: 4.6,
    ratingCount: 67,
    bio: "Individual therapy focused on workplace anxiety and burnout.",
    specializations: ["Anxiety", "Burnout"],
    languages: ["English", "Hausa", "Yoruba"],
    yearsOfPractice: 5,
    licenseNumber: "NG-CLP-55821",
    licenseExpiry: "2027-11-12",
    joinedAt: "2025-09-01",
    verifiedBy: "Sarah Okeke",
    verifiedAt: "2025-09-04",
  },
  {
    id: "t-005",
    name: "Dr. Priya Shah",
    initials: "PS",
    email: "priya@mindenity.com",
    country: "Canada",
    region: "Int'l",
    tier: "Clinical",
    status: "On leave",
    plansAccepted: ["Essential", "Harmony", "Restore", "Family Care"],
    sessions30d: 0,
    earnings30d: { amount: 0, currency: "USD" },
    rating: 4.9,
    ratingCount: 256,
    bio: "Clinical psychologist with a focus on grief and bereavement.",
    specializations: ["Grief", "Bereavement", "Family"],
    languages: ["English", "Hindi", "Gujarati"],
    yearsOfPractice: 21,
    licenseNumber: "CA-CPO-7821",
    licenseExpiry: "2029-04-18",
    joinedAt: "2023-11-04",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2023-11-08",
  },
  {
    id: "t-006",
    name: "Dr. Femi Ojo",
    initials: "FO",
    email: "femi@mindenity.com",
    country: "Nigeria",
    region: "NG",
    tier: "Standard",
    status: "Suspended",
    plansAccepted: [],
    sessions30d: 0,
    earnings30d: { amount: 0, currency: "NGN" },
    rating: 3.8,
    ratingCount: 12,
    bio: "Couples and individual therapy.",
    specializations: ["Couples"],
    languages: ["English", "Yoruba"],
    yearsOfPractice: 3,
    licenseNumber: "NG-CLP-88341",
    licenseExpiry: "2026-07-22",
    joinedAt: "2025-02-18",
    verifiedBy: "Sarah Okeke",
    verifiedAt: "2025-02-21",
  },
];

const VERIFICATIONS: VerificationApplication[] = [
  {
    id: "v-001",
    name: "Dr. Chinwe Okoro",
    initials: "CO",
    email: "chinwe.okoro@example.com",
    phone: "+234 803 555 0142",
    country: "Nigeria",
    region: "NG",
    dob: "1988-04-21",
    timeZone: "Africa/Lagos",
    specializations: ["Anxiety", "Depression", "Workplace stress"],
    sessionFormats: ["Video", "Voice"],
    languages: ["English", "Igbo"],
    yearsOfPractice: 8,
    bio: "Counselling psychologist with 8 years supporting clients through anxiety and workplace stress. CBT-trained, certified in ACT.",
    licenseNumber: "NG-CLP-66120",
    licenseIssuer: "Nigerian Council for Psychologists",
    licenseExpiry: "2028-03-04",
    licenseFile: "license-chinwe-okoro.pdf",
    idFile: "id-chinwe-okoro.pdf",
    submittedAt: "2026-05-24T10:14:00Z",
    submittedAgo: "2d ago",
    status: "Pending",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "pass",
    },
    aiNote: "All checks clean. Ready for review.",
  },
  {
    id: "v-002",
    name: "Dr. Mateo Alvarez",
    initials: "MA",
    email: "mateo.alvarez@example.com",
    phone: "+34 612 555 0188",
    country: "Spain",
    region: "Int'l",
    dob: "1980-11-09",
    timeZone: "Europe/Madrid",
    specializations: ["Trauma", "PTSD"],
    sessionFormats: ["Video"],
    languages: ["Spanish", "English"],
    yearsOfPractice: 15,
    bio: "Clinical psychologist focused on trauma recovery. EMDR certified.",
    licenseNumber: "ES-COP-1422",
    licenseIssuer: "Consejo General de la Psicología de España",
    licenseExpiry: "2027-12-19",
    licenseFile: "license-mateo-alvarez.pdf",
    idFile: "id-mateo-alvarez.pdf",
    submittedAt: "2026-05-25T08:30:00Z",
    submittedAgo: "1d ago",
    status: "Pending",
    aiFlag: "Flagged",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "warn",
      bioQuality: "pass",
    },
    aiNote: "Possible duplicate account — similar email pattern matched 1 existing therapist. Verify.",
  },
  {
    id: "v-003",
    name: "Dr. Yui Tanaka",
    initials: "YT",
    email: "yui.tanaka@example.com",
    phone: "+81 90 5555 0124",
    country: "Japan",
    region: "Int'l",
    dob: "1990-07-15",
    timeZone: "Asia/Tokyo",
    specializations: ["Anxiety", "Couples"],
    sessionFormats: ["Video", "Chat"],
    languages: ["Japanese", "English"],
    yearsOfPractice: 6,
    bio: "Bilingual therapist with focus on cross-cultural couples and expat anxiety.",
    licenseNumber: "JP-AP-22118",
    licenseIssuer: "Japanese Association of Psychology",
    licenseExpiry: "2026-10-02",
    licenseFile: "license-yui-tanaka.pdf",
    idFile: "id-yui-tanaka.pdf",
    submittedAt: "2026-05-22T14:00:00Z",
    submittedAgo: "4d ago",
    status: "Info requested",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "warn",
    },
    aiNote: "Bio quality: short — under 80 characters. Requested longer practice description from applicant.",
  },
  {
    id: "v-004",
    name: "Dr. Kemi Adeyemi",
    initials: "KA",
    email: "kemi.a@example.com",
    phone: "+234 802 555 0167",
    country: "Nigeria",
    region: "NG",
    dob: "1985-01-30",
    timeZone: "Africa/Lagos",
    specializations: ["Grief", "Family"],
    sessionFormats: ["Video", "Voice"],
    languages: ["English", "Yoruba"],
    yearsOfPractice: 11,
    bio: "Family therapist with focus on grief and bereavement support.",
    licenseNumber: "NG-CLP-72441",
    licenseIssuer: "Nigerian Council for Psychologists",
    licenseExpiry: "2029-01-22",
    licenseFile: "license-kemi-adeyemi.pdf",
    idFile: "id-kemi-adeyemi.pdf",
    submittedAt: "2026-05-26T07:45:00Z",
    submittedAgo: "6h ago",
    status: "Pending",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "pass",
    },
    aiNote: "All checks clean.",
  },
  {
    id: "v-005",
    name: "Dr. Sven Müller",
    initials: "SM",
    email: "sven.mueller@example.com",
    phone: "+49 170 555 0119",
    country: "Germany",
    region: "Int'l",
    dob: "1975-09-22",
    timeZone: "Europe/Berlin",
    specializations: ["Trauma", "Workplace stress", "Burnout"],
    sessionFormats: ["Video"],
    languages: ["German", "English"],
    yearsOfPractice: 20,
    bio: "Clinical psychologist with 20 years in trauma-informed care and corporate wellbeing.",
    licenseNumber: "DE-BDP-88112",
    licenseIssuer: "Berufsverband Deutscher Psychologinnen und Psychologen",
    licenseExpiry: "2028-06-30",
    licenseFile: "license-sven-mueller.pdf",
    idFile: "id-sven-mueller.pdf",
    submittedAt: "2026-05-26T11:00:00Z",
    submittedAgo: "3h ago",
    status: "Pending",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "pass",
    },
    aiNote: "All checks clean.",
  },
];

function matchesQuery(haystack: string, q?: string) {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

export function getTherapists(filters: TherapistFilters = {}): Therapist[] {
  return THERAPISTS.filter((t) => {
    if (!matchesQuery(`${t.name} ${t.country} ${t.email}`, filters.q)) return false;
    if (filters.region && filters.region !== "all") {
      const target = filters.region === "ng" ? "NG" : "Int'l";
      if (t.region !== target) return false;
    }
    if (filters.tier && filters.tier !== "all") {
      const map: Record<string, Tier> = {
        standard: "Standard",
        senior: "Senior",
        clinical: "Clinical",
      };
      if (t.tier !== map[filters.tier]) return false;
    }
    if (filters.status && filters.status !== "all") {
      const target = filters.status === "active" ? "Active" : "Suspended";
      if (t.status !== target) return false;
    }
    return true;
  });
}

export function getTherapist(id: string): Therapist | undefined {
  return THERAPISTS.find((t) => t.id === id);
}

export function getVerifications(
  filters: VerificationFilters = {}
): VerificationApplication[] {
  return VERIFICATIONS.filter((v) => {
    if (!matchesQuery(`${v.name} ${v.country} ${v.email}`, filters.q)) return false;
    if (filters.region && filters.region !== "all") {
      const target = filters.region === "ng" ? "NG" : "Int'l";
      if (v.region !== target) return false;
    }
    if (filters.aiFlag && filters.aiFlag !== "all") {
      const target = filters.aiFlag === "flagged" ? "Flagged" : "Clean";
      if (v.aiFlag !== target) return false;
    }
    return true;
  });
}

export function getVerification(id: string): VerificationApplication | undefined {
  return VERIFICATIONS.find((v) => v.id === id);
}

export function getTherapistDirectoryStats() {
  return {
    activeCount: THERAPISTS.filter((t) => t.status === "Active").length,
    plansCount: 9,
    awaitingVerification: VERIFICATIONS.filter((v) => v.status === "Pending").length,
  };
}

export function getVerificationStats() {
  return {
    pending: VERIFICATIONS.filter((v) => v.status === "Pending").length,
    flagged: VERIFICATIONS.filter((v) => v.aiFlag === "Flagged").length,
  };
}
