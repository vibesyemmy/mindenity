# Mindenity Design Tasks

Working docs that drive Figma design execution for Mindenity. Each app has its own flow doc with checkbox tracking. Work order:

1. **[Client mobile app](client-app-flow.md)** — IN PROGRESS (renamed from "patient" — per copy guidelines, user-facing term is **Client**)
2. **Therapist mobile app** — pending (will create `therapist-app-flow.md` when client app wraps)
3. **Admin desktop app** — pending (will create `admin-app-flow.md` after therapist app)

**[Copy guidelines](copy-guidelines.md)** — required reading. Every screen passes copy review against this doc before its checkbox flips to `[x]`.

## How to use these docs

Each app's flow doc is organized by user journey (signup → onboarding → core features → settings), with:
- **One checkbox per screen** for completion tracking
- **Screen purpose** and which user story it satisfies (US-XXX from `Mindenity_UserStories_v5.0`)
- **Key elements** the screen needs
- **DS components** to use (from [design-system/components.md](../design-system/components.md))
- **Source section** in the existing Figma file (Mobile template - light) to start from — duplicate the closest screen and adapt

## Source-of-truth references

- **Product spec:** Mindenity_UserStories_v5_1.md (in user's local Downloads, not in this repo)
- **Design system:** [../design-system/](../design-system/) — Palette + Semantic tokens, 183 components, 21 mobile template sections
- **Figma file:** Mindenity-DS (`fileKey: qU7OupeoYyrtlNMEKi7ao5`)
- **Bridge:** `paperclip-figma-bridge` MCP

## Status convention

- `[ ]` — not started
- `[~]` — in progress (use this freely while a screen is being designed)
- `[x]` — done (the canonical Figma frame exists, follows DS, is named, and lives on a working page — not just in the legacy "Mobile template - light" template grid)

## Scope notes

The existing `Mobile template - light` page in Figma has ~516 screen variants across 21 sections — those are exploratory/state-variant artwork. The flow docs in this folder define the **canonical production screens** to design or finalize, drawing on the existing template as starting material. Many states (loading, error, empty) live as sub-items inside their parent screen entry, not as separate checkboxes.
