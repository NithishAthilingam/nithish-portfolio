import React from 'react';

// Ohio State Block 'O' Logo
export function OhioStateLogo({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="16" fill="#BA0C2F" />
      <path
        d="M32 20H68L80 32V68L68 80H32L20 68V32L32 20Z"
        fill="#A7B1B7"
      />
      <path
        d="M35 24H65L74 33V67L65 76H35L26 67V33L35 24Z"
        fill="#BA0C2F"
      />
      <path
        d="M44 38H56L62 44V56L56 62H44L38 56V44L44 38Z"
        fill="#FFFFFF"
      />
      <path
        d="M45 40H55L60 45V55L55 60H45L40 55V45L45 40Z"
        fill="#BA0C2F"
      />
    </svg>
  );
}

// Northrop Grumman emblem
export function NorthropGrummanLogo({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="16" fill="#002D62" />
      {/* Chevron flight mark */}
      <path
        d="M25 65L50 30L75 65L62 65L50 46L38 65H25Z"
        fill="#FFFFFF"
      />
      <path
        d="M35 72L50 51L65 72H56L50 63L44 72H35Z"
        fill="#00A3E0"
      />
    </svg>
  );
}

// Battelle Italic signature emblem
export function BattelleLogo({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="16" fill="#004B87" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="52"
        fill="#FFFFFF"
      >
        B
      </text>
    </svg>
  );
}

// AdVon Commerce Logo
export function AdVonLogo({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="16" fill="#1E293B" />
      <path
        d="M30 70L50 25L70 70H58L50 50L42 70H30Z"
        fill="#38BDF8"
      />
      <circle cx="50" cy="38" r="6" fill="#818CF8" />
    </svg>
  );
}

// Microsoft Logo
export function MicrosoftLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

// Bloomberg Logo
export function BloombergLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#000000" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="15"
        fill="#FFFFFF"
      >
        B
      </text>
    </svg>
  );
}
