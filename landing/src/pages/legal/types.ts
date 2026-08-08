export type LegalBlock =
  | { kind: "title" | "h2" | "h3" | "p" | "li"; text: string }
  | { kind: "table"; rows: string[][] };
