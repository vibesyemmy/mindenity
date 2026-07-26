# Store badges — official assets required

The hero renders two store badges. The artwork is **not** in this repo and must
not be recreated: Apple and Google both supply official files and require them
unmodified. Drawing a lookalike, recolouring, adding a shadow or a corner radius,
or rebuilding the marks as inline SVG all breach their brand terms.

## Files this page expects

| Path | Source |
|---|---|
| `public/images/badges/app-store.svg` | Apple — "Download on the App Store" |
| `public/images/badges/google-play.png` | Google — "Get it on Google Play" |

Until both exist the hero shows a dashed placeholder instead of a broken image.

## Where to get them

**Apple** — Apple Marketing Resources / "App Store Marketing Guidelines". Choose
the black badge, download the localised SVG, use it unmodified.

**Google** — the Google Play badge generator in the Play Console brand pages.
Pick the language, download the PNG. The file ships with transparent bleed
around the artwork, which is part of the required clear space.

## Rules the CSS already enforces

- **Equal visual weight.** Both badges render at the same 48px height. Apple
  requires its badge be no smaller than any other store badge shown alongside it.
- **Minimum size.** 48px height clears Apple's 40px floor; the resulting Google
  Play width clears its 60px floor.
- **Clear space.** At least 1/4 of badge height on all sides — the 14px row gap
  plus surrounding margin.
- **No modification.** No `filter`, `box-shadow`, `border-radius` or recolour is
  applied to the badge images.

## Still needed

The `href`s in `src/sections/Hero.tsx` are placeholders (`#`). Replace with the
real listings once the apps are published:

- iOS: `https://apps.apple.com/app/id<APP_ID>`
- Android: `https://play.google.com/store/apps/details?id=<PACKAGE_NAME>`

If the apps are not published yet, consider a waitlist CTA instead of dead
badges — a badge that links nowhere is worse than no badge.
