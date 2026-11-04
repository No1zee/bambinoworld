import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

/**
 * Bambino World Custom Storybook Icon Suite
 * Thick, friendly 2.5px-3px rounded strokes, pillowy silhouettes,
 * organic hand-drawn curves, and joyful warmth.
 */

// 1. Sprout (Little Garden / Nature / Growth)
export const BambinoSprout: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Soft Soil Base Mound */}
    <path
      d="M5 26C8.5 24 12 25 16 25C20 25 23.5 24 27 26"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    {/* Curving Stem */}
    <path
      d="M16 25V14C16 11 15 8 13 6"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    {/* Left Chubby Leaf */}
    <path
      d="M15.5 14C11.5 13.5 7 15.5 7.5 20C11.5 20.5 15.5 17.5 15.5 14Z"
      fill="#10B981"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    {/* Right Chubby Leaf */}
    <path
      d="M16 10C19.5 9 24.5 10.5 24.5 15C20.5 16 16.5 13 16 10Z"
      fill="#10B981"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Bouncy Castle (Adventure Arena)
export const BambinoCastle: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Left Turret */}
    <rect
      x="4"
      y="11"
      width="6"
      height="15"
      rx="2"
      fill="#FF6720"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path
      d="M3 11L7 4L11 11H3Z"
      fill="#FF6720"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {/* Right Turret */}
    <rect
      x="22"
      y="11"
      width="6"
      height="15"
      rx="2"
      fill="#FF6720"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path
      d="M21 11L25 4L29 11H21Z"
      fill="#FF6720"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {/* Main Middle Wall */}
    <path
      d="M10 15H22V26H10V15Z"
      fill="#F6BE00"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    {/* Center Arched Doorway */}
    <path
      d="M13 26V21C13 19.3431 14.3431 18 16 18C17.6569 18 19 19.3431 19 21V26"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    {/* Center Pennant Flag */}
    <path
      d="M16 15V8M16 8L19.5 10.5L16 13"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. Artist Palette (Creative & Discovery)
export const BambinoPalette: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Palette Body */}
    <path
      d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C18.2 28 19.5 26.5 19.5 24.5C19.5 23.5 19 22.8 19 22C19 20.8 20 19.8 21.2 19.8H23C26.87 19.8 30 16.67 30 12.8C30 7.94 23.73 4 16 4Z"
      fill="#D82374"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    {/* Thumb Hole */}
    <circle cx="21" cy="23.5" r="2" fill="currentColor" />
    {/* Paint Blobs */}
    <circle cx="10.5" cy="11.5" r="2.2" fill="#FF6720" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16.5" cy="9.5" r="2.2" fill="#00A3E0" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="22.5" cy="12.5" r="2.2" fill="#F6BE00" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="11.5" cy="18.5" r="2" fill="#D82374" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// 4. Carnival Ticket Stub (Passes / Booking)
export const BambinoTicket: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 ${className}`}
    {...props}
  >
    {/* Ticket Silhouette with Circular Notches */}
    <path
      d="M4 10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V13C26.3431 13 25 14.3431 25 16C25 17.6569 26.3431 19 28 19V22C28 23.1046 27.1046 24 26 24H6C4.89543 24 4 23.1046 4 22V19C5.65685 19 7 17.6569 7 16C7 14.3431 5.65685 13 4 13V10Z"
      fill="#F6BE00"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    {/* Dashed Perforation Line */}
    <path
      d="M12 9V23"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="2 3"
    />
    {/* Star Punchout on Ticket Body */}
    <path
      d="M20 12.5L20.9 14.5L23 14.8L21.4 16.3L21.8 18.5L20 17.4L18.2 18.5L18.6 16.3L17 14.8L19.1 14.5L20 12.5Z"
      fill="currentColor"
    />
  </svg>
);

// 5. Farm Tractor (Rides / The Little Farm)
export const BambinoTractor: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Cabin & Hood */}
    <path
      d="M7 16H15V10C15 8.89543 14.1046 8 13 8H9C7.89543 8 7 8.89543 7 10V16Z"
      fill="#00A3E0"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M15 13H24C25.1046 13 26 13.8954 26 15V19H15V13Z"
      fill="#00A3E0"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {/* Exhaust Pipe */}
    <path
      d="M23 13V7M23 7C23 6 24.5 5 25.5 5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Steering Wheel */}
    <path d="M12 11L14 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    {/* Big Rear Wheel */}
    <circle
      cx="9.5"
      cy="20.5"
      r="5.5"
      fill="#31006F"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2.6"
    />
    <circle cx="9.5" cy="20.5" r="2" fill="currentColor" />
    {/* Small Front Wheel */}
    <circle
      cx="22.5"
      cy="22.5"
      r="3.5"
      fill="#31006F"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    <circle cx="22.5" cy="22.5" r="1.3" fill="currentColor" />
  </svg>
);

// 6. Whimsical Compass (3D Grounds / Navigation)
export const BambinoCompass: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Outer Wobbly Circle */}
    <circle
      cx="16"
      cy="16"
      r="11.5"
      fill="#00A3E0"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2.6"
    />
    {/* Cardinal Pointers */}
    <circle cx="16" cy="6.5" r="1.5" fill="#FF6720" />
    <circle cx="25.5" cy="16" r="1.5" fill="#F6BE00" />
    <circle cx="16" cy="25.5" r="1.5" fill="#10B981" />
    <circle cx="6.5" cy="16" r="1.5" fill="#00A3E0" />
    {/* Compass Needle */}
    <path
      d="M16 9L18.5 16L16 23L13.5 16L16 9Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M16 9L18.5 16H13.5L16 9Z" fill="#FF6720" />
  </svg>
);

// 7. Warm Steaming Mug (Parents' Lounge / Comfort)
export const BambinoMug: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Cup Body */}
    <path
      d="M7 11H21V20C21 23.3137 18.3137 26 15 26H13C9.68629 26 7 23.3137 7 20V11Z"
      fill="#FF6720"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    {/* Handle */}
    <path
      d="M21 13.5H23.5C25.433 13.5 27 15.067 27 17C27 18.933 25.433 20.5 23.5 20.5H21"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Heart on Cup */}
    <path
      d="M14 16.5C13.5 15.5 12 15.5 11.5 16.5C11 17.5 14 19.5 14 19.5C14 19.5 17 17.5 16.5 16.5C16 15.5 14.5 15.5 14 16.5Z"
      fill="#FF6720"
    />
    {/* Steam Curls */}
    <path
      d="M11 7C11 5.5 12 4.5 11.5 3.5M16 8C16 6.5 17 5.5 16.5 4.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// 8. Security Badge / Shield (Wristbands & Medical)
export const BambinoShield: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-110 ${className}`}
    {...props}
  >
    {/* Shield Silhouette */}
    <path
      d="M16 4L6 8V16C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 16V8L16 4Z"
      fill="#10B981"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    {/* Friendly Checkmark */}
    <path
      d="M11 16L14.5 19.5L21 12"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 9. Joyful Sun (Morning Sparkle & Warmth)
export const BambinoSun: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-700 group-hover:rotate-90 group-hover:scale-110 ${className}`}
    {...props}
  >
    <circle
      cx="16"
      cy="16"
      r="6.5"
      fill="#F6BE00"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="2.6"
    />
    {/* Wobbly Wavy Rays */}
    <path d="M16 4V7M16 25V28M4 16H7M25 16H28" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M7.5 7.5L9.8 9.8M22.2 22.2L24.5 24.5M24.5 7.5L22.2 9.8M9.8 22.2L7.5 24.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

// 10. Star / Sparkle
export const BambinoSparkle: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 ${className}`}
    {...props}
  >
    <path
      d="M16 3C16 10 10 16 3 16C10 16 16 22 16 29C16 22 22 16 29 16C22 16 16 10 16 3Z"
      fill="#F6BE00"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
);

// 11. Soft Map Pin
export const BambinoPin: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${className}`}
    {...props}
  >
    <path
      d="M16 4C10.5 4 6 8.5 6 14C6 21 16 28 16 28C16 28 26 21 26 14C26 8.5 21.5 4 16 4Z"
      fill="#FF6720"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="13.5" r="3.5" fill="#F6BE00" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

// 12. Soft Desk Calendar
export const BambinoCalendar: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:scale-110 ${className}`}
    {...props}
  >
    <rect
      x="5"
      y="8"
      width="22"
      height="18"
      rx="3"
      fill="#00A3E0"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path d="M5 14H27" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M10 5V9M22 5V9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    {/* Dec 5 Heart Date Marker */}
    <circle cx="16" cy="19.5" r="2.2" fill="#D82374" />
  </svg>
);

// 13. Chunky Playful Arrow
export const BambinoArrow: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block transition-transform duration-300 group-hover:translate-x-1 ${className}`}
    {...props}
  >
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
