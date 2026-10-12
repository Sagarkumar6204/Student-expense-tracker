// mobile/src/theme.ts
// Soft Pastel Study Theme for Student Expense Tracker

export const colors = {
  // Primary Pastel Palette (User Specified)
  lightBlue: '#F4F8FF',
  mintGreen: '#E8F5EE',
  lavender: '#E9E7FF',
  warmCream: '#FFF3E5',

  // Backgrounds & Surface
  background: '#F9FAFC',
  cardBackground: '#FFFFFF',
  surfaceSoft: '#F4F8FF',

  // Text Colors (Dark & High Contrast for Readability)
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textLight: '#FFFFFF',

  // UI Accents
  primary: '#5B5CE5',       // Refined indigo/lavender primary
  primaryLight: '#E9E7FF',
  success: '#10B981',       // Mint success
  successSoft: '#E8F5EE',
  danger: '#EF4444',        // Error red
  dangerSoft: '#FEE2E2',
  border: '#E5E7EB',
  inputBorder: '#D1D5DB',

  // Category Theme Badges (Pastel Background + Distinct Dark Icon/Text)
  categories: {
    Food: {
      bg: '#FFF3E5',
      text: '#B45309',
      border: '#FED7AA',
      icon: '🍔',
    },
    Travel: {
      bg: '#F4F8FF',
      text: '#1D4ED8',
      border: '#BFDBFE',
      icon: '🚌',
    },
    Education: {
      bg: '#E9E7FF',
      text: '#6D28D9',
      border: '#DDD6FE',
      icon: '📚',
    },
    Shopping: {
      bg: '#FDF2F8',
      text: '#BE185D',
      border: '#FBCFE8',
      icon: '🛍️',
    },
    Other: {
      bg: '#E8F5EE',
      text: '#047857',
      border: '#A7F3D0',
      icon: '🏷️',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
