# Typography

Source: `Design System & Components` page → `Foundations` section → `Typography` frame (nodeId `10611:36262`).

**Family:** Urbanist (single family for entire DS).
**Style count:** 73 published text styles across 5 families.
**Apply via:** `node.textStyleId = '<style id>'` (style IDs listed in [manifest.json](../manifest.json) under `textStyles`).

## Style families

### Display — for hero/marketing-scale text

| Style | Size | Line height | Letter spacing | Weights |
|-------|------|-------------|----------------|---------|
| Display lg | 180 | 188 | -5% | Bold, SemiBold, Medium |
| Display md | 128 | 136 | -4% | Bold, SemiBold, Medium |
| Display sm | 96 | 104 | -3% | Bold, SemiBold, Medium |

### Heading — for screen and section titles

| Style | Size | Line height | Letter spacing | Weights |
|-------|------|-------------|----------------|---------|
| Heading 2xl | 72 | 80 | -2% | Bold, SemiBold, Medium, Regular |
| Heading xl | 60 | 68 | -1.8% | Bold, SemiBold, Medium, Regular |
| Heading lg | 48 | 56 | -1.6% | Bold, SemiBold, Medium, Regular |
| Heading md | 36 | 44 | -1.4% | Bold, SemiBold, Medium, Regular |
| Heading sm | 30 | 38 | -1.3% | Bold, SemiBold, Medium, Regular |
| Heading xs | 24 | 32 | -1.2% | Bold, SemiBold, Medium, Regular |

### Text — for body, labels, list items (tight line-height)

| Style | Size | Line height | Letter spacing | Weights |
|-------|------|-------------|----------------|---------|
| Text 2xl | 24 | 32 | -1.2% | Bold, SemiBold, Medium, Regular |
| Text xl | 20 | 28 | -1% | Bold, SemiBold, Medium, Regular |
| Text lg | 18 | 24 | -0.8% | Bold, SemiBold, Medium, Regular |
| Text md | 16 | 22 | -0.7% | Bold, SemiBold, Medium, Regular |
| Text sm | 14 | 20 | -0.6% | Bold, SemiBold, Medium, Regular |
| Text xs | 12 | 16 | -0.5% | Bold, SemiBold, Medium, Regular |
| Text 2xs | 10 | 14 | -0.4% | Bold, SemiBold, Medium, Regular |

### Paragraph — for prose (160% line-height, regular weight only)

| Style | Size | Line height | Use |
|-------|------|-------------|-----|
| Paragraph 2xl | 24 | 160% | Long-form display copy |
| Paragraph xl | 20 | 160% | Marketing prose |
| Paragraph lg | 18 | 160% | Comfortable reading |
| Paragraph md | 16 | 160% | Default body |
| Paragraph sm | 14 | 160% | Secondary body |
| Paragraph xs | 12 | 160% | Captions, footnotes |

### Label — for tags, eyebrows, all-caps callouts (ExtraBold + UPPER + 10% tracking)

| Style | Size | Line height |
|-------|------|-------------|
| Label 2xl | 20 | 28 |
| Label xl | 18 | 24 |
| Label lg | 16 | 22 |
| Label md | 14 | 20 |
| Label sm | 12 | 16 |
| Label xs | 10 | 14 |

## Picking guide

- **Screen title:** Heading sm/SemiBold or Heading md/SemiBold.
- **Section header:** Heading xs/SemiBold or Text xl/SemiBold.
- **Body paragraph:** Paragraph md (default), Paragraph sm (dense lists).
- **Button label:** Text md/SemiBold or Text sm/SemiBold.
- **Form label:** Text sm/Medium.
- **Helper/caption:** Text xs/Regular or Paragraph xs.
- **Eyebrow / badge / tag:** Label sm or Label xs.
- **Empty-state hero text:** Display sm/SemiBold.
