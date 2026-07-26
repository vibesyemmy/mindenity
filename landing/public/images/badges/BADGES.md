# Store badges

The hero renders two store badges. Live files:

| Path | Natural size | Rendered |
|---|---|---|
| `public/app-store-apple.png` | 672×227 (2.96:1) | 142×48 |
| `public/google-play-button.png` | 704×227 (3.10:1) | 149×48 |

Both carry a real alpha channel and are cropped tight to the artwork, so
`height: 48px; width: auto` gives each its correct width.

## Rules the CSS enforces

- **Equal visual weight** — both at 48px height. Apple requires its badge be no
  smaller than any store badge shown beside it.
- **Minimum size** — 48px height clears Apple's 40px floor; the resulting Google
  Play width (149px) clears its 60px floor.
- **Clear space** — 14px row gap, above the 1/4-badge-height minimum.
- **No modification** — verified in-browser: `filter: none`, `border-radius: 0px`,
  `box-shadow: none`. The rounded corners come from the artwork itself.

## ⚠️ Outstanding: the Apple badge is the retired version

`app-store-apple.png` reads **"Available on the App Store"**. Apple retired that
wording; the current badge reads **"Download on the App Store"**. Both files also
appear to be third-party/clipart derivatives rather than vendor originals — the
supplied versions arrived with a checkerboard flattened into the pixels, which no
official download has.

Apple's marketing guidelines require the current badge, obtained from Apple.
Before this site goes live, replace both with official downloads:

- **Apple** — Apple Marketing Resources → App Store badge → black, correct locale, SVG
- **Google** — Play Console brand pages → badge generator → correct language, PNG

Swapping them is a two-line change in `src/sections/Hero.tsx`; the CSS needs no
edit, and SVG is preferable to PNG for crispness at any density.

## ⚠️ Outstanding: the links go nowhere

`href` is `#` on both. Apple's and Google's terms require the badge to link to the
real listing:

- iOS — `https://apps.apple.com/app/id<APP_ID>`
- Android — `https://play.google.com/store/apps/details?id=<PACKAGE_NAME>`

If the apps are not published yet, use a waitlist CTA instead. A badge that links
nowhere breaches the guidelines and frustrates visitors.

## Missing-asset behaviour

`StoreBadge` in `Hero.tsx` falls back to a dashed placeholder carrying the badge
wording if an image fails to load, so a bad path never leaves a broken-image glyph
in the hero.
