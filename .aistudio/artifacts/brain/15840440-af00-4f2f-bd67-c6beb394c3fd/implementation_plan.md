# Play Zones & Event Programme Section Background Imagery

Integrate photographic background imagery into the **Play Zones** section (including individual zone cards) and the **Event Programme & Timetable** section, layered with soft warm gradient scrims to preserve WCAG AA text contrast and editorial polish.

## User Review & Critical Decisions

> [!IMPORTANT]
> The confirmed choices from the Phase 1 questionnaire are summarized below. You can paste your own direct image URLs or asset filenames into the configuration, or utilize the curated high-resolution festival garden assets pre-configured for these sections.

- **Confirmed Image Source**: User-provided image URLs or uploaded files, with high-quality festival photography defaults pre-wired.
- **Confirmed Target Sections**:
  1. **Play Zones Section**: Atmosphere backdrop for the entire play zones container and immersive photographic backgrounds for each play zone card (Toddler Garden, Adventure Lawn, Creative Atelier, Discovery Science, Main Stage).
  2. **Event Programme & Timetable Section**: Scenic outdoor festival grounds background behind the schedule timeline, with scannable glassmorphic schedule cards.
- **Confirmed Legibility Treatment**: Soft warm gradient overlays (`from-slate-950/85 via-amber-950/70 to-emerald-950/80` and `from-black/75 via-black/40 to-transparent`) ensuring 4.5:1 text contrast while preserving vivid photographic texture.

---

## 1. Overview & Core Concept

- **What It Does**: Enhances the visual depth of Bambino World by transforming the **Play Zones** and **Event Programme** sections from flat solid containers into rich, cinematic festival environments. Each area features curated outdoor festival imagery under warm translucent overlays that keep all parent microcopy, session times, and interactive controls crisp and readable.
- **Target Audience**: Parents and families browsing the festival schedule and exploring activity areas, expecting a warm, high-end festival experience.
- **Key Value**: Replaces sterile flat backgrounds with real visual atmosphere while ensuring parents can quickly scan activities, age recommendations, and timetable slots.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Color Palette & Scrims**:
  - Play Zones main backdrop: Warm earth tone with soft golden-hour gradient (`rgba(15, 23, 42, 0.88)` to `rgba(69, 26, 3, 0.75)`).
  - Play Zones individual cards: Full-bleed zone imagery with directional bottom-up scrims (`bg-gradient-to-t from-black/85 via-black/45 to-transparent`), keeping white typography legible.
  - Programme Section backdrop: Scenic outdoor stage/lawn festival photography with an amber/emerald tinted scrim (`bg-slate-950/85` with subtle warm accent gradients) so timetable filters and session cards stand out clearly.
- **Card Surfaces**: Frosted glassmorphism (`backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-white/15`) for schedule items and zone highlights to float cleanly over photographic backdrops without visual noise.
- **Typography**: Retains the friendly **Fredoka** display headings paired with clean, accessible sans-serif for times, ages, and zone descriptions.
- **Image Flexibility**: Provides a centralized image configuration map (`src/data/sectionBackgrounds.ts`) where custom image URLs or local asset paths can be swapped or updated instantly.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Section Container vs Card-Level Imagery**:
  - *Chosen Approach*: Apply both a subtle atmospheric texture to the overall section wrapper and distinctive photographic backdrops to individual zone cards.
  - *Why*: Allows each specific activity (sensory toddlers vs active obstacle courses vs acoustic music) to carry its own visual identity, while the overarching section remains cohesive.
  - *Alternative Considered*: A single large background image for the entire section; rejected because individual zone details get lost.

- **Decision 2: Contrast & Text Legibility Scrims**:
  - *Chosen Approach*: Multi-stop CSS gradient scrims (`from-black/80 via-black/40 to-transparent`) and translucent card backings (`bg-slate-900/75`).
  - *Why*: Guarantees WCAG AA compliance (4.5:1 minimum contrast ratio) regardless of the brightness of user-provided images.

---

## 4. Technical Architecture & Data Strategy

### Visual Component Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Play Zones Section Wrapper                                   │
│ [ Background: festival_grounds_atmosphere.jpg + Warm Scrim ]  │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Zone Grid (5 Zones)                                      │ │
│ │ ┌──────────────────┐ ┌──────────────────┐ ┌────────────┐ │ │
│ │ │ Toddler Garden   │ │ Adventure Lawn   │ │ Creative   │ │ │
│ │ │ [Zone Photo]     │ │ [Zone Photo]     │ │ [Zone Photo│ │ │
│ │ │ [Scrim + Title]  │ │ [Scrim + Title]  │ │ [Scrim...] │ │ │
│ │ └──────────────────┘ └──────────────────┘ └────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Event Programme Section Wrapper                              │
│ [ Background: festival_programme_backdrop.jpg + Dark Scrim ] │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Time Filter Tabs (Morning · Afternoon · All Day)         │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Schedule Grid Cards (Frosted Glassmorphic Cards)          │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ 10:00 - 11:30 | Sensory Nature Play | Toddler Garden │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Component & File Strategy
- `src/data/sectionBackgrounds.ts`: Central registry containing image URLs for each section (Play Zones wrapper, individual Play Zone cards, Programme wrapper), with easy replacement slots for custom user uploads/URLs.
- `src/components/HomeHero.tsx` & `src/components/PlayZonesView.tsx`: Integrate the background images and warm gradient scrims onto the Play Zones container and cards.
- `src/components/EventProgrammeView.tsx`: Add the scenic background image container with warm gradient overlay to the timetable view.
