import { ZoneData, CalloutItem, ProgrammeSession } from '../types/festival';

export const ZONES_DATA: Record<string, ZoneData> = {
  'little-garden': {
    id: 'little-garden',
    title: 'The Little Garden',
    subtitle: 'Baby Garden (6M to 2 Yrs)',
    category: '6m-2y',
    badgeColor: 'bg-emerald-400 text-slate-950',
    status: 'Baby Sanctuary',
    ageGroup: '6M – 2 Yrs',
    staffing: 'Early-Years Staff',
    camPos: { x: -28, y: 24, z: 18 },
    camTarget: { x: -28, y: 0, z: -4 },
    description: 'A calm, shaded sensory sanctuary for babies and toddlers with soft-play foam shapes and shaded play mats.',
    features: [
      'Soft-play foam climbing shapes',
      'Shaded baby crawling mats',
      'Shoe-free enclosed area'
    ],
    safetyNote: 'Shoe-free padded area with dedicated early-years attendants.'
  },
  'adventure-zone': {
    id: 'adventure-zone',
    title: 'Adventure Zone',
    subtitle: 'Active Play (3 to 6 Yrs)',
    category: '3-6y',
    badgeColor: 'bg-orange-400 text-slate-950',
    status: 'Active Play',
    ageGroup: '3 – 6 Yrs',
    staffing: 'Play Marshals',
    camPos: { x: 10, y: 28, z: -2 },
    camTarget: { x: 10, y: 1, z: -28 },
    description: 'An expansive green lawn featuring bouncy castles, inflatable slides, carnival games, and supervised animal petting.',
    features: [
      'Bouncy castles & slides',
      'Gentle animal petting',
      'Carnival lawn games'
    ],
    safetyNote: 'Dedicated safety marshals stationed at every inflatable.'
  },
  'creative-zone': {
    id: 'creative-zone',
    title: 'Creative Zone',
    subtitle: 'Arts & Crafts Studio',
    category: '3-6y',
    badgeColor: 'bg-cyan-400 text-slate-950',
    status: 'Open Studio',
    ageGroup: '3 – 6+ Yrs',
    staffing: 'Creative Mentors',
    camPos: { x: -34, y: 18, z: 48 },
    camTarget: { x: -35, y: 0, z: 33 },
    description: 'A shaded open-air studio where children explore washable painting, friendship bracelets, and fun spelling games.',
    features: [
      'Washable easel painting',
      'Friendship bracelet crafting',
      'Fun spelling activities'
    ],
    safetyNote: 'All materials are child-safe, washable, and non-toxic.'
  },
  'discovery-world': {
    id: 'discovery-world',
    title: 'Discovery World',
    subtitle: 'STEM & Curiosity',
    category: '3-6y',
    badgeColor: 'bg-pink-400 text-slate-950',
    status: 'Hands-On Discovery',
    ageGroup: '3 – 6+ Yrs',
    staffing: 'STEM Educators',
    camPos: { x: 38, y: 20, z: 22 },
    camTarget: { x: 24, y: 0, z: 6 },
    description: 'Hands-on discovery hub featuring mini-volcano experiments, cardboard rocket crafts, and giant lawn chess.',
    features: [
      'Mini-volcano science experiments',
      'Cardboard rocket crafts',
      'Giant outdoor lawn chess'
    ],
    safetyNote: 'Safe, hands-on scientific discovery with food-grade ingredients.'
  },
  'celebration-stage': {
    id: 'celebration-stage',
    title: 'Celebration Stage',
    subtitle: 'Live Music & Shows',
    category: 'family',
    badgeColor: 'bg-purple-400 text-slate-950',
    status: 'Live Shows',
    ageGroup: 'All Ages',
    staffing: 'Performance Team',
    camPos: { x: 10, y: 20, z: 22 },
    camTarget: { x: 10, y: 2, z: -1 },
    description: 'The musical heart of the festival with live marimba tunes, puppet storytelling, and family sing-alongs.',
    features: [
      'Live marimba concerts',
      'Puppet storytelling & theatre',
      'Interactive family dance-offs'
    ],
    safetyNote: 'Sound levels calibrated comfortably for young ears.'
  },
  'parents-lounge': {
    id: 'parents-lounge',
    title: "Parents' Lounge",
    subtitle: 'Rest & Shaded Gazebos',
    category: 'family',
    badgeColor: 'bg-orange-300 text-slate-950',
    status: 'Relaxation Area',
    ageGroup: 'Parents & Families',
    staffing: 'Hospitality Staff',
    camPos: { x: -24, y: 20, z: 46 },
    camTarget: { x: -26, y: 0, z: 28 },
    description: 'Shaded seating gazebos where parents can relax, recharge, and watch over nearby play zones.',
    features: [
      'Shaded gazebo seating',
      'Stroller parking & baby care',
      'Hydration station'
    ],
    safetyNote: 'Quiet family rest area with stroller parking.'
  },
  'food-drinks': {
    id: 'food-drinks',
    title: 'Food & Refreshments',
    subtitle: 'Lunch, Snacks & Drinks',
    category: 'family',
    badgeColor: 'bg-yellow-300 text-slate-950',
    status: 'All Day',
    ageGroup: 'All Visitors',
    staffing: 'Catering Team',
    camPos: { x: 38, y: 22, z: 8 },
    camTarget: { x: 25, y: 0, z: -8 },
    description: 'Healthy kid snack boxes, fruit cups, ice cream, cold juices, and shaded family picnic tables on the lawn.',
    features: [
      'Included kid lunch & juice',
      'Ice cream & fresh treats',
      'Shaded picnic tables'
    ],
    safetyNote: 'Clear allergen labelling provided on all food options.'
  },
  'fish-pond': {
    id: 'fish-pond',
    title: 'Fish Pond',
    subtitle: 'Fenced Nature Landmark',
    category: 'safety',
    badgeColor: 'bg-emerald-400 text-slate-950',
    status: 'Fenced Landmark',
    ageGroup: 'Perimeter Landmark',
    staffing: 'Perimeter Marshals',
    camPos: { x: -31, y: 26, z: -2 },
    camTarget: { x: -31, y: 0, z: -28 },
    description: 'A natural farm pond enclosed by a protective safety fence with mature shade trees along the perimeter.',
    features: [
      'Secure perimeter safety fence',
      'Scenic shaded trees',
      'Supervised boundary'
    ],
    safetyNote: 'Enclosed safety barrier; viewable from the pedestrian walkway.'
  },
  'swimming-pool': {
    id: 'swimming-pool',
    title: 'Swimming Pool (Restricted)',
    subtitle: 'Secured Buffer Area',
    category: 'safety',
    badgeColor: 'bg-sky-400 text-slate-950',
    status: 'Restricted Area',
    ageGroup: 'No Entry',
    staffing: 'Safety Team',
    camPos: { x: -26, y: 24, z: 38 },
    camTarget: { x: -26, y: 0, z: 17 },
    description: 'The farm swimming pool is securely fenced off as a restricted safety buffer with no guest entry during the event.',
    features: [
      'Locked safety fence',
      'Buffered walkway',
      'Safety patrol'
    ],
    safetyNote: 'Restricted safety area with zero event access.'
  },
  'main-entrance': {
    id: 'main-entrance',
    title: 'Main Entrance & Check-In',
    subtitle: 'Arrivals & Wristbands',
    category: 'family',
    badgeColor: 'bg-amber-400 text-slate-950',
    status: 'Welcome Area',
    ageGroup: 'All Visitors',
    staffing: 'Welcome Staff',
    camPos: { x: -42, y: 16, z: 54 },
    camTarget: { x: -37, y: 1, z: 40 },
    description: 'The festival welcome gate for quick ticket check-in, color-coded wristbands, and event assistance.',
    features: [
      'Fast QR check-in',
      'Child safety wristbands',
      'Information & maps'
    ],
    safetyNote: 'Matching parent-child wristbands provided upon arrival.'
  },
  'info-adverts': {
    id: 'info-adverts',
    title: 'Info & Timetable',
    subtitle: 'Event Schedules',
    category: 'family',
    badgeColor: 'bg-indigo-400 text-slate-950',
    status: 'Live Updates',
    ageGroup: 'All Visitors',
    staffing: 'Information Desk',
    camPos: { x: -35, y: 15, z: 40 },
    camTarget: { x: -39, y: 3.5, z: 24 },
    description: 'Event notice board displaying stage timetables, weather reminders, and announcements.',
    features: [
      'Live showtimes',
      'Sun-safety reminders',
      'Festival announcements'
    ],
    safetyNote: 'Customer service desk and lost-and-found support.'
  },
  'staff-parking': {
    id: 'staff-parking',
    title: 'Logistics & Operations',
    subtitle: 'Staff Area Only',
    category: 'safety',
    badgeColor: 'bg-slate-400 text-slate-950',
    status: 'Staff Only',
    ageGroup: 'Staff Access',
    staffing: 'Event Operations',
    camPos: { x: 26, y: 28, z: 50 },
    camTarget: { x: 24, y: 0, z: 26 },
    description: 'Back-of-house logistics area reserved for crew and emergency services.',
    features: [
      'Operations support',
      'First aid post',
      'No public access'
    ],
    safetyNote: 'Restricted to festival crew.'
  },
  'vehicular-exit': {
    id: 'vehicular-exit',
    title: 'Vehicular Exit',
    subtitle: 'One-Way Exit Road',
    category: 'safety',
    badgeColor: 'bg-red-400 text-slate-950',
    status: 'Vehicle Egress',
    ageGroup: 'Vehicles Only',
    staffing: 'Traffic Control',
    camPos: { x: 18, y: 22, z: 54 },
    camTarget: { x: 14, y: 0, z: 35 },
    description: 'One-way vehicle egress lane safely separated from all pedestrian lawns.',
    features: [
      'Boom barrier exit',
      'Separated from footpaths',
      'Traffic marshals'
    ],
    safetyNote: 'Pedestrians prohibited on exit lane.'
  }
};

export const CALLOUT_ITEMS: CalloutItem[] = [
  {
    id: 'callout-pond-top',
    zoneId: 'fish-pond',
    icon: '🐟',
    shortTitle: 'Fish Pond',
    title: 'Fish Pond',
    lines: ['Fenced Landmark'],
    tooltipDesc: 'Natural farm pond enclosed by a protective safety fence.',
    theme: 'theme-white',
    anchor3D: [-34, 0.5, -31],
    label3D:  [-57, 4.0, -33]
  },
  {
    id: 'callout-little-garden',
    zoneId: 'little-garden',
    icon: '👶',
    shortTitle: 'Baby Garden',
    title: 'The Little Garden',
    lines: ['6M – 2 Yrs'],
    tooltipDesc: 'Calm sensory sanctuary with soft play foam blocks and shaded crawling mats.',
    theme: 'theme-green',
    anchor3D: [-33, 1.2, -9],
    label3D:  [-57, 4.5, -19]
  },
  {
    id: 'callout-pond-mid',
    zoneId: 'fish-pond',
    icon: '🐟',
    shortTitle: 'Fish Pond',
    title: 'Fish Pond',
    lines: ['Perimeter Buffer'],
    tooltipDesc: 'Supervised safety boundary along the pond perimeter.',
    theme: 'theme-white',
    anchor3D: [-38, 1.0, -4],
    label3D:  [-58, 3.5, -3]
  },
  {
    id: 'callout-pool-left',
    zoneId: 'swimming-pool',
    icon: '🏊',
    shortTitle: 'Pool (Locked)',
    title: 'Swimming Pool',
    lines: ['No Entry Buffer'],
    tooltipDesc: 'Locked swimming pool enclosure with zero public access.',
    theme: 'theme-white',
    anchor3D: [-31, 0.8, 15],
    label3D:  [-58, 3.0, 10]
  },
  {
    id: 'callout-info-adverts',
    zoneId: 'info-adverts',
    icon: '📺',
    shortTitle: 'Info & Notice',
    title: 'Info & Timetable',
    lines: ['Schedules & Alerts'],
    tooltipDesc: 'Display board with stage schedules and announcements.',
    theme: 'theme-white',
    anchor3D: [-39, 3.8, 24],
    label3D:  [-59, 2.5, 22]
  },
  {
    id: 'callout-creative-zone',
    zoneId: 'creative-zone',
    icon: '🎨',
    shortTitle: 'Creative Zone',
    title: 'Creative Zone',
    lines: ['Arts & Crafts'],
    tooltipDesc: 'Open art studio with painting, bracelet making, and spelling activities.',
    theme: 'theme-white',
    anchor3D: [-35, 0.8, 33],
    label3D:  [-58, 2.0, 33]
  },
  {
    id: 'callout-main-entrance',
    zoneId: 'main-entrance',
    icon: '🎟️',
    shortTitle: 'Entrance',
    title: 'Main Entrance & Check-In',
    lines: ['Wristbands & Maps'],
    tooltipDesc: 'Main entry gate for ticket scanning and matching wristbands.',
    theme: 'theme-white',
    anchor3D: [-38, 0.5, 41],
    label3D:  [-56, 1.2, 43]
  },
  {
    id: 'callout-parents-lounge',
    zoneId: 'parents-lounge',
    icon: '☕',
    shortTitle: 'Parents Lounge',
    title: "Parents' Lounge",
    lines: ['Shaded Rest Area'],
    tooltipDesc: 'Shaded seating gazebos, stroller parking, and water station.',
    theme: 'theme-peach',
    anchor3D: [-26, 1.2, 32],
    label3D:  [-17, 1.0, 46]
  },
  {
    id: 'callout-pool-bottom',
    zoneId: 'swimming-pool',
    icon: '🛑',
    shortTitle: 'Pool Buffer',
    title: 'Safety Buffer',
    lines: ['Restricted Area'],
    tooltipDesc: 'Marked safety perimeter keeping walking paths clear of pool fence.',
    theme: 'theme-white',
    anchor3D: [-23, 0.5, 17],
    label3D:  [-1, 1.5, 37]
  },
  {
    id: 'callout-celebration-stage',
    zoneId: 'celebration-stage',
    icon: '🎪',
    shortTitle: 'Live Stage',
    title: 'Celebration Stage',
    lines: ['Marimba & Shows'],
    tooltipDesc: 'Live acoustic marimba, storytelling shows, and family dancing.',
    theme: 'theme-white',
    anchor3D: [10, 2.2, 0],
    label3D:  [10, 2.5, 9.5]
  },
  {
    id: 'callout-adventure-zone',
    zoneId: 'adventure-zone',
    icon: '🏰',
    shortTitle: 'Adventure Zone',
    title: 'Adventure Zone',
    lines: ['3 – 6 Yrs'],
    tooltipDesc: 'Inflatable bouncy castles, obstacle slides, and supervised animal petting.',
    theme: 'theme-peach',
    anchor3D: [21, 1.5, -24],
    label3D:  [47, 4.5, -31]
  },
  {
    id: 'callout-food-top',
    zoneId: 'food-drinks',
    icon: '🍕',
    shortTitle: 'Food & Treats',
    title: 'Food & Drinks',
    lines: ['Picnic Area'],
    tooltipDesc: 'Kid meals, juice boxes, ice cream, and shaded family picnic tables.',
    theme: 'theme-yellow',
    anchor3D: [26, 1.5, -13],
    label3D:  [51, 3.8, -16]
  },
  {
    id: 'callout-discovery-world',
    zoneId: 'discovery-world',
    icon: '🔬',
    shortTitle: 'Discovery World',
    title: 'Discovery World',
    lines: ['STEM & Games'],
    tooltipDesc: 'Mini-volcano science lab, cardboard rocket crafts, and giant lawn chess.',
    theme: 'theme-white',
    anchor3D: [29, 1.0, 9],
    label3D:  [53, 3.0, -1]
  },
  {
    id: 'callout-food-bottom',
    zoneId: 'food-drinks',
    icon: '🍹',
    shortTitle: 'Drinks & Snacks',
    title: 'Refreshments',
    lines: ['Cold Drinks'],
    tooltipDesc: 'Cold refreshments, fresh juices, and shaded outdoor dining tables.',
    theme: 'theme-peach',
    anchor3D: [26, 1.5, 19],
    label3D:  [53, 2.5, 13]
  },
  {
    id: 'callout-staff-parking',
    zoneId: 'staff-parking',
    icon: '🏀',
    shortTitle: 'Crew Court',
    title: 'Logistics & Operations',
    lines: ['Staff Area Only'],
    tooltipDesc: 'Staff parking, operations base, and first aid post.',
    theme: 'theme-white',
    anchor3D: [28, 0.5, 30],
    label3D:  [53, 1.8, 27]
  },
  {
    id: 'callout-vehicular-exit',
    zoneId: 'vehicular-exit',
    icon: '🚗',
    shortTitle: 'Vehicle Exit',
    title: 'Vehicular Exit',
    lines: ['One-Way Egress'],
    tooltipDesc: 'One-way vehicular exit road separated from pedestrian paths.',
    theme: 'theme-white',
    anchor3D: [15, 0.5, 37],
    label3D:  [48, 1.0, 44]
  }
];

export const PROGRAMME_SESSIONS: ProgrammeSession[] = [
  { id: 'stage-1', zone: 'stage', zoneName: 'Celebration Stage', start: '10:00', end: '10:30', title: 'Grand Welcome & Wonder Day Opening', description: 'Opening ceremony with music, mascots, and site orientation.' },
  { id: 'baby-1', zone: 'baby', zoneName: 'The Little Garden', start: '10:30', end: '11:00', title: 'Storytelling in the Garden', description: 'Gentle picture-book reading under shaded pergolas.' },
  { id: 'adventure-1', zone: 'adventure', zoneName: 'Adventure Zone', start: '10:30', end: '11:15', title: 'Bouncy Castle Jump Jam', description: 'Supervised inflatable jumping, slides, and games for 3–6s.' },
  { id: 'creative-1', zone: 'creative', zoneName: 'Creative Zone', start: '10:30', end: '11:15', title: 'Painting Little Masterpieces', description: 'Washable watercolors, easel art, and canvas keepsakes.' },
  { id: 'discovery-1', zone: 'discovery', zoneName: 'Discovery World', start: '10:30', end: '11:15', title: 'Science Lab: Colour Mixing & Potions', description: 'Hands-on sensory color laboratory with child-safe experiments.' },
  { id: 'baby-2', zone: 'baby', zoneName: 'The Little Garden', start: '11:30', end: '12:00', title: 'Soft Play & Tiny Discoveries', description: 'Foam obstacle crawling, sensory blocks, and ball pool fun.' },
  { id: 'adventure-2', zone: 'adventure', zoneName: 'Adventure Zone', start: '11:30', end: '12:00', title: 'Meet The Farm Animals', description: 'Gentle, supervised petting session with farm bunnies and chicks.' },
  { id: 'creative-2', zone: 'creative', zoneName: 'Creative Zone', start: '11:30', end: '12:00', title: 'Friendship Bracelet Weaving', description: 'Colorful beaded bracelets and wearable festival art.' },
  { id: 'discovery-2', zone: 'discovery', zoneName: 'Discovery World', start: '11:30', end: '12:00', title: 'Mini Volcano Eruptions', description: 'Exciting fizzy baking soda and vinegar mountain reactions.' },
  { id: 'stage-2', zone: 'stage', zoneName: 'Celebration Stage', start: '12:00', end: '13:00', title: 'Family Lunch & Acoustic Marimba Beats', description: 'Catered lunch packages, chilled juice, and live Zimbabwean marimba music.' },
  { id: 'baby-3', zone: 'baby', zoneName: 'The Little Garden', start: '13:00', end: '13:30', title: 'Toys & Foam Pool Fun', description: 'Sensory water-free bubble and ball pool play for toddlers.' },
  { id: 'adventure-3', zone: 'adventure', zoneName: 'Adventure Zone', start: '13:00', end: '13:45', title: 'Giant Lawn Games & Hoop Shooting', description: 'Friendly group lawn tournaments with awards for teamwork.' },
  { id: 'creative-3', zone: 'creative', zoneName: 'Creative Zone', start: '13:00', end: '13:45', title: 'Arts & Crafts Creative Workshop', description: 'Hands-on paper craft, festival crowns, and mixed media art.' },
  { id: 'creative-4', zone: 'creative', zoneName: 'Creative Zone', start: '14:00', end: '14:45', title: 'Fun Spelling Activities & Word Discovery', description: 'Interactive alphabet tiles, spelling games, and word challenges.' },
  { id: 'discovery-3', zone: 'discovery', zoneName: 'Discovery World', start: '13:00', end: '13:45', title: 'Cardboard Rockets Build', description: 'Design wearable space gear and aerodynamic rocket crafts.' },
  { id: 'discovery-4', zone: 'discovery', zoneName: 'Discovery World', start: '14:00', end: '14:45', title: 'Planting Sunflower Seed Pots', description: 'Every child plants a biodegradable flower pot to grow at home.' },
  { id: 'stage-3', zone: 'stage', zoneName: 'Celebration Stage', start: '14:45', end: '15:30', title: 'Magic, Clown & Floating Bubble Show', description: 'Family entertainment with comedy, puppets, and giant soap bubbles.' },
  { id: 'baby-4', zone: 'baby', zoneName: 'The Little Garden', start: '14:30', end: '15:00', title: 'Afternoon Fairy Tale Storytime', description: 'Cozy listening circle with plush cushions and fruit snacks.' },
  { id: 'adventure-4', zone: 'adventure', zoneName: 'Adventure Zone', start: '15:00', end: '15:45', title: 'Obstacle Course Challenge', description: 'Safe agility courses across inflatables and grass sprints.' },
  { id: 'discovery-5', zone: 'discovery', zoneName: 'Discovery World', start: '15:30', end: '16:00', title: 'Giant Lawn Chess & Jenga', description: 'Friendly puzzle showdown on the outdoor giant chessboard.' },
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
  'All creative arts, painting, bracelet making & spelling activities',
  'All science experiments & take-home plant pot',
  'Official Bambino Explorer Passport & medal',
  'Complimentary admission for children 2 and under (with sibling)'
];
