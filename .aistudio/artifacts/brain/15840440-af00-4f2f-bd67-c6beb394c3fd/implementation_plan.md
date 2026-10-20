# Grounds & Safety Bento Showcase with Interactive Aerial Venue Explorer

Completely reimagine the "See How The Grounds Will Come Alive" section by replacing the empty dark card with an **interactive Grounds & Safety Bento Showcase**. The centerpiece is an **Interactive Aerial Grounds Explorer** using real venue photography of The Little Farm with interactive glowing hotspots, paired with parent safety trust guarantees and a seamless 3D Spatial Flight portal.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> **A Fresh, Practical Direction (Plan v3):**
> - **The Problem with Previous Plans**: Attempting to force an all-dark card or an artificial vector diagram failed to capture the real, sunny, open-air charm of The Little Farm in Meyrick Park.
> - **The New Solution**: Build an authentic **3-part Bento Showcase** centered on **real aerial venue imagery (`/bambino-farm.jpg`)**, interactive hotspot inspection, parent peace-of-mind metrics, and a dedicated 3D flight launcher.

***

### 1. Overview & Core Concept

- **What It Solves**: In the user's screenshot, a single dark box occupied full width with text clustered on the left and a barren dark void on the right. Visitors had no visual representation of the real 4,000 m² farm lawns.
- **What It Delivers**:
  1. **Interactive Aerial Venue Map (Centerpiece)**:
     - Uses the actual aerial/landscape photograph of The Little Farm grounds.
     - Features interactive animated sector badges pinned directly to physical locations on the lawn (The Little Garden under shade trees, Adventure Zone on the open grass, Creative Studio by the gazebo, Discovery Hub, and Celebration Stage on the amphitheater lawn).
     - Clicking or hovering any pin updates an interactive preview card with sector photo, age group, and key activities.
  2. **1-Click 3D Spatial Flight Portal**:
     - A high-impact launcher with a live preview snapshot, animated compass, and instant "Fly in 3D" action that transitions seamlessly into the 3D digital twin.
  3. **Parent Trust & Safety Pillar**:
     - Concrete, reassuring proof cards: Wire-fenced pond buffer, spear-picket pool fence, dedicated first aid tent, child wristband matching, and car-free pedestrian arrival.

***

### 2. User Experience & Visual Design

#### Bento Grid Layout Structure
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  See How The Grounds Will Come Alive (Section Header & Intro)                           │
├──────────────────────────────────────────────────────┬──────────────────────────────────┤
│  A. INTERACTIVE AERIAL GROUNDS EXPLORER (65% Width)  │  B. 3D DIGITAL TWIN LAUNCHER     │
│                                                      │     (35% Width)                  │
│  ┌────────────────────────────────────────────────┐  │  ┌────────────────────────────┐  │
│  │ Real Aerial Photo of The Little Farm Grounds   │  │  │ 🚀 Real-Time 3D Tour       │  │
│  │                                                │  │  │                            │  │
│  │  📍 [👶 Baby Garden]                           │  │  │ "Fly through every sector, │  │
│  │         📍 [🏰 Adventure Inflatables]          │  │  │  inspect shade pergolas &  │  │
│  │  📍 [🎨 Studio]    📍 [🔬 STEM World]          │  │  │  pedestrian flow"          │  │
│  │         📍 [🎵 Celebration Stage]              │  │  │                            │  │
│  │                                                │  │  │ [ Launch 3D Flight &rarr; ]│  │
│  │  ┌──────────────────────────────────────────┐  │  │  └────────────────────────────┘  │
│  │  │ Selected Sector HUD Card                 │  │  ├──────────────────────────────────┤
│  │  │ Little Garden · 6M–2Y · Shaded Soft Play │  │  │  C. SAFETY & FAMILY AMENITIES    │
│  │  └──────────────────────────────────────────┘  │  │     (35% Width)                  │
│  └────────────────────────────────────────────────┘  │  │  🛡️ Wire-Fenced Waters        │
│                                                      │  │  🌿 100% Shaded Picnic Lawns  │
│  [Quick Zone Tabs: All | Baby | Adventure | Stage]   │  │  🏷️ Child Wristband Matching  │
└──────────────────────────────────────────────────────┴──────────────────────────────────┘
```

#### Visual Styling & Craft Details
- **Warm Storybook Craft Atmosphere**:
  - Warm cream and meadow green background (`#faf9f5` with organic wave dividers).
  - Tactile `.sticker-badge` pins with playful tilts (`-2deg` to `2deg`) that straighten and bounce on hover.
  - Interactive hotspots with glowing pulse rings on the aerial image showing real venue scale.
- **Accessibility & Touch Ergonomics**:
  - All clickable hotspots have 44px minimum tap targets.
  - Clear visual selection states: active sector highlighted with its signature color (Emerald, Amber, Sky, Rose, Purple).
  - Zero dead clicks: every hotspot either previews sector details or launches the 3D camera.

***

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Real Aerial Venue Photo with Hotspots vs. Generic Dark Box**
  - *Chosen Approach*: Anchor the section around `/bambino-farm.jpg` (the authentic aerial view of The Little Farm in Meyrick Park) with interactive SVG/HTML hotspot pins.
  - *Why*: Solves the empty-space problem with authentic, high-trust venue imagery that parents immediately recognize and connect with.
  - *Trade-off*: Uses photographic backdrop rather than a 2D drawing or an unmounted 3D canvas, providing instant load time (0ms WebGL delay) and zero mobile scroll issues.

- **Decision 2: Bento Grid Layout vs. Single Monolithic Card**
  - *Chosen Approach*: Break the section into an asymmetric Bento Grid (Aerial Explorer + 3D Launcher + Safety Credentials).
  - *Why*: Eliminates the awkward empty horizontal space on desktop viewports and creates a rich, balanced visual rhythm.

***

### 4. Technical Architecture & Component Structure

```
src/components/
├── HomeHero.tsx
│    └── SiteMapSection (#site-map-section)
│         ├── SectionHeader (Title, subtitle, breadcrumb)
│         └── GroundsBentoGrid (Asymmetric 2-column desktop / 1-column mobile grid)
│              ├── AerialGroundsExplorer (Col-span-1 lg:col-span-2: real photo + hotspots + preview card)
│              │    ├── VenueAerialPhoto (`/bambino-farm.jpg` with gentle zoom on hover)
│              │    ├── HotspotPins (5 animated pins with sine-wave bob & pulse rings)
│              │    └── ActiveSectorPreviewHUD (Warm frosted card with zone specs)
│              ├── Spatial3DLauncherCard (Col-span-1: digital twin callout + 3D launch button)
│              └── SafetyGuaranteesCard (Col-span-1: 4 safety badges with tooltips)
```

#### State & Event Lifecycle
1. **Active Hotspot State (`activeHotspot`)**:
   - Defaults to `'little-garden'` so the preview HUD always displays rich content.
   - Clicking any pin plays a Zimbabwean marimba chime (`soundscape.playMarimbaClick()`), triggers a petal burst (`triggerPetalBurst()`), and updates the HUD.
2. **Launch 3D Action**:
   - Clicking "Launch 3D Flight" calls `onOpen3DMap(activeHotspot)`, transitioning to Cinema Mode with the camera smoothly gliding into that exact zone.
