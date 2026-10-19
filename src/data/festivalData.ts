import { ZoneData, CalloutItem, ProgrammeSession } from '../types/festival';

export const ZONES_DATA: Record<string, ZoneData> = {
  'fish-pond': {
    id: 'fish-pond',
    title: 'EXISTING FISH POND',
    subtitle: '(Fenced / Supervised)',
    category: 'safety',
    badgeColor: 'bg-emerald-400 text-slate-950',
    status: 'Fenced & Supervised',
    ageGroup: 'No Entry (Perimeter View)',
    staffing: '2 Safety Marshals',
    camPos: { x: -31, y: 26, z: -2 },
    camTarget: { x: -31, y: 0, z: -28 },
    description: 'Situated in the quiet North-West corner of the farm, the Existing Fish Pond is completely enclosed by a 48-post safety barrier fence with wire mesh, decorative boulders, a rescue lifebuoy ring, and dedicated perimeter supervisors.',
    features: [
      '360° white timber & wire-mesh safety fence enclosure',
      'Mounted emergency lifebuoy ring & warning signage',
      'Dedicated safety marshals stationed on the southern bank',
      'Natural earthen rim with shaded farm trees'
    ],
    safetyNote: 'Double-latched gate remains locked throughout the event; children may observe only from outside the fenced perimeter with adult supervision.'
  },
  'little-garden': {
    id: 'little-garden',
    title: 'THE LITTLE GARDEN',
    subtitle: '(Baby Garden - 6M to 2 Yrs)',
    category: '6m-2y',
    badgeColor: 'bg-emerald-400 text-slate-950',
    status: 'Open • Calm Zone',
    ageGroup: '6 Months – 2 Yrs',
    staffing: '6 Early-Years Carers',
    camPos: { x: -28, y: 24, z: 18 },
    camTarget: { x: -28, y: 0, z: -4 },
    description: 'A lush, hedge-enclosed and palm-fringed sanctuary exclusively for babies and toddlers (6M–2Y). Features a white bougainvillea pergola entrance, stroller parking bay, 6 white pyramid shade gazebos, soft-play foam obstacle setups, a rainbow inflatable toddler slide, and a fenced wooden playpen.',
    features: [
      'White wooden trellis pergola gate with pink bougainvillea & stroller parking bay',
      '6 white pyramid shade tents with padded baby-safe flooring mats',
      'Rainbow toddler inflatable slide & cushioned soft-play blocks',
      'Scalloped white toddler picket fence & curved green hedge enclosure'
    ],
    safetyNote: 'Shoe-free padded mats inside shade tents; single controlled entry point prevents older children from running through toddler play spaces.'
  },
  'swimming-pool': {
    id: 'swimming-pool',
    title: 'SWIMMING POOL',
    subtitle: '(SECURELY FENCED / NO-ENTRY SAFETY BUFFER)',
    category: 'safety',
    badgeColor: 'bg-sky-400 text-slate-950',
    status: 'Locked & Buffered',
    ageGroup: 'Restricted Area',
    staffing: 'Certified Lifeguard',
    camPos: { x: -26, y: 24, z: 38 },
    camTarget: { x: -26, y: 0, z: 17 },
    description: 'The existing farm swimming pool and circular wading pool are surrounded by a high wrought-iron spear picket fence with masonry corner pillars, locked red security gate, mounted rescue lifebuoys, and a red-and-white hatched No-Entry Safety Buffer zone.',
    features: [
      'Full-height wrought-iron spear picket fence with stone corner pillars',
      'High-visibility red-and-white hatched No-Entry Safety Buffer along the southern walkway',
      '6 blue-and-white striped resort umbrellas & poolside loungers inside enclosure',
      'Continuous perimeter patrol by safety staff'
    ],
    safetyNote: 'Zero event access inside the pool enclosure; pedestrian dotted flow routes are buffered away from the southern fence.'
  },
  'info-adverts': {
    id: 'info-adverts',
    title: 'BAMBINO WORLD INFO & ADVERTS',
    subtitle: 'LED digital event slides',
    category: 'family',
    badgeColor: 'bg-indigo-400 text-slate-950',
    status: 'Live Broadcast',
    ageGroup: 'All Visitors',
    staffing: 'AV Tech Desk',
    camPos: { x: -35, y: 15, z: 40 },
    camTarget: { x: -39, y: 3.5, z: 24 },
    description: 'High-brightness twin-pillar outdoor LED digital billboard positioned right inside the arrival promenade to display live stage schedules, sponsor reels, safety reminders, and zone maps.',
    features: [
      'Live-cycling dynamic LED event slides & stage timetable',
      'High-visibility orientation for families arriving from Main Entrance',
      'Timber floral planter box protecting the billboard base',
      'Emergency announcement & lost-child broadcast capability'
    ],
    safetyNote: 'Displays real-time heat/hydration reminders and emergency assembly instructions.'
  },
  'creative-zone': {
    id: 'creative-zone',
    title: 'CREATIVE ZONE',
    subtitle: '(Skating Pit & Arts)',
    category: '3-6y',
    badgeColor: 'bg-cyan-400 text-slate-950',
    status: 'Active • Sessions',
    ageGroup: '3 – 6+ Yrs',
    staffing: '3 Skate Coaches',
    camPos: { x: -34, y: 18, z: 48 },
    camTarget: { x: -35, y: 0, z: 33 },
    description: 'Located near the SW plaza, the Creative Zone features a smooth-surface enclosed Roller-Skating Pit with padded blue barrier boards, helmet & skate rental booths, and creative craft tables.',
    features: [
      'Enclosed smooth-floor skating pit with blue safety boarding',
      'Complimentary helmet, knee-pad, and quad-skate fitting station',
      'Adjacent shaded creative arts & face-painting tables',
      'Direct visibility from the Parents\' Meeting & Lounge gazebos'
    ],
    safetyNote: 'Helmets and wrist/knee guards are mandatory before entering the skating pit.'
  },
  'main-entrance': {
    id: 'main-entrance',
    title: 'MAIN ENTRANCE / REGISTRATION',
    subtitle: '(To Event)',
    category: 'family',
    badgeColor: 'bg-amber-400 text-slate-950',
    status: 'Open • Check-In',
    ageGroup: 'All Visitors',
    staffing: '4 Welcome Hosts',
    camPos: { x: -42, y: 16, z: 54 },
    camTarget: { x: -37, y: 1, z: 40 },
    description: 'The primary pedestrian welcome gateway at the South-West corner of the site. Features twin blue-and-gold truss towers, a custom welcome overhead banner, wrought-iron swing gates, red welcome carpet, queue stanchions, and twin registration booths.',
    features: [
      'Twin-pillar Bambino World welcome truss archway & directional ground arrow',
      'Fast-track QR ticket scanning & child safety wristband booths',
      'Retractable red-belt queue stanchions & floral welcome planters',
      'Direct step-free paved access into the Parents\' Lounge & Central Spine'
    ],
    safetyNote: 'Every child receives a color-coded age wristband with parent contact details upon entry.'
  },
  'parents-lounge': {
    id: 'parents-lounge',
    title: 'PARENTS\' MEETING & LOUNGE',
    subtitle: 'Shaded Gazebos & Seating',
    category: 'family',
    badgeColor: 'bg-orange-300 text-slate-950',
    status: 'Open • Relaxing',
    ageGroup: 'Parents & Families',
    staffing: 'Hospitality Team',
    camPos: { x: -24, y: 20, z: 46 },
    camTarget: { x: -26, y: 0, z: 28 },
    description: 'A row of 5 breezy white pyramid gazebos lining the southern promenade where parents can relax, socialize, recharge devices, and enjoy clear sightlines across the Creative Zone and central pathways.',
    features: [
      '5 shaded lounge gazebos with café tables and cushioned seating',
      'Stroller promenade, baby-changing & nursing support nearby',
      'Complimentary water station & shaded meeting point',
      'Direct connection to the main dotted pedestrian flow spine'
    ],
    safetyNote: 'Designated family reunion point and stroller rest stop.'
  },
  'adventure-zone': {
    id: 'adventure-zone',
    title: 'ADVENTURE ZONE',
    subtitle: '(3-6 Yrs)',
    category: '3-6y',
    badgeColor: 'bg-orange-400 text-slate-950',
    status: 'High Energy',
    ageGroup: '3 – 6 Yrs',
    staffing: '8 Play Marshals',
    camPos: { x: 10, y: 28, z: -2 },
    camTarget: { x: 10, y: 1, z: -28 },
    description: 'The expansive northern lawn houses the high-energy Adventure Zone for 3–6 year olds, featuring 5 large multi-color bouncy castles and giant inflatable slides, shaded activity tents, carnival stalls, and wooden family picnic tables.',
    features: [
      '5 giant commercial inflatable bouncy castles & dual-lane slides',
      'Shaded rest pavilion and central sand/games ring',
      'Row of colourful festival food/game stalls & 6 wooden picnic tables',
      'Perimeter festival flagpoles & wide open grass run-off buffers'
    ],
    safetyNote: 'Each inflatable is wind-anchored and supervised by a dedicated attendant enforcing height/capacity limits.'
  },
  'celebration-stage': {
    id: 'celebration-stage',
    title: 'CELEBRATION STAGE',
    subtitle: 'Live Shows, Music & Seating',
    category: 'family',
    badgeColor: 'bg-purple-400 text-slate-950',
    status: 'Live Shows Hourly',
    ageGroup: 'All Ages',
    staffing: 'Stage & Sound Crew',
    camPos: { x: 10, y: 20, z: 22 },
    camTarget: { x: 10, y: 2, z: -1 },
    description: 'The heart of Bambino World! A professional black-truss outdoor amphitheatre stage with concert lighting, flanked by colourful festival feather flags, steel crowd-control barricades, and 4 organized blocks of audience seating on the central lawn.',
    features: [
      'Elevated covered truss stage with live LED backdrop & concert audio',
      '4 organized audience seating blocks (80+ seats) & front dance pit',
      'Galvanized steel festival crowd-control barricades along the stage front',
      'Flanked by 8 vibrant festival feather flags & central shade trees'
    ],
    safetyNote: 'Cable ramps protect all audio/power lines; volume levels are calibrated below 85 dB for young ears.'
  },
  'food-drinks': {
    id: 'food-drinks',
    title: 'BAMBINO SELF-CATERED FOOD & DRINKS',
    subtitle: 'Refreshment & Catering Tents',
    category: 'family',
    badgeColor: 'bg-yellow-300 text-slate-950',
    status: 'Serving Fresh',
    ageGroup: 'All Visitors',
    staffing: 'Catering & Hygiene Crew',
    camPos: { x: 38, y: 22, z: 8 },
    camTarget: { x: 25, y: 0, z: -8 },
    description: 'Conveniently distributed along the eastern edge of the lawn and southern court plaza, these blue and white catering gazebos provide kid-friendly meals, cold drinks, ice cream, and self-catered family picnic support.',
    features: [
      'Twin blue catering gazebos on the East Lawn near Adventure Zone',
      'Large white refreshment & service marquees in the South-East sector',
      'Hand-washing stations, waste-sorting bins, and shaded serveries',
      'Allergen-labelled kid snack boxes & chilled hydration points'
    ],
    safetyNote: 'Cooking/warming equipment is cordoned behind service counters away from guest walkways.'
  },
  'discovery-world': {
    id: 'discovery-world',
    title: 'DISCOVERY WORLD',
    subtitle: '(Science, Puzzles, & Giant Play)',
    category: '3-6y',
    badgeColor: 'bg-pink-400 text-slate-950',
    status: 'Interactive STEM',
    ageGroup: '3 – 6+ Yrs',
    staffing: '4 STEM Educators',
    camPos: { x: 38, y: 20, z: 22 },
    camTarget: { x: 24, y: 0, z: 6 },
    description: 'Positioned along the lower-right garden lawn, Discovery World sparks curiosity with hands-on science experiments, a colorful carnival puzzle tent, giant lawn Jenga & Connect-4 games, and sensory discovery tables.',
    features: [
      'Red, yellow & blue striped Discovery Carnival Tent',
      'White STEM & Giant Puzzle pavilion with interactive experiment tables',
      'Oversized lawn games, giant building blocks & sensory stations',
      'Guided curved dotted walkway leading directly from Celebration Stage'
    ],
    safetyNote: 'All science experiments use 100% non-toxic, food-grade ingredients.'
  },
  'staff-parking': {
    id: 'staff-parking',
    title: 'STAFF PARKING / VEHICULAR EXIT ROUTE',
    subtitle: '(no event activities there)',
    category: 'safety',
    badgeColor: 'bg-orange-400 text-slate-950',
    status: 'Restricted • Staff Only',
    ageGroup: 'No Public Access',
    staffing: 'Traffic Marshals',
    camPos: { x: 26, y: 28, z: 50 },
    camTarget: { x: 24, y: 0, z: 26 },
    description: 'The South-East paved sporting complex (containing the angled dual basketball court and giant outdoor chessboard) is strictly cordoned off with an orange safety fence during the event to serve as back-of-house staff staging and the vehicular exit buffer.',
    features: [
      'Enclosed by a continuous orange safety boundary fence & jersey barriers',
      'Paved dual basketball court & giant 8x8 chessboard landmark',
      '3 white back-of-house logistics & staff support marquees',
      'Zero public or child event activities permitted in this sector'
    ],
    safetyNote: 'Separated from festival lawns by an orange safety perimeter fence and marshalled barrier line.'
  },
  'vehicular-exit': {
    id: 'vehicular-exit',
    title: 'VEHICULAR EXIT ONLY',
    subtitle: '(Avoid Safety Hazards)',
    category: 'safety',
    badgeColor: 'bg-red-400 text-slate-950',
    status: 'Controlled Exit',
    ageGroup: 'Vehicles Only',
    staffing: 'Gate Security',
    camPos: { x: 18, y: 22, z: 54 },
    camTarget: { x: 14, y: 0, z: 35 },
    description: 'Dedicated one-way vehicular egress chute along the southern boundary road. Protected by an animated red-and-white mechanical boom barrier gate, flashing amber beacon, speed bump, traffic cones, and interlocking red-and-white water-filled Jersey barriers.',
    features: [
      'Animated red-and-white mechanical boom gate with flashing amber beacon',
      'Interlocking red-and-white Jersey barriers & speed bump',
      'Bold 3D white directional ground arrow marking the exit lane',
      'Strictly segregated from the South-West Main Pedestrian Entrance'
    ],
    safetyNote: 'Pedestrians are prohibited from walking down the vehicular exit chute.'
  }
};

export const CALLOUT_ITEMS: CalloutItem[] = [
  {
    id: 'callout-pond-top',
    zoneId: 'fish-pond',
    icon: '🐟',
    shortTitle: 'Fish Pond',
    title: 'EXISTING FISH POND',
    lines: ['(Fenced / Supervised)'],
    tooltipDesc: 'Natural farm pond fully enclosed with 48-post safety wire barrier and rescue lifebuoy ring.',
    theme: 'theme-white',
    anchor3D: [-34, 0.5, -31],
    label3D:  [-57, 4.0, -33]
  },
  {
    id: 'callout-little-garden',
    zoneId: 'little-garden',
    icon: '👶',
    shortTitle: 'Baby Garden',
    title: 'THE LITTLE GARDEN',
    lines: ['(Baby Garden - 6M to 2 Yrs)', 'Soft play setups, Shade tents.'],
    tooltipDesc: 'Calm sensory sanctuary for 6M–2Y babies: bougainvillea pergola, 6 shade gazebos, and padded foam mats.',
    theme: 'theme-green',
    anchor3D: [-33, 1.2, -9],
    label3D:  [-57, 4.5, -19]
  },
  {
    id: 'callout-pond-mid',
    zoneId: 'fish-pond',
    icon: '🐟',
    shortTitle: 'Fish Pond Bank',
    title: 'EXISTING FISH POND',
    lines: ['(Fenced / Supervised)'],
    tooltipDesc: 'Supervised southern bank overlook. Double-latched security perimeter with safety marshals on duty.',
    theme: 'theme-white',
    anchor3D: [-38, 1.0, -4],
    label3D:  [-58, 3.5, -3]
  },
  {
    id: 'callout-pool-left',
    zoneId: 'swimming-pool',
    icon: '🏊',
    shortTitle: 'Pool Enclosure',
    title: 'SWIMMING POOL',
    lines: ['(SECURELY FENCED / No-Buffer)'],
    tooltipDesc: 'Wrought-iron spear picket enclosure with locked gates, certified lifeguard, and rescue equipment.',
    theme: 'theme-white',
    anchor3D: [-31, 0.8, 15],
    label3D:  [-58, 3.0, 10]
  },
  {
    id: 'callout-info-adverts',
    zoneId: 'info-adverts',
    icon: '📺',
    shortTitle: 'Info & LED',
    title: 'BAMBINO WORLD INFO & ADVERTS',
    lines: ['LED digital event slides'],
    tooltipDesc: 'High-brightness twin-pillar outdoor LED screen broadcasting live stage timetables and safety alerts.',
    theme: 'theme-white',
    anchor3D: [-39, 3.8, 24],
    label3D:  [-59, 2.5, 22]
  },
  {
    id: 'callout-creative-zone',
    zoneId: 'creative-zone',
    icon: '🎨',
    shortTitle: 'Skating & Art',
    title: 'CREATIVE ZONE',
    lines: ['(Skating Pit)'],
    tooltipDesc: 'Smooth roller-skating pit with blue safety boarding, complimentary helmets, and face-painting pavilions.',
    theme: 'theme-white',
    anchor3D: [-35, 0.8, 33],
    label3D:  [-58, 2.0, 33]
  },
  {
    id: 'callout-main-entrance',
    zoneId: 'main-entrance',
    icon: '🎟️',
    shortTitle: 'Entrance Gate',
    title: 'MAIN ENTRANCE / REGISTRATION',
    lines: ['(To Event)'],
    tooltipDesc: 'Primary welcome archway with QR ticket scanning, fast-track registration, and child ID wristband stations.',
    theme: 'theme-white',
    anchor3D: [-38, 0.5, 41],
    label3D:  [-56, 1.2, 43]
  },
  {
    id: 'callout-parents-lounge',
    zoneId: 'parents-lounge',
    icon: '☕',
    shortTitle: 'Parents Lounge',
    title: "PARENTS' MEETING & LOUNGE",
    lines: [],
    tooltipDesc: '5 shaded pyramid gazebos with café tables, charging ports, complimentary water, and baby care amenities.',
    theme: 'theme-peach',
    anchor3D: [-26, 1.2, 32],
    label3D:  [-17, 1.0, 46]
  },
  {
    id: 'callout-pool-bottom',
    zoneId: 'swimming-pool',
    icon: '🛑',
    shortTitle: 'Safety Buffer',
    title: 'SWIMMING POOL BUFFER',
    lines: ['(SECURELY FENCED /', 'NO-ENTRY SAFETY BUFFER)'],
    tooltipDesc: 'High-visibility red-and-white safety buffer zone keeping all pedestrian crowd paths safely clear of pool fence.',
    theme: 'theme-white',
    anchor3D: [-23, 0.5, 17],
    label3D:  [-1, 1.5, 37]
  },
  {
    id: 'callout-celebration-stage',
    zoneId: 'celebration-stage',
    icon: '🎪',
    shortTitle: 'Stage Shows',
    title: 'CELEBRATION STAGE',
    lines: [],
    tooltipDesc: 'Covered truss stage, live concert sound, Zimbabwean marimba, floating soap bubbles, and 80+ lawn seats.',
    theme: 'theme-white',
    anchor3D: [10, 2.2, 0],
    label3D:  [10, 2.5, 9.5]
  },
  {
    id: 'callout-adventure-zone',
    zoneId: 'adventure-zone',
    icon: '🏰',
    shortTitle: 'Adventure (3-6Y)',
    title: 'ADVENTURE ZONE',
    lines: ['(3-6 Yrs)'],
    tooltipDesc: '5 giant inflatable bouncy castles, dual-lane slides, timber agility logs, carnival games, and picnic tables.',
    theme: 'theme-peach',
    anchor3D: [21, 1.5, -24],
    label3D:  [47, 4.5, -31]
  },
  {
    id: 'callout-food-top',
    zoneId: 'food-drinks',
    icon: '🍕',
    shortTitle: 'Food & Treats',
    title: 'BAMBINO FOOD & DRINKS',
    lines: [],
    tooltipDesc: 'North-East catering gazebos with kid-friendly snacks, artisan waffle carts, ice cream, and sorting bins.',
    theme: 'theme-yellow',
    anchor3D: [26, 1.5, -13],
    label3D:  [51, 3.8, -16]
  },
  {
    id: 'callout-discovery-world',
    zoneId: 'discovery-world',
    icon: '🔬',
    shortTitle: 'Discovery Lab',
    title: 'DISCOVERY WORLD',
    lines: ['(Science, Puzzles, & Giant Play)'],
    tooltipDesc: 'Interactive STEM pavilions, 6x6m giant lawn chess, Connect-4, dinosaur fossil dig pit, and hands-on experiments.',
    theme: 'theme-white',
    anchor3D: [29, 1.0, 9],
    label3D:  [53, 3.0, -1]
  },
  {
    id: 'callout-food-bottom',
    zoneId: 'food-drinks',
    icon: '🍹',
    shortTitle: 'Refreshments',
    title: 'BAMBINO FOOD & DRINKS',
    lines: [],
    tooltipDesc: 'Southern refreshment hub: cold drink chillers, fresh fruit juice bar, and shaded family dining tables.',
    theme: 'theme-peach',
    anchor3D: [26, 1.5, 19],
    label3D:  [53, 2.5, 13]
  },
  {
    id: 'callout-staff-parking',
    zoneId: 'staff-parking',
    icon: '🏀',
    shortTitle: 'Staff Court',
    title: 'STAFF PARKING / BASKETBALL COURT',
    lines: ['(no event activities there)'],
    tooltipDesc: 'Reserved staff logistics, basketball hoops, and emergency vehicle lane. No public festival activities.',
    theme: 'theme-white',
    anchor3D: [28, 0.5, 30],
    label3D:  [53, 1.8, 27]
  },
  {
    id: 'callout-vehicular-exit',
    zoneId: 'vehicular-exit',
    icon: '🚗',
    shortTitle: 'Vehicle Exit',
    title: 'VEHICULAR EXIT ONLY',
    lines: ['(Avoid Safety Hazards)'],
    tooltipDesc: 'One-way motorized egress route with safety speed-bumps and electronic boom barrier.',
    theme: 'theme-white',
    anchor3D: [15, 0.5, 37],
    label3D:  [48, 1.0, 44]
  }
];

export const PROGRAMME_SESSIONS: ProgrammeSession[] = [
  { id: 'stage-1', zone: 'stage', zoneName: 'Celebration Stage', start: '10:00', end: '10:30', title: 'Grand Welcome & Wonder Day Opening', description: 'Opening ceremony with music, mascots, and site orientation.' },
  { id: 'baby-1', zone: 'baby', zoneName: 'The Little Garden', start: '10:30', end: '11:00', title: 'Storytelling in the Garden', description: 'Gentle picture-book reading under the bougainvillea pergolas.' },
  { id: 'adventure-1', zone: 'adventure', zoneName: 'Adventure Zone', start: '10:30', end: '11:15', title: 'Bouncy Castle Jump Jam', description: 'Supervised inflatable jumping, slides, and tag games for 3–6s.' },
  { id: 'creative-1', zone: 'creative', zoneName: 'Creative Zone', start: '10:30', end: '11:15', title: 'Painting Little Masterpieces', description: 'Washable watercolors, easel art, and canvas keepsakes.' },
  { id: 'discovery-1', zone: 'discovery', zoneName: 'Discovery World', start: '10:30', end: '11:15', title: 'Science Lab: Colour Mixing & Potions', description: 'Hands-on sensory color laboratory with test tubes and droppers.' },
  { id: 'baby-2', zone: 'baby', zoneName: 'The Little Garden', start: '11:30', end: '12:00', title: 'Soft Play & Tiny Discoveries', description: 'Foam obstacle crawling, sensory blocks, and ball pool fun.' },
  { id: 'adventure-2', zone: 'adventure', zoneName: 'Adventure Zone', start: '11:30', end: '12:00', title: 'Meet The Farm Animals', description: 'Gentle, supervised petting session with farm bunnies and chicks.' },
  { id: 'creative-2', zone: 'creative', zoneName: 'Creative Zone', start: '11:30', end: '12:00', title: 'Friendship Bracelet Weaving', description: 'Colorful beaded bracelets and wearable festival art.' },
  { id: 'discovery-2', zone: 'discovery', zoneName: 'Discovery World', start: '11:30', end: '12:00', title: 'Mini Volcano Eruptions', description: 'Exciting fizzy baking soda & vinegar mountain explosions!' },
  { id: 'stage-2', zone: 'stage', zoneName: 'Celebration Stage', start: '12:00', end: '13:00', title: 'Family Lunch & Acoustic Marimba Beats', description: 'Catered lunch packages, chilled juice, and live Zimbabwean marimba music.' },
  { id: 'baby-3', zone: 'baby', zoneName: 'The Little Garden', start: '13:00', end: '13:30', title: 'Toys & Foam Pool Splash', description: 'Sensory water-free bubble and ball pool play for toddlers.' },
  { id: 'adventure-3', zone: 'adventure', zoneName: 'Adventure Zone', start: '13:00', end: '13:45', title: 'Giant Tic-Tac-Toe & Hoop Shooting', description: 'Friendly group lawn tournaments with awards for teamwork.' },
  { id: 'creative-3', zone: 'creative', zoneName: 'Creative Zone', start: '13:00', end: '13:45', title: 'Clay Sculpture & Arts Workshop', description: 'Non-toxic modeling clay, stamps, and nature impressions.' },
  { id: 'discovery-3', zone: 'discovery', zoneName: 'Discovery World', start: '13:00', end: '13:45', title: 'Cardboard Rockets & Lunar Rover Build', description: 'Design wearable space gear and race recycled cars.' },
  { id: 'creative-4', zone: 'creative', zoneName: 'Creative Zone', start: '14:00', end: '14:45', title: 'Roller-Skate Dance & Obstacle Jam', description: 'Gliding sessions with helmets, knee pads, and fun coaching.' },
  { id: 'discovery-4', zone: 'discovery', zoneName: 'Discovery World', start: '14:00', end: '14:45', title: 'Planting Sunflower Seed Pots', description: 'Every child plants a biodegradable flower pot to grow at home.' },
  { id: 'stage-3', zone: 'stage', zoneName: 'Celebration Stage', start: '14:45', end: '15:30', title: 'Magic, Clown & Floating Bubble Show', description: 'Hilarious family entertainment with comedy, puppets, and giant soap bubbles.' },
  { id: 'baby-4', zone: 'baby', zoneName: 'The Little Garden', start: '14:30', end: '15:00', title: 'Afternoon Fairy Tale Storytime', description: 'Cozy listening circle with plush cushions and fruit snacks.' },
  { id: 'adventure-4', zone: 'adventure', zoneName: 'Adventure Zone', start: '15:00', end: '15:45', title: 'Giant Obstacle Course Challenge', description: 'Safe agility courses across inflatables and grass sprints.' },
  { id: 'discovery-5', zone: 'discovery', zoneName: 'Discovery World', start: '15:30', end: '16:00', title: 'Giant Lawn Chess & Jenga Battle', description: 'Team puzzle showdown on the 6x6m outdoor chessboard.' },
  { id: 'stage-4', zone: 'stage', zoneName: 'Celebration Stage', start: '16:00', end: '16:30', title: 'Family Dance-Off & Freeze Dance', description: 'High-energy musical dance games for parents and kids alike.' },
  { id: 'stage-5', zone: 'stage', zoneName: 'Celebration Stage', start: '16:30', end: '17:00', title: 'Passport Stamp Ceremony & Goodie Bags', description: 'Awarding the Bambino Explorer medals and farewell celebration.' }
];

export const TICKET_PRICES = {
  earlyBird: 25,
  standard: 30,
  gate: 35,
};

export const SIBLING_DISCOUNTS: Record<number, number> = {
  1: 25,
  2: 45,
  3: 60,
  4: 70,
};

export const TICKET_INCLUSIONS = [
  'Fresh, balanced child lunch & juice box',
  'Unlimited freshly spun candyfloss & artisan waffles',
  'Complimentary popcorn pack',
  'Full face painting & temporary glitter tattoos',
  'Complete access to all 5 age-graded play zones',
  'Roller-skating pit access with helmets & pads',
  'All science experiments & take-home plant pot',
  'Official Bambino Explorer Passport & medal',
  'Complimentary admission for children 2 and under (with sibling)'
];
