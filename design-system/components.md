# Components

183 components across 24 categories. All published from `Design System & Components` page → `Components` section (nodeId `12533:146136`).

## How to read this catalog

- **kind**: `SET` = component set with variants. `SINGLE` = standalone component.
- **variants**: count of variant combinations in the set.
- **props**: each row is `name (type)`. `VARIANT` props are the set's selectable variants (Size, State, Color, etc). `BOOLEAN/TEXT/INSTANCE_SWAP` props are slot/content controls.
- **nodeId**: cached at scan time. **Always re-resolve** via `figma_search_components` before instancing — the file may have changed.

## Quick instancing pattern

```javascript
// inside figma_execute
await figma.loadAllPagesAsync();
const comp = await figma.getNodeByIdAsync('<componentId or defaultVariant id>');
const instance = comp.createInstance();
parent.appendChild(instance);
instance.setProperties({ 'Size': 'md', 'State': 'default', 'Text#1234:5': 'Click me' });
```

For sets, look up a specific variant via `comp.defaultVariant` or by walking `comp.children`.

---

## Category index

- [Alert & Notification](#alert-notification) — 1 component
- [Accordion](#accordion) — 1 component
- [Badge/Tag](#badge-tag) — 2 components
- [Button](#button) — 5 components
- [Breadcrumb](#breadcrumb) — 5 components
- [Chat System](#chat-system) — 9 components
- [Line Chart](#line-chart) — 9 components
- [Date Picker](#date-picker) — 5 components
- [Dialog/Modal](#dialog-modal) — 1 component
- [Dropdown](#dropdown) — 4 components
- [File Upload](#file-upload) — 2 components
- [Form Controls](#form-controls) — 9 components
- [Input](#input) — 7 components
- [Loader](#loader) — 1 component
- [Misc & Helper](#misc-helper) — 17 components
- [Pagination](#pagination) — 2 components
- [Progress & Indicator](#progress-indicator) — 2 components
- [Slider](#slider) — 4 components
- [Step](#step) — 6 components
- [Table](#table) — 2 components
- [Tab](#tab) — 4 components
- [Tooltip](#tooltip) — 1 component
- [Navigations](#navigations) — 3 components
- [Mobile App Components](#mobile-app-components) — 81 components

---

## Alert & Notification

### Notifications

- **kind:** SET
- **nodeId:** `5585:4615`
- **variants:** 20
- **props:**
  - `Title#5585:79` (TEXT)
  - `Is Supporting Text#5585:80` (BOOLEAN)
  - `Is Action Button#5585:81` (BOOLEAN)
  - `Is Close#5585:82` (BOOLEAN)
  - `Supporting Text#5585:83` (TEXT)
  - `Icon#5585:89` (INSTANCE_SWAP)
  - `Color` (VARIANT) — options: `Brand`, `Gray`, `Destructive`, `Warning`, `Success`
  - `Hierarchy` (VARIANT) — options: `Secondary`, `Primary`
  - `Is Mobile` (VARIANT) — options: `False`, `True`


## Accordion

### Accordions

- **kind:** SET
- **nodeId:** `1427:28018`
- **variants:** 16
- **props:**
  - `Title#5586:95` (TEXT)
  - `Is Start Icon#5586:97` (BOOLEAN)
  - `Is End Icon#5586:99` (BOOLEAN)
  - `End Icon#5586:101` (INSTANCE_SWAP)
  - `Start Icon#5586:103` (INSTANCE_SWAP)
  - `Is Badge#5586:105` (BOOLEAN)
  - `Content Text#5586:107` (TEXT)
  - `Is CTA Button#5586:110` (BOOLEAN)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`, `Disabled`
  - `Breakpoint` (VARIANT) — options: `Desktop`, `Mobile`
  - `Is Opened` (VARIANT) — options: `True`, `False`


## Badge/Tag

### Badge Text

- **kind:** SET
- **nodeId:** `5489:8967`
- **variants:** 135
- **props:**
  - `Is Dot#5586:119` (BOOLEAN)
  - `Is Icon Right#5586:121` (BOOLEAN)
  - `Is Icon Left#5586:123` (BOOLEAN)
  - `Icon Right#5586:125` (INSTANCE_SWAP)
  - `Icon Left#5586:127` (INSTANCE_SWAP)
  - `Text#5588:129` (TEXT)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Color` (VARIANT) — options: `Gray`, `Brand`, `Destructive`, `Warning`, `Success`
  - `Hierarchy` (VARIANT) — options: `Primary`, `Secondary`, `Outlined`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Disabled`

### Badge Icon

- **kind:** SET
- **nodeId:** `5494:245`
- **variants:** 270
- **props:**
  - `Icon#6200:0` (INSTANCE_SWAP)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Type` (VARIANT) — options: `Text`, `Icon`
  - `Hierarchy` (VARIANT) — options: `Primary`, `Secondary`, `Outlined`
  - `Color` (VARIANT) — options: `Brand`, `Gray`, `Destructive`, `Warning`, `Success`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Disabled`


## Button

### Button

- **kind:** SET
- **nodeId:** `1198:38881`
- **variants:** 320
- **props:**
  - `Is Icon Right#5588:131` (BOOLEAN)
  - `Is Icon Left#5588:152` (BOOLEAN)
  - `Text#5588:173` (TEXT)
  - `Icon Right#5588:175` (INSTANCE_SWAP)
  - `Icon Left#5588:177` (INSTANCE_SWAP)
  - `Size` (VARIANT) — options: `xs`, `sm`, `md`, `lg`, `xl`
  - `Color` (VARIANT) — options: `Brand`, `Gray`, `Success`, `Destructive`
  - `Hierarchy` (VARIANT) — options: `Primary`, `Secondary`, `Outlined`, `Link`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`, `Disabled`

### Button Group

- **kind:** SET
- **nodeId:** `5520:28145`
- **variants:** 216
- **props:**
  - `Is Icon Right#5592:470` (BOOLEAN)
  - `Is Icon Left#5592:474` (BOOLEAN)
  - `Text#5592:478` (TEXT)
  - `Icon Left#5592:482` (INSTANCE_SWAP)
  - `Icon Right#5592:486` (INSTANCE_SWAP)
  - `Is Text#5592:490` (BOOLEAN)
  - `Size` (VARIANT) — options: `lg`, `md`, `sm`
  - `Position` (VARIANT) — options: `First`, `Middle`, `Last`
  - `Hierarchy` (VARIANT) — options: `Primary`, `Secondary`, `Outlined`
  - `Color` (VARIANT) — options: `Brand`, `Gray`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`, `Disabled`

### Button Icon

- **kind:** SET
- **nodeId:** `1202:41410`
- **variants:** 576
- **props:**
  - `Icon#5590:373` (INSTANCE_SWAP)
  - `Hierarchy` (VARIANT) — options: `Primary`, `Secondary`, `Outlined`, `No Fill`
  - `Size` (VARIANT) — options: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
  - `Color` (VARIANT) — options: `Black`, `White`, `Brand`, `Destructive`, `Warning`, `Success`
  - `State` (VARIANT) — options: `Default`, `Focused`, `Hover`, `Disabled`

### Button Social Media

- **kind:** SET
- **nodeId:** `5517:26163`
- **variants:** 108
- **props:**
  - `State` (VARIANT) — options: `Default`, `Focused`, `Hover`
  - `Hierarchy` (VARIANT) — options: `Secondary`, `Primary`, `Outlined`
  - `Company` (VARIANT) — options: `Facebook`, `X (Twitter)`, `LinkedIn`, `Google`, `GitHub`, `Figma`
  - `Type` (VARIANT) — options: `Icon + Text`, `Icon Only`

### Button App Store

- **kind:** SET
- **nodeId:** `5517:27600`
- **variants:** 12
- **props:**
  - `Store` (VARIANT) — options: `Google Play`, `App Store`
  - `Style` (VARIANT) — options: `Brand`, `Black outline`, `White outline`
  - `Size` (VARIANT) — options: `md`, `lg`


## Breadcrumb

### _PaginationBase

- **kind:** SET
- **nodeId:** `5554:43259`
- **variants:** 84
- **props:**
  - `State` (VARIANT) — options: `Default`, `Hover`, `Active`, `Disabled`
  - `Size` (VARIANT) — options: `md`
  - `Type` (VARIANT) — options: `Number`, `Previous Icon`, `Next Icon`, `Previous Icon + Label`, `Next Icon + Label`, `Text`, `Dots`
  - `Style` (VARIANT) — options: `No Fill`, `Fill`, `Outlined`

### _PaginationDotBase

- **kind:** SET
- **nodeId:** `5614:7254`
- **variants:** 9
- **props:**
  - `State` (VARIANT) — options: `Active`, `Default`, `Hover`
  - `Size` (VARIANT) — options: `lg`, `md`, `sm`

### Breadcrumb Indicator

- **kind:** SET
- **nodeId:** `5522:33736`
- **variants:** 3
- **props:**
  - `Icon#5594:15` (INSTANCE_SWAP)
  - `Divider Type` (VARIANT) — options: `Slash`, `Icon`, `Colon`

### Breadcrumb Link Item

- **kind:** SET
- **nodeId:** `5523:33776`
- **variants:** 12
- **props:**
  - `Is Icon#5594:0` (BOOLEAN)
  - `Icon#5594:5` (INSTANCE_SWAP)
  - `Text#5594:7` (TEXT)
  - `Is Text#5594:11` (BOOLEAN)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Active`, `Disabled`
  - `Fill` (VARIANT) — options: `None`, `Subtle`, `Outlined`

### Breadcrumb Link Group

- **kind:** SET
- **nodeId:** `5594:10959`
- **variants:** 18
- **props:**
  - `Style` (VARIANT) — options: `Default`, `Fill`, `Outlined`
  - `Is Boxed` (VARIANT) — options: `False`, `True`
  - `Divider` (VARIANT) — options: `Icon`, `Slash`, `Colon`


## Chat System

### Chat Bubble

- **kind:** SET
- **nodeId:** `5526:2731`
- **variants:** 20
- **props:**
  - `Is Avatar#6947:0` (BOOLEAN)
  - `Type` (VARIANT) — options: `Recipient`, `Sender`
  - `Message` (VARIANT) — options: `Text Hug`, `Text Fill`, `Reply`, `Image/Video`, `File Upload`, `Link Text`, `Link Image`, `Typing`, `Recording`, `Custom Widget`

### Chat Time Indicator

- **kind:** SET
- **nodeId:** `10447:13019`
- **variants:** 2
- **props:**
  - `Is Right Line#10447:0` (BOOLEAN)
  - `Is Left Line#10447:1` (BOOLEAN)
  - `Main Text#10447:2` (TEXT)
  - `Is Mobile` (VARIANT) — options: `False`, `True`

### AI Companion Text

- **kind:** SINGLE
- **nodeId:** `10453:14433`
- **props:**
  - `Main Text#10459:0` (TEXT)
  - `Supporting Text#20404:0` (TEXT)
  - `Is Supporting Text#20404:1` (BOOLEAN)

### Chat Bottom Input

- **kind:** SINGLE
- **nodeId:** `10447:13390`

### Chat Status

- **kind:** SET
- **nodeId:** `5526:2722`
- **variants:** 2
- **props:**
  - `Status` (VARIANT) — options: `Sent`, `Failed`

### Chat Reaction

- **kind:** SET
- **nodeId:** `5533:4472`
- **variants:** 6
- **props:**
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Is Text` (VARIANT) — options: `False`, `True`

### Chat Top Nav

- **kind:** SET
- **nodeId:** `10522:18731`
- **variants:** 2
- **props:**
  - `Is Button Icon 1#10522:0` (BOOLEAN)
  - `Is Button Icon 3#10522:1` (BOOLEAN)
  - `Name#10522:2` (TEXT)
  - `Is Button Icon 2#10522:3` (BOOLEAN)
  - `Caption#10522:4` (TEXT)
  - `Is Mobile` (VARIANT) — options: `False`, `True`

### Chat Item

- **kind:** SET
- **nodeId:** `5995:2981`
- **variants:** 6
- **props:**
  - `Is Badge#5995:4` (BOOLEAN)
  - `Time#5995:5` (TEXT)
  - `Chat Text#5995:6` (TEXT)
  - `Name#5995:7` (TEXT)
  - `Is Time#6927:0` (BOOLEAN)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Active`
  - `Avatar Type` (VARIANT) — options: `Person`, `Logo`

### Custom Chat Widget

- **kind:** SET
- **nodeId:** `10448:13180`
- **variants:** 25
- **props:**
  - `Type` (VARIANT) — options: `Input Text`, `Resources`, `Calendar`, `Hydration`, `Sleep`, `Mindful Exercise`, `Health Score`, `Article`, `Categories`, `Possible Condition`, `Nearest Clinic`, `Blood Pressure`, …(+13)


## Line Chart

### _XAxisLabel

- **kind:** SINGLE
- **nodeId:** `10393:10208`

### _YAxisLabel

- **kind:** SINGLE
- **nodeId:** `10393:10211`

### _XAxis

- **kind:** SET
- **nodeId:** `5535:5324`
- **variants:** 3
- **props:**
  - `Data` (VARIANT) — options: `12 Point`, `30 Point`, `7 Point`

### _AxisLine

- **kind:** SET
- **nodeId:** `5535:5423`
- **variants:** 4
- **props:**
  - `Is Label` (VARIANT) — options: `False`, `True`
  - `Type` (VARIANT) — options: `Horizontal`, `Vertical`

### _Axis

- **kind:** SET
- **nodeId:** `5535:5577`
- **variants:** 4
- **props:**
  - `Is Label` (VARIANT) — options: `True`, `False`
  - `Type` (VARIANT) — options: `Vertical`, `Horizontal`

### Line Chart

- **kind:** SET
- **nodeId:** `5600:12591`
- **variants:** 6
- **props:**
  - `Type` (VARIANT) — options: `Curve`, `Sharp`, `Square`
  - `Series` (VARIANT) — options: `1`, `2`

### Line Chart Mini

- **kind:** SET
- **nodeId:** `6222:35794`
- **variants:** 9
- **props:**
  - `Trend` (VARIANT) — options: `Positive`, `Negative`, `Neutral`
  - `Type` (VARIANT) — options: `Curve`, `Realistic`, `Sharp`

### Bar Chart

- **kind:** SET
- **nodeId:** `5536:5592`
- **variants:** 9
- **props:**
  - `Series` (VARIANT) — options: `1`, `2`, `3`
  - `Thickness` (VARIANT) — options: `lg`, `md`, `sm`

### Progress Chart

- **kind:** SET
- **nodeId:** `10393:10629`
- **variants:** 16
- **props:**
  - `Is Label#20448:13` (BOOLEAN)
  - `Size` (VARIANT) — options: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
  - `Shape` (VARIANT) — options: `Circle`, `Half circle`
  - `Label` (VARIANT) — options: `False`


## Date Picker

### _CalendarHeader

- **kind:** SET
- **nodeId:** `5625:18091`
- **variants:** 3
- **props:**
  - `Type` (VARIANT) — options: `1`, `2`, `3`

### _CalendarDateCell

- **kind:** SET
- **nodeId:** `5625:18112`
- **variants:** 14
- **props:**
  - `Is Event#5538:0` (BOOLEAN)
  - `Main Text#5624:482` (TEXT)
  - `Is Range Start#5624:488` (BOOLEAN)
  - `Is Range End#5624:494` (BOOLEAN)
  - `Type` (VARIANT) — options: `Default`, `Today`, `Disabled`, `Active Single`, `Active Range`, `Selected Single`, `Selected Range`
  - `Size` (VARIANT) — options: `md`, `lg`

### _CalendarLabel

- **kind:** SET
- **nodeId:** `5625:18137`
- **variants:** 6
- **props:**
  - `Is Selected` (VARIANT) — options: `False`, `True`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`

### Date Picker Alt

- **kind:** SINGLE
- **nodeId:** `10508:18353`

### Date Picker

- **kind:** SET
- **nodeId:** `5624:14056`
- **variants:** 4
- **props:**
  - `Type` (VARIANT) — options: `Single`, `Range`, `Double`
  - `Variant` (VARIANT) — options: `Single`, `Double`


## Dialog/Modal

### Modal

- **kind:** SET
- **nodeId:** `5537:8701`
- **variants:** 10
- **props:**
  - `Title#5601:19` (TEXT)
  - `Supporting Text#5601:21` (TEXT)
  - `Is Close Icon#5601:23` (BOOLEAN)
  - `Is Main Icon#5601:25` (BOOLEAN)
  - `Is Primary Button#5601:27` (BOOLEAN)
  - `Is Secondary Button#5601:29` (BOOLEAN)
  - `Type` (VARIANT) — options: `Checklist`, `Default`, `Dropdown`, `Input Form`, `Image`
  - `Size` (VARIANT) — options: `md`
  - `Breakpoint` (VARIANT) — options: `Desktop`, `Mobile`


## Dropdown

### _DropdownAccountHeader

- **kind:** SET
- **nodeId:** `5545:982`
- **variants:** 1
- **props:**
  - `Is Avatar#5626:615` (BOOLEAN)
  - `Is Supporting Text#5626:617` (BOOLEAN)
  - `Main Text#5626:619` (TEXT)
  - `Supporting Text#5626:621` (TEXT)
  - `Type` (VARIANT) — options: `Avatar`

### _DropdownListItem

- **kind:** SET
- **nodeId:** `5543:174`
- **variants:** 20
- **props:**
  - `Main Text#5626:509` (TEXT)
  - `Is Icon#5626:511` (BOOLEAN)
  - `Icon#5626:513` (INSTANCE_SWAP)
  - `Avatar Username Text#5626:515` (TEXT)
  - `Is Right Text#5626:518` (BOOLEAN)
  - `Right Text#5626:522` (TEXT)
  - `Status Right Text#5626:526` (TEXT)
  - `Country Right Text#5626:531` (TEXT)
  - `Is Search Right Icon#5626:536` (BOOLEAN)
  - `Search Right Icon#6131:21` (INSTANCE_SWAP)
  - `Type` (VARIANT) — options: `Default`, `Avatar`, `Dot`, `Country`, `Search`
  - `Is Checkbox` (VARIANT) — options: `False`, `True`
  - `State` (VARIANT) — options: `Default`, `Hover`

### Dropdown Input

- **kind:** SET
- **nodeId:** `5626:22148`
- **variants:** 30
- **props:**
  - `Is Label#5626:548` (BOOLEAN)
  - `Label Text#5626:553` (TEXT)
  - `Is Scroll Bar#5626:558` (BOOLEAN)
  - `Is Search#5626:599` (BOOLEAN)
  - `State` (VARIANT) — options: `Default`, `Opened`, `Hover`
  - `Type` (VARIANT) — options: `Text Only`, `Text + Icon`, `Avatar`, `Dot`, `Country`
  - `Is Checkbox` (VARIANT) — options: `False`, `True`

### Dropdown Account

- **kind:** SET
- **nodeId:** `5626:30096`
- **variants:** 12
- **props:**
  - `Type` (VARIANT) — options: `Avatar`, `Button`, `Button Icon`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Opened`, `Disabled`


## File Upload

### File Upload Dropzone

- **kind:** SET
- **nodeId:** `5546:3788`
- **variants:** 16
- **props:**
  - `Is Supporting Text#6002:169` (BOOLEAN)
  - `Supporting Text#6002:178` (TEXT)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Disabled`, `Focused`
  - `Type` (VARIANT) — options: `Flexible`, `Button`
  - `Is Mobile` (VARIANT) — options: `False`, `True`

### File Upload Status

- **kind:** SET
- **nodeId:** `5743:43534`
- **variants:** 3
- **props:**
  - `Type` (VARIANT) — options: `Uploading`, `Success`, `Destructive`


## Form Controls

### _FormControlCheck

- **kind:** SINGLE
- **nodeId:** `5546:8580`

### _FormControlPlus

- **kind:** SINGLE
- **nodeId:** `5546:8575`

### _FormControlMinus

- **kind:** SINGLE
- **nodeId:** `5546:8576`

### Checkbox Only

- **kind:** SET
- **nodeId:** `1267:11519`
- **variants:** 36
- **props:**
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `State` (VARIANT) — options: `Defaut`, `Hover`, `Disabled`, `Focused`
  - `Is Indeterminate` (VARIANT) — options: `False`, `True`
  - `Is Checked` (VARIANT) — options: `False`, `True`

### Checkbox + Text

- **kind:** SET
- **nodeId:** `1267:11599`
- **variants:** 72
- **props:**
  - `Supporting Text#5609:266` (TEXT)
  - `Main Text#5622:311` (TEXT)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Is Checked` (VARIANT) — options: `False`, `True`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focus`, `Disabled`
  - `Is Indeterminate` (VARIANT) — options: `False`, `True`
  - `Is Supporting Text` (VARIANT) — options: `False`, `True`

### Radio Only

- **kind:** SET
- **nodeId:** `1267:11567`
- **variants:** 24
- **props:**
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`, `Disabled`
  - `Is Checked` (VARIANT) — options: `False`, `True`

### Radio + Text

- **kind:** SET
- **nodeId:** `1267:11683`
- **variants:** 48
- **props:**
  - `Main Text#5622:384` (TEXT)
  - `Supporting Text#5622:433` (TEXT)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Is Checked` (VARIANT) — options: `False`, `True`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`, `Disabled`
  - `Is Description` (VARIANT) — options: `False`, `True`

### Toggle Only

- **kind:** SET
- **nodeId:** `5550:11435`
- **variants:** 48
- **props:**
  - `Is Active` (VARIANT) — options: `False`, `True`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focus`, `Disabled`
  - `Is Icon` (VARIANT) — options: `False`, `True`

### Toggle + Text

- **kind:** SET
- **nodeId:** `5550:13005`
- **variants:** 72
- **props:**
  - `Main Text#5610:339` (TEXT)
  - `Supporting Text#5612:0` (TEXT)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `State` (VARIANT) — options: `Default`, `Hover`, `Focused`, `Disabled`
  - `Is Active` (VARIANT) — options: `True`, `False`
  - `Is Icon` (VARIANT) — options: `False`, `True`
  - `Is Supporting Text` (VARIANT) — options: `False`, `True`


## Input

### _InputTextBase

- **kind:** SET
- **nodeId:** `5606:19150`
- **variants:** 20
- **props:**
  - `Left Icon#5606:40` (INSTANCE_SWAP)
  - `Is Right Icon#5606:41` (BOOLEAN)
  - `Placeholder Text#5606:42` (TEXT)
  - `Is Left Icon#5606:43` (BOOLEAN)
  - `Right Icon#5606:44` (INSTANCE_SWAP)
  - `Currency Amount Text#5606:54` (TEXT)
  - `Currency Icon#5607:58` (INSTANCE_SWAP)
  - `Currency Type Text#5607:66` (TEXT)
  - `Credit Card Text#5607:70` (TEXT)
  - `Date Text#5607:75` (TEXT)
  - `Link Text#5607:81` (TEXT)
  - `Password Text#5607:88` (TEXT)
  - `Phone Number Text#5607:96` (TEXT)
  - `Phone Prefix Text#5607:105` (TEXT)
  - `Number Text#5609:157` (TEXT)
  - `Is Phone Prefix Text#5978:0` (BOOLEAN)
  - `Country Suffix Text#10442:0` (TEXT)
  - `Is Country Suffix#10442:21` (BOOLEAN)
  - `Type` (VARIANT) — options: `Default`, `Action`, `Currency`, `Credit Card`, `Date`, `Link`, `Password`, `Phone Number`, `Number`, `Country`
  - `Size` (VARIANT) — options: `md`, `lg`

### _InputPasscodeBase

- **kind:** SET
- **nodeId:** `10365:15700`
- **variants:** 12
- **props:**
  - `State` (VARIANT) — options: `Placeholder`, `Filled`, `Active`, `Disabled`
  - `Size` (VARIANT) — options: `lg`, `md`, `sm`

### Input Text

- **kind:** SET
- **nodeId:** `5607:19608`
- **variants:** 120
- **props:**
  - `Is Label#5607:114` (BOOLEAN)
  - `Is Helper Text#5607:117` (BOOLEAN)
  - `Label Text#5607:120` (TEXT)
  - `Helper Text#5607:123` (TEXT)
  - `Validation Text#5612:49` (TEXT)
  - `Is Validation Text#5612:104` (BOOLEAN)
  - `Is Validation Progress Bar#5612:159` (BOOLEAN)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Filled`, `Focused`, `Disabled`, `Error`
  - `Type` (VARIANT) — options: `Default`, `Action`, `Currency`, `Credit Card`, `Date`, `Link`, `Password`, `Phone Number`, `Country`, `Number`
  - `Size` (VARIANT) — options: `lg`, `md`

### Input Textarea

- **kind:** SET
- **nodeId:** `1259:41182`
- **variants:** 6
- **props:**
  - `Is Helper Text#5552:156` (BOOLEAN)
  - `Is Label#5552:160` (BOOLEAN)
  - `Label Text#5609:167` (TEXT)
  - `Helper Text#5609:169` (TEXT)
  - `Main Text#5609:171` (TEXT)
  - `Is Counter#5609:173` (BOOLEAN)
  - `Counter Text#5609:175` (TEXT)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Filled`, `Focus`, `Disabled`, `Error`

### Input Passcode

- **kind:** SET
- **nodeId:** `10365:15369`
- **variants:** 6
- **props:**
  - `Is Label#5609:177` (BOOLEAN)
  - `Is Helper Text#5609:181` (BOOLEAN)
  - `Label Text#5609:185` (TEXT)
  - `Helper Text#5609:189` (TEXT)
  - `Digits` (VARIANT) — options: `4`, `6`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`

### Input Text Jumbo

- **kind:** SET
- **nodeId:** `10547:35447`
- **variants:** 3
- **props:**
  - `Is Right Icon#10547:9` (BOOLEAN)
  - `Is Left Icon#10547:10` (BOOLEAN)
  - `Right Icon#10547:11` (INSTANCE_SWAP)
  - `Left Icon#10547:12` (INSTANCE_SWAP)
  - `State` (VARIANT) — options: `Default`, `Active`, `Destructive`

### Input Text Scroller

- **kind:** SET
- **nodeId:** `10395:4966`
- **variants:** 18
- **props:**
  - `Text#10395:1` (TEXT)
  - `Is Selected` (VARIANT) — options: `False`, `True`
  - `Input Count` (VARIANT) — options: `Single`, `Double`, `Triple`
  - `Size` (VARIANT) — options: `md`, `lg`, `xl`


## Loader

### Loader Base

- **kind:** SET
- **nodeId:** `1262:9015`
- **variants:** 36
- **props:**
  - `Is Label#5551:24` (BOOLEAN)
  - `Label Description#5551:73` (TEXT)
  - `Size` (VARIANT) — options: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
  - `Type` (VARIANT) — options: `Circle Single`, `Circle Multi`, `Spinner Thick`, `Spinner Thin`, `Spinner Dot`, `Box`


## Misc & Helper

### _DesignSystemItemTitle

- **kind:** SINGLE
- **nodeId:** `5438:7988`
- **props:**
  - `Title#5571:168` (TEXT)
  - `Supporting Text#5571:169` (TEXT)
  - `Is Supporting Text#5572:170` (BOOLEAN)

### _DesignSystemHeader

- **kind:** SINGLE
- **nodeId:** `523:13274`
- **props:**
  - `Supporting Text#5570:162` (TEXT)
  - `Title#5570:163` (TEXT)
  - `Is Foundations#5753:0` (BOOLEAN)
  - `Is Components#5753:1` (BOOLEAN)
  - `Text 1#5753:2` (TEXT)
  - `Text 2#5753:3` (TEXT)
  - `Is Supporting Text#10611:0` (BOOLEAN)

### _DesignSystemFooter

- **kind:** SINGLE
- **nodeId:** `5433:3664`

### Divider

- **kind:** SINGLE
- **nodeId:** `5433:13190`

### Key Combinations

- **kind:** SET
- **nodeId:** `5568:16654`
- **variants:** 4
- **props:**
  - `Keys` (VARIANT) — options: `1`, `2`, `3`, `4`

### Key Single

- **kind:** SET
- **nodeId:** `5568:16583`
- **variants:** 15
- **props:**
  - `Key` (VARIANT) — options: `⌘ Command`, `⌥ Option`, `˄ Control`, `⇧ Shift`, `⌫ Delete`, `⏎ Return`, `␣ Space`, `⎋ Escape`, `⇥ Tab`, `Arrow: Left`, `Arrow: Right`, `Arrow: Up`, …(+3)

### Key

- **kind:** SINGLE
- **nodeId:** `5568:16912`

### Rating

- **kind:** SET
- **nodeId:** `5566:1821`
- **variants:** 99
- **props:**
  - `Star` (VARIANT) — options: `5`, `4.5`, `4`, `3.5`, `3`, `2.5`, `2`, `1.5`, `1`, `0.5`, `0`
  - `Size` (VARIANT) — options: `md`, `sm`, `xs`
  - `Color` (VARIANT) — options: `Default`, `Black`, `White`

### Checklist Item

- **kind:** SET
- **nodeId:** `5641:3110`
- **variants:** 36
- **props:**
  - `Size` (VARIANT) — options: `xs`, `sm`, `md`, `lg`
  - `Hierarchy` (VARIANT) — options: `Outlined`, `Secondary`, `Primary`
  - `Color` (VARIANT) — options: `Success`, `Gray`, `Brand`

### _Dot

- **kind:** SET
- **nodeId:** `5489:8980`
- **variants:** 9
- **props:**
  - `Size` (VARIANT) — options: `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

### Checklist Item Text

- **kind:** SET
- **nodeId:** `5641:3310`
- **variants:** 27
- **props:**
  - `Checklist Text#5641:0` (TEXT)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Color` (VARIANT) — options: `Default`, `Brand`, `Success`
  - `Hierarchy` (VARIANT) — options: `Primary`, `Secondary`, `Outlined`

### iPhone X (or newer)

- **kind:** SET
- **nodeId:** `1273:17020`
- **variants:** 2
- **props:**
  - `Is Black` (VARIANT) — options: `False`, `True`

### Home Indicator

- **kind:** SET
- **nodeId:** `1273:17051`
- **variants:** 2
- **props:**
  - `Is Black` (VARIANT) — options: `False`, `True`

### Bottom Popup Drawer

- **kind:** SET
- **nodeId:** `1273:17056`
- **variants:** 2
- **props:**
  - `Is Dark Mode` (VARIANT) — options: `False`, `True`

### Keyboard

- **kind:** SET
- **nodeId:** `1273:16768`
- **variants:** 8
- **props:**
  - `Is Black` (VARIANT) — options: `True`, `False`
  - `Type` (VARIANT) — options: `Default`, `Dictation`, `Emoji`, `Numeric`

### Cursor

- **kind:** SET
- **nodeId:** `5568:16398`
- **variants:** 39
- **props:**
  - `Type` (VARIANT) — options: `General`, `Link & Status`, `Drag n Drop`, `Resizing & Scroll`, `Selection`, `Zoom`, `Screenshot`
  - `State or Style` (VARIANT) — options: `Pointer 👆`, `Progress ⌛️`, `Help ？`, `Context menu 🗂`, `Default`, `Not-allowed 🚫`, `Copy ➕`, `Poof ❌`, `Input |`, `Grab 🖐`, `Grabbing ✊`, `Alias ⤤`, …(+27)

### _PagePlaceholder

- **kind:** SINGLE
- **nodeId:** `5572:139947`


## Pagination

### Pagination

- **kind:** SET
- **nodeId:** `5614:7522`
- **variants:** 18
- **props:**
  - `Type` (VARIANT) — options: `Default`, `Minimal`, `Space Between`
  - `Style` (VARIANT) — options: `No Fill`, `Fill`, `Outlined`
  - `Is Mobile` (VARIANT) — options: `False`, `True`

### Pagination Dot

- **kind:** SET
- **nodeId:** `5614:7414`
- **variants:** 6
- **props:**
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Is Button` (VARIANT) — options: `True`, `False`


## Progress & Indicator

### _ProgressBarAtom

- **kind:** SET
- **nodeId:** `1264:9818`
- **variants:** 9
- **props:**
  - `Size` (VARIANT) — options: `lg`, `md`, `sm`
  - `Style` (VARIANT) — options: `Fill`, `Outlined`, `Subtle`

### Progress Bar

- **kind:** SET
- **nodeId:** `1264:9860`
- **variants:** 99
- **props:**
  - `Progression` (VARIANT) — options: `0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `100`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Label` (VARIANT) — options: `Bottom`, `None`, `Right`


## Slider

### _InputSliderDot

- **kind:** SET
- **nodeId:** `10390:3565`
- **variants:** 2
- **props:**
  - `Is Bottom Label` (VARIANT) — options: `True`, `False`

### _InputSliderRange

- **kind:** SET
- **nodeId:** `10406:14652`
- **variants:** 2
- **props:**
  - `Is Bottom Label` (VARIANT) — options: `True`, `False`

### Slider Single

- **kind:** SET
- **nodeId:** `5556:45482`
- **variants:** 9
- **props:**
  - `Is Label#5626:656` (BOOLEAN)
  - `Label Text#5626:666` (TEXT)
  - `Is Icon#5626:676` (BOOLEAN)
  - `Icon#5626:686` (INSTANCE_SWAP)
  - `Progression` (VARIANT) — options: `Start`, `Middle`, `End`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`

### Slider Range

- **kind:** SET
- **nodeId:** `5556:45409`
- **variants:** 8
- **props:**
  - `Range` (VARIANT) — options: `Start`, `Center`, `End`, `Full`
  - `Is Bottom Label` (VARIANT) — options: `False`, `True`
  - `Size` (VARIANT) — options: `Default`


## Step

### _StepBaseItem

- **kind:** SET
- **nodeId:** `1264:10440`
- **variants:** 45
- **props:**
  - `Status` (VARIANT) — options: `Incomplete`, `Active`, `Completed`, `Destructive`, `Disabled`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Type` (VARIANT) — options: `Icon`, `Dot`, `Text`

### _StepBaseText

- **kind:** SET
- **nodeId:** `5558:49843`
- **variants:** 3
- **props:**
  - `Is Supporting Text#5627:696` (BOOLEAN)
  - `Step Title#5627:700` (TEXT)
  - `Supporting Text#5627:704` (TEXT)
  - `Is Date Text#12414:19` (BOOLEAN)
  - `Date Text#12414:23` (TEXT)
  - `Size` (VARIANT) — options: `lg`, `md`, `sm`

### Step Item Vertical

- **kind:** SET
- **nodeId:** `5558:49969`
- **variants:** 45
- **props:**
  - `Is Line Before#5558:189` (BOOLEAN)
  - `Is Line After#5558:195` (BOOLEAN)
  - `Status` (VARIANT) — options: `Incomplete`, `Active`, `Destructive`, `Disabled`, `Completed`
  - `Type` (VARIANT) — options: `Text`, `Dot`, `Icon`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`

### Step Item Horizontal

- **kind:** SET
- **nodeId:** `5558:50599`
- **variants:** 45
- **props:**
  - `Is Line Before#5558:189` (BOOLEAN)
  - `Is Line After#5558:195` (BOOLEAN)
  - `Status` (VARIANT) — options: `Incomplete`, `Active`, `Completed`, `Destructive`, `Disabled`
  - `Type` (VARIANT) — options: `Text`, `Dot`, `Icon`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`

### Step Group Vertical

- **kind:** SET
- **nodeId:** `5627:32501`
- **variants:** 9
- **props:**
  - `Type` (VARIANT) — options: `Dot`, `Text`, `Icon`
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`

### Step Group Horizontal

- **kind:** SET
- **nodeId:** `5628:39728`
- **variants:** 9
- **props:**
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`
  - `Type` (VARIANT) — options: `Dot`, `Text`, `Icon`


## Table

### Table Header Cell

- **kind:** SET
- **nodeId:** `5560:52543`
- **variants:** 2
- **props:**
  - `Is Icon Left#5560:252` (BOOLEAN)
  - `Is Info#5560:255` (BOOLEAN)
  - `Is Sort#5560:258` (BOOLEAN)
  - `Is Checkbox#5560:261` (BOOLEAN)
  - `Is Header Text#5560:264` (BOOLEAN)
  - `Icon Left#5560:267` (INSTANCE_SWAP)
  - `Header Text#5986:178` (TEXT)
  - `Color` (VARIANT) — options: `White`, `Gray`

### Table Content Cell

- **kind:** SET
- **nodeId:** `5561:52659`
- **variants:** 120
- **props:**
  - `Is Supporting Text#5565:0` (BOOLEAN)
  - `Main Text#5565:13` (TEXT)
  - `Supporting Text#5565:26` (TEXT)
  - `Is Rating Text#5633:717` (BOOLEAN)
  - `Rating Text#5633:729` (TEXT)
  - `Is Info#5634:741` (BOOLEAN)
  - `Is Main Text#5986:57` (BOOLEAN)
  - `Type` (VARIANT) — options: `Text`, `Avatar Single`, `Icon`, `Image`, `Flag`, `Trend`, `Progress`, `Input Field`, `Button Icon`, `Rating`, `Button`, `Avatar Group`, …(+3)
  - `State` (VARIANT) — options: `Default`, `Hover`
  - `Form Control` (VARIANT) — options: `None`, `Checkbox`, `Radio`, `Toggle`


## Tab

### Tab Single

- **kind:** SET
- **nodeId:** `5558:51607`
- **variants:** 128
- **props:**
  - `Is Badge#5560:235` (BOOLEAN)
  - `Is Icon#5629:708` (BOOLEAN)
  - `Icon#5629:711` (INSTANCE_SWAP)
  - `Main Text#5629:714` (TEXT)
  - `Is Main Text#10456:0` (BOOLEAN)
  - `State` (VARIANT) — options: `Default`, `Hover`, `Active`, `Disabled`
  - `Style` (VARIANT) — options: `Default`, `Outlined`, `Bottom Border`, `Left Border`
  - `Size` (VARIANT) — options: `xs`, `sm`, `md`, `lg`
  - `Width` (VARIANT) — options: `Hug`, `Fixed`

### Tab Group

- **kind:** SET
- **nodeId:** `5629:52744`
- **variants:** 24
- **props:**
  - `Is Item 1#6000:13` (BOOLEAN)
  - `Is Item 2#6000:38` (BOOLEAN)
  - `Is Item 3#6000:63` (BOOLEAN)
  - `Is Item 4#6000:88` (BOOLEAN)
  - `Is Item 5#6000:113` (BOOLEAN)
  - `Orientation` (VARIANT) — options: `Vertical`, `Horizontal`
  - `Size` (VARIANT) — options: `xs`, `sm`, `md`, `lg`
  - `Style` (VARIANT) — options: `Default`, `Bottom Border`, `Left Border`

### _TabBarItem

- **kind:** SINGLE
- **nodeId:** `10399:5329`
- **props:**
  - `Bottom Text#10504:0` (TEXT)
  - `Is Bottom Text#10504:1` (BOOLEAN)
  - `Icon#10504:2` (INSTANCE_SWAP)

### Tab Bar

- **kind:** SET
- **nodeId:** `10504:18157`
- **variants:** 8
- **props:**
  - `Type` (VARIANT) — options: `1`, `2`, `3`, `4`
  - `Is Dark Mode` (VARIANT) — options: `False`, `True`


## Tooltip

### Tooltip

- **kind:** SET
- **nodeId:** `1270:15019`
- **variants:** 27
- **props:**
  - `Is Supporting Text#5567:39` (BOOLEAN)
  - `Supporting Text#5567:76` (TEXT)
  - `Title#5567:114` (TEXT)
  - `Is Action Button#5567:133` (BOOLEAN)
  - `Arrow` (VARIANT) — options: `None`, `Bottom Left`, `Bottom Right`, `Top`, `Bottom`, `Right`, `Top Left`, `Top Right`, `Left`
  - `Color` (VARIANT) — options: `White`, `Brand`, `Black`


## Navigations

### Section Header

- **kind:** SET
- **nodeId:** `10398:10588`
- **variants:** 16
- **props:**
  - `Left Text#10398:0` (TEXT)
  - `Is Right Text#10398:1` (BOOLEAN)
  - `Right Text#10398:2` (TEXT)
  - `Left Icon#10497:0` (INSTANCE_SWAP)
  - `Is Left Icon#10497:5` (BOOLEAN)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`, `xl`
  - `Right Item` (VARIANT) — options: `Link`, `Action Button`, `Icon`, `None`

### Top Nav

- **kind:** SET
- **nodeId:** `10388:15872`
- **variants:** 10
- **props:**
  - `Center Title#10388:0` (TEXT)
  - `Is Icon Right#10388:3` (BOOLEAN)
  - `Is Icon Left#10388:6` (BOOLEAN)
  - `Is Center Title#10388:9` (BOOLEAN)
  - `Left Title#10393:0` (TEXT)
  - `Right Title#10393:3` (TEXT)
  - `Is Left Title#10393:6` (BOOLEAN)
  - `Is Right Title#10393:9` (BOOLEAN)
  - `Progress Label#10472:8` (TEXT)
  - `Is Progress Label#10472:12` (BOOLEAN)
  - `Icon Left#10724:18` (INSTANCE_SWAP)
  - `Icon Right#10724:27` (INSTANCE_SWAP)
  - `Is Avatar Left#10724:36` (BOOLEAN)
  - `Is Avatar Right#10724:49` (BOOLEAN)
  - `Is Heading Text#20313:31` (BOOLEAN)
  - `Type` (VARIANT) — options: `Title`, `Progress`, `Dropdown`, `Tab`, `Input Text`
  - `Is Dark Mode` (VARIANT) — options: `False`, `True`

### _TopNavHeading

- **kind:** SET
- **nodeId:** `20313:38959`
- **variants:** 2
- **props:**
  - `Title Text#20313:2` (TEXT)
  - `Supporting Text#20313:3` (TEXT)
  - `Is Title Text#20313:4` (BOOLEAN)
  - `Is Supporting Text#20313:7` (BOOLEAN)
  - `Size` (VARIANT) — options: `lg`, `md`


## Mobile App Components

### App Purpose

- **kind:** SET
- **nodeId:** `10361:10445`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `False`, `True`

### Occupation

- **kind:** SET
- **nodeId:** `12398:45062`
- **variants:** 2
- **props:**
  - `Is Supporting Text#14334:0` (BOOLEAN)
  - `Is Selected` (VARIANT) — options: `False`, `True`

### Assessment Gender

- **kind:** SET
- **nodeId:** `12336:23784`
- **variants:** 4
- **props:**
  - `Type` (VARIANT) — options: `Default`, `Textarea`
  - `Is Active` (VARIANT) — options: `False`, `True`

### Free Trial Progress

- **kind:** SET
- **nodeId:** `10493:17537`
- **variants:** 3
- **props:**
  - `Is Title Text#10494:4` (BOOLEAN)
  - `Title Text#10494:8` (TEXT)
  - `Is Supporting Text#10494:12` (BOOLEAN)
  - `Supporting Text#10494:16` (TEXT)
  - `State` (VARIANT) — options: `Completed`, `Current`, `Incomplete`

### Pricing Tier

- **kind:** SET
- **nodeId:** `10371:1713`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `False`, `True`

### Onboarding Physical Distress

- **kind:** SET
- **nodeId:** `22544:59422`
- **variants:** 4
- **props:**
  - `Type` (VARIANT) — options: `1`, `2`
  - `Is Selected` (VARIANT) — options: `True`, `False`

### Onboarding Stress Level

- **kind:** SET
- **nodeId:** `22544:67565`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `False`, `True`

### Health Metrics

- **kind:** SET
- **nodeId:** `20365:29160`
- **variants:** 7
- **props:**
  - `Type` (VARIANT) — options: `1`, `2`, `3`, `4`, `5`, `6`, `7`

### Water Type

- **kind:** SET
- **nodeId:** `20522:60250`
- **variants:** 6
- **props:**
  - `Type` (VARIANT) — options: `sm`, `md`, `lg`
  - `Is Selected` (VARIANT) — options: `false`, `true`

### Health Metrics Date

- **kind:** SET
- **nodeId:** `20520:99407`
- **variants:** 6
- **props:**
  - `Type` (VARIANT) — options: `Hydration`, `Mood`, `Sleep`, `Nutrition`, `Blood Pressure`, `Weight`

### Social Wellbeing

- **kind:** SET
- **nodeId:** `20466:37088`
- **variants:** 6
- **props:**
  - `Quantity` (VARIANT) — options: `0`, `1`, `2`, `3`, `4`, `5`

### Health Metrics Date

- **kind:** SET
- **nodeId:** `20445:56078`
- **variants:** 2
- **props:**
  - `Is Completed` (VARIANT) — options: `true`, `false`

### Heart Rate Zone

- **kind:** SET
- **nodeId:** `20451:54817`
- **variants:** 2
- **props:**
  - `Is Open` (VARIANT) — options: `true`, `false`

### Health Score Detail

- **kind:** SINGLE
- **nodeId:** `20368:33415`

### Health Metric Widget

- **kind:** SINGLE
- **nodeId:** `20372:14845`

### Progress Metrics

- **kind:** SINGLE
- **nodeId:** `20474:37425`

### Health Metrics History

- **kind:** SINGLE
- **nodeId:** `20372:15204`
- **props:**
  - `Is Status Text#20374:0` (BOOLEAN)
  - `Title Text#20448:0` (TEXT)
  - `Is Title Text#20448:2` (BOOLEAN)
  - `Is Supporting Text#20448:3` (BOOLEAN)
  - `Date Text#20448:4` (TEXT)
  - `Is Date Text#20448:5` (BOOLEAN)
  - `Is Left Icon#20448:6` (BOOLEAN)
  - `Left Icon#20448:8` (INSTANCE_SWAP)
  - `Is Right Icon#20448:9` (BOOLEAN)
  - `Right Icon#20448:10` (INSTANCE_SWAP)
  - `Supporting Text#20448:11` (TEXT)
  - `Status Text#20448:12` (TEXT)
  - `Is Metadata Text#20485:12` (BOOLEAN)

### Symptom Result

- **kind:** SET
- **nodeId:** `20493:40676`
- **variants:** 3
- **props:**
  - `Risk Level` (VARIANT) — options: `High`, `Mild`, `Low`

### Anatomy + Checkbox

- **kind:** SET
- **nodeId:** `20536:63030`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `false`, `true`

### Slider Mood

- **kind:** SET
- **nodeId:** `22549:42937`
- **variants:** 10
- **props:**
  - `Emotion` (VARIANT) — options: `1 - Depressed`, `2 - Sad`, `3 - Neutral`, `4 - Happy`, `5 - Overjoyed`
  - `Type` (VARIANT) — options: `Button Icon`, `Simple`

### Share Mood

- **kind:** SINGLE
- **nodeId:** `22502:21800`

### Mood Date

- **kind:** SET
- **nodeId:** `22499:46089`
- **variants:** 14
- **props:**
  - `Mood Level` (VARIANT) — options: `1`, `2`, `3`, `4`, `5`, `Skipped`, `Empty`
  - `Size` (VARIANT) — options: `sm`, `md`

### Mood Illustration

- **kind:** SET
- **nodeId:** `22401:40013`
- **variants:** 20
- **props:**
  - `Level` (VARIANT) — options: `1 (Depressed)`, `2 (Sad)`, `3 (Neutral)`, `4 (Happy)`, `5 (Overjoyed)`
  - `Size` (VARIANT) — options: `xl`, `lg`, `md`, `sm`

### Journal Data Cell

- **kind:** SET
- **nodeId:** `22495:12583`
- **variants:** 5
- **props:**
  - `Type` (VARIANT) — options: `Empty`, `Negative`, `Neutral`, `Positive`, `Skipped`

### Journal Prompt

- **kind:** SINGLE
- **nodeId:** `22497:13429`

### Mindfule Minute Recommendations

- **kind:** SET
- **nodeId:** `22563:45955`
- **variants:** 4
- **props:**
  - `Is Badge#22563:0` (BOOLEAN)
  - `Type` (VARIANT) — options: `1`, `2`, `3`, `4`

### Soundscape Prompt

- **kind:** SINGLE
- **nodeId:** `22567:46484`

### Rating Bar

- **kind:** SET
- **nodeId:** `20512:50503`
- **variants:** 5
- **props:**
  - `Star` (VARIANT) — options: `1`, `2`, `3`, `4`, `5`

### Availability Slot

- **kind:** SET
- **nodeId:** `20510:47832`
- **variants:** 4
- **props:**
  - `Is Available` (VARIANT) — options: `true`, `false`
  - `Size` (VARIANT) — options: `sm`, `md`

### Upcoming Consultation

- **kind:** SINGLE
- **nodeId:** `20367:9022`

### Doctor Review

- **kind:** SINGLE
- **nodeId:** `20424:32441`

### Doctor Card

- **kind:** SINGLE
- **nodeId:** `20409:45884`
- **props:**
  - `Title Text#20510:0` (TEXT)
  - `Is Metadata#20510:1` (BOOLEAN)
  - `Is Rating#20510:2` (BOOLEAN)
  - `Is Status Text#20510:3` (BOOLEAN)
  - `Is Date Schedule#20510:4` (BOOLEAN)

### AI Recommendation

- **kind:** SINGLE
- **nodeId:** `20368:38269`

### AI Assistant Immersive Text

- **kind:** SINGLE
- **nodeId:** `20507:60102`

### Text Input AI Immersive

- **kind:** SET
- **nodeId:** `20507:59847`
- **variants:** 4
- **props:**
  - `Text#22572:0` (TEXT)
  - `Is Selected` (VARIANT) — options: `False`, `True`
  - `Is Expanded` (VARIANT) — options: `False`, `True`

### Community Post

- **kind:** SET
- **nodeId:** `10595:24080`
- **variants:** 7
- **props:**
  - `Type` (VARIANT) — options: `Video`, `Image`, `Text`, `Poll`, `Workshop`, `Chart`, `Gain`

### Community Comment

- **kind:** SET
- **nodeId:** `10604:23245`
- **variants:** 2
- **props:**
  - `Type` (VARIANT) — options: `Parent`, `Children`

### Blog Minimal

- **kind:** SINGLE
- **nodeId:** `10591:33524`

### Blog

- **kind:** SINGLE
- **nodeId:** `10591:33311`

### Blog Card

- **kind:** SINGLE
- **nodeId:** `10388:13889`

### Article Text

- **kind:** SINGLE
- **nodeId:** `22499:15094`

### News & Resources

- **kind:** SINGLE
- **nodeId:** `18341:72244`

### Related Article

- **kind:** SINGLE
- **nodeId:** `10594:37746`

### Blog

- **kind:** SINGLE
- **nodeId:** `20365:28392`

### Short Video

- **kind:** SINGLE
- **nodeId:** `20429:68740`
- **props:**
  - `Is Badge#20518:0` (BOOLEAN)

### Quote

- **kind:** SINGLE
- **nodeId:** `22573:57518`

### Quiz

- **kind:** SINGLE
- **nodeId:** `22526:51240`

### Course

- **kind:** SINGLE
- **nodeId:** `22526:49040`

### Courses

- **kind:** SINGLE
- **nodeId:** `22522:25833`
- **props:**
  - `Graphic#22573:0` (INSTANCE_SWAP)
  - `Title Text#22573:1` (TEXT)
  - `Is Title Text#22573:2` (BOOLEAN)

### Course Card

- **kind:** SET
- **nodeId:** `22580:50813`
- **variants:** 3
- **props:**
  - `State` (VARIANT) — options: `Not Started`, `Completed`, `In Progress`

### Insight List

- **kind:** SINGLE
- **nodeId:** `18328:34051`

### Insight List + Icon

- **kind:** SINGLE
- **nodeId:** `18322:68005`

### Insight List

- **kind:** SINGLE
- **nodeId:** `18322:66913`

### Insight Item

- **kind:** SINGLE
- **nodeId:** `20372:15657`

### Scan Metadata

- **kind:** SINGLE
- **nodeId:** `20313:52158`

### Nutrition Metadata

- **kind:** SINGLE
- **nodeId:** `20445:36065`

### Notification

- **kind:** SET
- **nodeId:** `10421:31089`
- **variants:** 5
- **props:**
  - `Title Text#20427:0` (TEXT)
  - `Is Supporting Text#20427:6` (BOOLEAN)
  - `Supporting Text#20427:12` (TEXT)
  - `Timestamp Text#20427:18` (TEXT)
  - `Type` (VARIANT) — options: `Text`, `Progress Bar`, `Button`, `Badge`, `Image`

### Settings Simple

- **kind:** SINGLE
- **nodeId:** `10421:32182`
- **props:**
  - `Right Text#10421:5` (TEXT)
  - `Is Right Text#10421:6` (BOOLEAN)
  - `Is Toggle#10435:1` (BOOLEAN)
  - `Is Right Icon#10435:2` (BOOLEAN)
  - `Left Icon#20431:0` (INSTANCE_SWAP)
  - `Is Left Icon#20431:1` (BOOLEAN)

### Community Notification

- **kind:** SINGLE
- **nodeId:** `10601:24241`

### Gallery Selection

- **kind:** SET
- **nodeId:** `10541:22479`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `False`, `True`

### Settings Complex

- **kind:** SET
- **nodeId:** `14338:24003`
- **variants:** 2
- **props:**
  - `Is Left Icon#14338:0` (BOOLEAN)
  - `Is Right Icon#14338:1` (BOOLEAN)
  - `Supporting Text#14338:2` (TEXT)
  - `Is Toggle#14338:3` (BOOLEAN)
  - `Is Supporting Text#14338:4` (BOOLEAN)
  - `Size` (VARIANT) — options: `md`, `lg`

### Achievement Badge

- **kind:** SET
- **nodeId:** `16344:92287`
- **variants:** 3
- **props:**
  - `Is Bottom Text#10604:2` (BOOLEAN)
  - `Title Text#10604:5` (TEXT)
  - `Supporting Text#10604:8` (TEXT)
  - `Icon#10604:11` (INSTANCE_SWAP)
  - `Is Title Text#10604:14` (BOOLEAN)
  - `Is Supporting Text#10604:17` (BOOLEAN)
  - `Size` (VARIANT) — options: `sm`, `md`, `lg`

### Achievement Leaderboard

- **kind:** SINGLE
- **nodeId:** `16344:92312`

### Achievement Progress

- **kind:** SINGLE
- **nodeId:** `16344:92322`

### List Simple

- **kind:** SET
- **nodeId:** `12438:48051`
- **variants:** 2
- **props:**
  - `Is Right Text#12438:0` (BOOLEAN)
  - `Is Right Icon#12438:1` (BOOLEAN)
  - `Right Icon#12438:2` (INSTANCE_SWAP)
  - `Is Left Icon#12438:3` (BOOLEAN)
  - `Is Left Text#12438:4` (BOOLEAN)
  - `Left Icon#12438:5` (INSTANCE_SWAP)
  - `Is Left Dot#12441:12` (BOOLEAN)
  - `Is Right Dot#12441:15` (BOOLEAN)
  - `Size` (VARIANT) — options: `sm`, `md`

### List Simple Icon Contained

- **kind:** SET
- **nodeId:** `10516:18394`
- **variants:** 4
- **props:**
  - `Is Toggle Button#10516:1` (BOOLEAN)
  - `Right Text#10516:2` (TEXT)
  - `Left Text#10516:3` (TEXT)
  - `Left Icon#10516:4` (INSTANCE_SWAP)
  - `Is Left Icon#10516:5` (BOOLEAN)
  - `Is Left Icon Contained#10516:6` (BOOLEAN)
  - `Right Icon#10516:7` (BOOLEAN)
  - `Is Selected` (VARIANT) — options: `False`, `True`
  - `Size` (VARIANT) — options: `sm`, `md`

### Invite Referral

- **kind:** SET
- **nodeId:** `10557:23059`
- **variants:** 4
- **props:**
  - `Title Text#10557:0` (TEXT)
  - `Supporting Text#10557:4` (TEXT)
  - `State` (VARIANT) — options: `Invited`, `Pending`, `Not Invited`, `Remove`

### Language Selection

- **kind:** SET
- **nodeId:** `10429:12851`
- **variants:** 2
- **props:**
  - `Is Right Icon#10693:4` (BOOLEAN)
  - `Is Selected` (VARIANT) — options: `True`, `False`

### Country Checklist

- **kind:** SET
- **nodeId:** `14330:78638`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `False`, `True`

### Features List

- **kind:** SET
- **nodeId:** `16380:49962`
- **variants:** 2
- **props:**
  - `Is CTA Button#16380:2` (BOOLEAN)
  - `Is Supporting Text#16380:5` (BOOLEAN)
  - `Is Title Text#16380:8` (BOOLEAN)
  - `Size` (VARIANT) — options: `md`, `sm`

### Payment Method

- **kind:** SET
- **nodeId:** `18358:82268`
- **variants:** 2
- **props:**
  - `Is Selected` (VARIANT) — options: `false`, `true`

### Streak

- **kind:** SET
- **nodeId:** `18341:103559`
- **variants:** 3
- **props:**
  - `Type` (VARIANT) — options: `Default`, `Completed`, `Skipped`

### List + Form Control

- **kind:** SET
- **nodeId:** `12413:44050`
- **variants:** 16
- **props:**
  - `Is Left Icon#12413:0` (BOOLEAN)
  - `Supporting Text#12413:4` (TEXT)
  - `Left Icon#12413:7` (INSTANCE_SWAP)
  - `Is Supporting Text#12413:10` (BOOLEAN)
  - `Title Text#20519:0` (TEXT)
  - `Is Selected` (VARIANT) — options: `False`, `True`
  - `Size` (VARIANT) — options: `md`, `sm`
  - `Right Item` (VARIANT) — options: `Checklist`, `Radio`
  - `Left Item` (VARIANT) — options: `Icon`, `Image`

### List + Icon

- **kind:** SET
- **nodeId:** `18313:57200`
- **variants:** 4
- **props:**
  - `Supporting Text#18313:0` (TEXT)
  - `Is Supporting Text#18313:2` (BOOLEAN)
  - `Is Right Icon#18313:4` (BOOLEAN)
  - `Is Right Text#18313:6` (BOOLEAN)
  - `Right Text#18313:8` (TEXT)
  - `Type` (VARIANT) — options: `Icon Contained`, `Icon Plain`
  - `Size` (VARIANT) — options: `sm`, `md`

### Date Selector Pill

- **kind:** SET
- **nodeId:** `20488:38765`
- **variants:** 6
- **props:**
  - `Is Bottom Dot#20488:0` (BOOLEAN)
  - `Day Text#20488:3` (TEXT)
  - `Date Text#20488:7` (TEXT)
  - `State` (VARIANT) — options: `Default`, `Selected`, `Disabled`
  - `Type` (VARIANT) — options: `Nutrition`, `Period`

### Date Selector Pill Sleep

- **kind:** SET
- **nodeId:** `22503:39600`
- **variants:** 2
- **props:**
  - `Type` (VARIANT) — options: `Slept`, `Skipped`

### Schedule Timeline Card

- **kind:** SET
- **nodeId:** `20488:39393`
- **variants:** 6
- **props:**
  - `Is Empty` (VARIANT) — options: `False`, `True`
  - `Type` (VARIANT) — options: `Journal`, `Mood`, `Doctor Appointment`

### Connect Device

- **kind:** SINGLE
- **nodeId:** `20375:11605`

### Scan UI

- **kind:** SINGLE
- **nodeId:** `20436:65557`

### Progress Chart

- **kind:** SET
- **nodeId:** `22563:51052`
- **variants:** 2
- **props:**
  - `Is Completed` (VARIANT) — options: `false`, `true`

### Rounded Section

- **kind:** SET
- **nodeId:** `22543:60879`
- **variants:** 18
- **props:**
  - `Size` (VARIANT) — options: `lg`, `md`, `sm`
  - `Direction` (VARIANT) — options: `Up`, `Down`
  - `Color` (VARIANT) — options: `White`, `Brand`, `Dark`

