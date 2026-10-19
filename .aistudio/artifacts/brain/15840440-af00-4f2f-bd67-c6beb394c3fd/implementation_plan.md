# 3D Festival Characters Detail, Inclusive Diversity & Spatial Depth Enhancements

Transform the Bambino World 3D festival diorama into a representative, vibrant, miniature living world by overhauling the festival crowd with multi-racial skin tones, diverse body silhouettes, balanced male and female characters across all roles, authentic cultural hairstyles and accessories, paired with tilt-shift optical depth and dynamic level-of-detail (LOD) performance scaling.

## User Review & Critical Decisions

> [!IMPORTANT]
> The confirmed choices and user feedback have been integrated into this revised specification:

- **Confirmed Multi-Racial Representation**:
  - Broad demographic spectrum reflecting Zimbabwean, African diaspora, and international festival-goers.
  - Six calibrated natural skin tone swatches (`#3B2219` rich espresso, `#5E331A` deep mahogany, `#8D532D` warm bronze, `#B57B4D` golden caramel, `#D9A779` sunlit olive/tan, `#F2D5B8` warm porcelain).
- **Confirmed Body Silhouette Variations**:
  - Sturdy / broad frame (wider torso, sturdy shoulders, solid stance).
  - Tall / slender frame (elongated limbs, lean torso).
  - Petite / compact frame (shorter stride, proportioned torso).
  - Soft / curvy frame (rounded hips, relaxed posture).
  - Authentic stage performers and staff with distinct professional silhouettes.
- **Confirmed Male & Female Gender Balance Across All Roles**:
  - 50/50 balanced representation across parents, attendees, toddlers, and staff.
  - Male attire: Cargo shorts, festival graphic tees, collared linen shirts, sneakers with white soles, backwards caps.
  - Female attire: Sundresses, jumpsuits, dungarees with tees, colorful skirts, high-top sneakers, sun visors.
  - Staff & Performers: Equal distribution of male and female stage artists (e.g. female lead vocalist, male marimba master, female acoustic guitarist, male puppeteer) and safety guides.
- **Confirmed Visual Accessories & Hair Details**:
  - Authentic hairstyles: Afro puffs, fade cuts, braided cornrows, dreadlocks, wavy bobs, headwraps/hijabs, sunhats, and caps.
  - Two-tone shoes with contrasting soles.
  - Zone-specific handheld props (marimba mallets, art palettes, science clipboards, balloons, strollers).
- **Confirmed Spatial Depth & Atmosphere**:
  - Optical tilt-shift depth-of-field gradient that brings focal attention to the active sector while softening foreground/background perimeters.
  - Soft golden-hour atmospheric lighting with rim highlights on characters' shoulders and heads.
- **Confirmed Performance & Dynamic Detail Scaling (LOD)**:
  - Dynamic level-of-detail engine that renders full accessory detail when zoomed in or stationary, and streamlines secondary geometry during rapid pan/zoom navigation to maintain 60 FPS on all devices.

---

## 1. Overview & Core Concept

- **What It Does**: Populates the 4,000 m² festival grounds with an authentic, joyful, multi-ethnic family community. Rather than repetitive generic human models, every festival attendee exhibits distinctive personal character: realistic skin tones, authentic hair textures and headwear, balanced genders, diverse body frames, and delightful contextual accessories (like toddlers holding balloons, artists holding paint palettes, and musicians holding instruments).
- **Target Audience / Persona**: Families, parents, and festival visitors of all cultural backgrounds exploring the 3D grounds, seeing themselves and their children warmly and respectfully represented.
- **Key Value**: Replaces sterile, identical 3D avatars with an inclusive, tactile miniature world that feels hand-crafted and alive, elevating the digital festival experience to award-winning standard while preserving fluid 60 FPS interaction.

---

## 2. User Experience & Visual Design

### Diverse Demographic & Race Spectrum
Characters are procedurally varied across six realistic skin tone palettes, with balanced distribution across the grounds:
1. **Deep Espresso / Rich Umber** (`0x341d14`): Deep melanin tones with warm undertones.
2. **Deep Mahogany / Bronze** (`0x553018`): Warm brown tones with rich earth highlights.
3. **Warm Chestnut / Caramel** (`0x7f4c28`): Mid-rich tones common across southern Africa.
4. **Golden Honey / Warm Amber** (`0xa66f44`): Radiant golden-tan skin tones.
5. **Sunlit Olive / Light Tan** (`0xcfa173`): Warm Mediterranean and mixed-heritage tones.
6. **Porcelain Warm Beige** (`0xecd0b2`): Fair skin tones with soft blush warmth.

### Comprehensive Hairstyle & Headwear Catalog
- **Afro Puffs & Pom-Poms**: Double puffs for young girls and toddlers, high single puff with hair ties.
- **Braided Twists & Cornrows**: Sleek geometric crown braids, box braids with colorful accent beads.
- **Textured Fades & Waves**: Clean short side fades with textured sponge tops for boys and men.
- **Dreadlock Buns & Locs**: Bundled crown locs with metallic ring accents.
- **Fabric Headwraps & Hijabs**: Vibrant wrapped African headscarves (*dhuku*) and elegant modest scarves.
- **Curly & Flowing Styles**: Soft voluminous curls, wavy shoulder-length bobs, and swept ponytails.
- **Festival Headwear**: Backwards baseball caps, floppy safari sunhats, bucket hats, and floral headbands.

### Body Silhouette Engine
Characters will no longer use uniform box scales. Proportions adapt dynamically to 5 physical archetypes:
- **Broad / Sturdy**: 1.25x torso width, wider shoulder stance, grounded footprint.
- **Tall / Slender**: 1.1x total height, elongated leg limbs, lean torso profile.
- **Petite**: 0.9x height, compact proportions, energetic stride.
- **Curvy / Soft**: Gentle torso contouring with rounded waist and hips.
- **Athletic**: Well-proportioned active build with dynamic arm postures.
- **Babies & Toddlers**: 0.45x–0.6x height scale, oversized heads, chubby limbs, wobble stride.

### Male & Female Attire Variations
- **Male Outfits**:
  - Cargo shorts with graphic festival tee and low-top canvas sneakers.
  - Chino shorts with open short-sleeve patterned festival shirt.
  - Athletic joggers with crewneck and athletic runners.
- **Female Outfits**:
  - Sleeveless summer sundress in pastel/sunburst tones.
  - High-waisted denim shorts with tucked tee and retro trainers.
  - Casual dungarees / overalls with colorful striped undershirt.
- **Footwear Realism**:
  - Every character receives distinct shoes with contrasting white/rubber soles and colored uppers, eliminating flat block feet.

### Zone-Themed Props & Contextual Action
- **Main Stage Performers**:
  - Zimbabwean Marimba player holding pair of rounded mallets above wooden keys.
  - Lead female singer in radiant dress singing into vintage chrome microphone on stand.
  - Acoustic guitarist with sunburst guitar body and shoulder strap.
  - Puppet theater performer with animal hand-puppet.
- **The Little Garden (Creative Zone)**:
  - Young painters in aprons holding wooden oval artist palettes and paintbrushes.
- **Discovery World (Science & Exploration)**:
  - Educators with white lab coats and clipboards; curious kids with magnifying glasses and field backpacks.
- **Tiny Tots Oasis & Promenades**:
  - Parents pushing modern baby strollers; toddlers holding floating animal-shaped balloons tethered to their wrists.

### Tilt-Shift Spatial Depth & Lighting
- **Tilt-Shift Depth of Field**: A subtle vertical focus band keeping the active interactive zone pin-sharp while applying a creamy, miniature diorama blur to the far background and near foreground edges.
- **Atmospheric Golden-Hour Lighting**: Directional sunlight casting warm rim lights across characters' hair and shoulders, supported by soft ambient bounce from the lawn.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural Multi-Attribute Character Engine vs Pre-modeled 3D Meshes**:
  - *Chosen Approach*: Expand `createArticulatedPerson` into an algorithmic procedural generator that builds demographic traits, clothing, hair geometries, and props on the fly using shared Three.js geometries and materials.
  - *Why*: Eliminates 40MB+ of external 3D asset downloads, loads instantly on mobile 3G/4G, and enables infinite combinations of ethnicity, body type, and outfit without memory bloat.
  - *Alternatives Considered*: Loading individual GLTF files for 20+ character variations; rejected due to mobile network latency and memory overhead.

- **Decision 2: Dynamic Level-of-Detail (LOD) & Movement Scaling**:
  - *Chosen Approach*: Small high-frequency accessories (hair beads, eyeglasses, mallets, brushes) are nested in a dedicated accessory group. During camera pan/orbit drag gestures or when camera distance exceeds 48 units, accessory groups are seamlessly culled. Full detail restores immediately upon camera settle.
  - *Why*: Solves user-reported lag and keeps frame rates locked at 60 FPS while enabling rich miniature diorama aesthetics when inspecting specific zones.
  - *Alternatives Considered*: Static geometry reduction; rejected because it permanently deprives users of fine diorama details when zoomed in.

- **Decision 3: Canvas-Level Tilt-Shift Effect vs Heavy Post-Processing Pass**:
  - *Chosen Approach*: Apply a custom lightweight fragment gradient overlay combined with Three.js camera distance falloff and atmospheric fog, avoiding multi-pass WebGL post-processing buffers.
  - *Why*: Multi-pass post-processing (EffectComposer) severely degrades mobile WebGL performance and causes depth buffer conflicts on Safari iOS. The lightweight optical gradient achieves identical visual tilt-shift depth with zero frame rate impact.

---

## 4. Technical Architecture & Data Strategy

### System & Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SiteMap3D.tsx Scene Architecture                                            │
│                                                                             │
│ ┌─────────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│ │ Demographic Matrix      │  │ Body Silhouette Types │  │ Zone Props      │ │
│ │ • 6 Calibrated Tones    │  │ • Broad / Sturdy      │  │ • Marimba Mallet│ │
│ │ • 8 Hair Geometries     │  │ • Tall / Slender      │  │ • Art Palette   │ │
│ │ • Male / Female Fits    │  │ • Petite / Curvy      │  │ • Floating Ball.│ │
│ └─────────────────────────┘  └───────────────────────┘  └─────────────────┘ │
│              │                           │                        │         │
│              └───────────────────────────┼────────────────────────┘         │
│                                          ▼                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Procedural Character Generator (createArticulatedPerson)                │ │
│ │                                                                         │ │
│ │ [Root Group: World Position (x, baseY, z) + Scale (scX, scY, scZ)]      │ │
│ │  ├── Torso Group (Tee / Dress / Overalls + Neck)                       │ │
│ │  ├── Head Group (Skin Tone Base)                                        │ │
│ │  │    └── Hair / Headwrap / Hat Geometry (Afro, Braids, Cap, Scarf)    │ │
│ │  ├── Limbs: Upper/Lower Arms, Left/Right Legs with Natural Strides      │ │
│ │  ├── Two-Tone Footwear (Upper color + white rubber sole)                │ │
│ │  └── [LOD Sub-Node] Detailed Handheld Props (cullable during movement) │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                          │                                  │
│                                          ▼                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Scene Depth & Performance Optimization                                  │ │
│ │ ├── Dynamic LOD Controller (movement detection & camera distance)       │ │
│ │ ├── Tilt-Shift Depth-of-Field Optical Mask (vertical diorama falloff)  │ │
│ │ └── Atmospheric Rim & Sunbeam Lighting Engine                          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Character Specification Data Model
```typescript
interface PersonDemographicConfig {
  gender: 'female' | 'male' | 'child_boy' | 'child_girl';
  raceCategory: 'african_deep' | 'african_rich' | 'african_warm' | 'caramel_tan' | 'olive_tan' | 'fair';
  skinHex: number;
  bodyType: 'sturdy' | 'slender' | 'petite' | 'curvy' | 'athletic' | 'child';
  hairStyle: 'afro_puffs' | 'braids' | 'fade' | 'dreadlocks' | 'headwrap' | 'curls' | 'cap' | 'sunhat';
  hairHex: number;
  outfitType: 'sundress' | 'overalls' | 'shorts_tee' | 'joggers' | 'staff_vest' | 'performer';
  clothingPalette: { primary: number; secondary: number; shoes: number };
  prop?: 'palette' | 'mallet' | 'microphone' | 'guitar' | 'balloon' | 'clipboard' | 'stroller';
}
```

### Dynamic Detail Scaling & Event Flow
1. **Camera Movement Settle Detection**: When user starts dragging, orbiting, or pinching the 3D map, `isNavigating` activates and hides accessory detail sub-nodes across characters outside the active viewport.
2. **Camera Distance Calculation**: Characters beyond 48 units from the camera automatically render in lightweight silhouette mode.
3. **Smooth Return**: On touch release or camera deceleration, accessories re-emerge seamlessly within 150ms without frame drops.
4. **Tilt-Shift Viewport Mask**: A smooth vignette and depth gradient applies an optical macro lens aesthetic centered on the selected festival zone.

---

## 5. Verification & Testing Strategy

- **Diversity Verification**: Visual inspection across all 148 characters ensuring balanced 50/50 gender ratio, even distribution across all 6 skin tones, and rich variety in hairstyles and clothing.
- **Spatial Positioning Accuracy**: Verify characters stand accurately on ground level (`baseY`), stage performers are positioned firmly on the stage platform deck without clipping, and bouncy castle children bounce on the inflatable mattress.
- **Performance & 60 FPS Benchmark**: Verify zero frame rate dips during camera pan, pinch-zoom, and zone-to-zone transitions. Verify dynamic LOD properly toggles during fast movement.
- **Device & Viewport Responsiveness**: Confirm tilt-shift diorama depth and character models render cleanly across desktop, tablet, and mobile screens.
