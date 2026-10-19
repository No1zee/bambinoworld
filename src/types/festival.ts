export type ZoneId =
  | 'fish-pond'
  | 'little-garden'
  | 'swimming-pool'
  | 'info-adverts'
  | 'creative-zone'
  | 'main-entrance'
  | 'parents-lounge'
  | 'adventure-zone'
  | 'celebration-stage'
  | 'food-drinks'
  | 'discovery-world'
  | 'staff-parking'
  | 'vehicular-exit';

export interface ZoneData {
  id: ZoneId;
  title: string;
  subtitle: string;
  category: '6m-2y' | '3-6y' | 'family' | 'safety';
  badgeColor: string;
  status: string;
  ageGroup: string;
  staffing: string;
  camPos: { x: number; y: number; z: number };
  camTarget: { x: number; y: number; z: number };
  description: string;
  features: string[];
  safetyNote: string;
}

export interface CalloutItem {
  id: string;
  zoneId: ZoneId;
  icon: string;
  shortTitle: string;
  title: string;
  lines: string[];
  tooltipDesc: string;
  theme: 'theme-white' | 'theme-green' | 'theme-peach' | 'theme-yellow';
  anchor3D: [number, number, number];
  label3D: [number, number, number];
}

export interface ProgrammeSession {
  id: string;
  zone: string;
  zoneName: string;
  start: string;
  end: string;
  title: string;
  description?: string;
  age?: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketType: 'early-bird' | 'standard' | 'gate';
  adultCount: number;
  childCount: number;
  total: number;
  paymentMethod: 'ecocash' | 'pay-later' | 'gate';
  wristbandCode: string;
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  focusZone?: string | null;
}
