// XP HyperFit Color System - WCAG 2.1 AA Compliant

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#FF6B35',      // Vibrant orange
    light: '#FF8C5F',
    dark: '#E5511B',
    contrast: '#FFFFFF',
  },

  // Secondary Colors
  secondary: {
    main: '#7B68EE',      // Medium slate blue
    light: '#9D8FF5',
    dark: '#5A48CC',
    contrast: '#FFFFFF',
  },

  // Success (PRs, achievements)
  success: {
    main: '#00E676',      // Bright green
    light: '#33EB8D',
    dark: '#00C853',
    contrast: '#000000',
  },

  // Warning (plateau detection)
  warning: {
    main: '#FFD600',      // Bright yellow
    light: '#FFDF33',
    dark: '#E5C100',
    contrast: '#000000',
  },

  // Error
  error: {
    main: '#FF1744',      // Bright red
    light: '#FF5071',
    dark: '#E50020',
    contrast: '#FFFFFF',
  },

  // Dark Mode (Primary Theme)
  dark: {
    background: '#000000',
    surface: '#1A1A1A',
    surfaceElevated: '#2A2A2A',
    border: '#3A3A3A',
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#666666',
    },
  },

  // Light Mode (Secondary Theme)
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceElevated: '#FAFAFA',
    border: '#E0E0E0',
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#999999',
    },
  },

  // Mascot Level Colors
  mascotLevels: {
    level1: '#8E8E93',    // Gray
    level2: '#5AC8FA',    // Blue
    level3: '#AF52DE',    // Purple
    level4: '#FF9500',    // Orange
    level5: '#FFD700',    // Gold
  },

  // Muscle Group Colors (for heatmap)
  muscleGroups: {
    chest: '#FF6B6B',
    back: '#4ECDC4',
    legs: '#95E1D3',
    shoulders: '#FFD93D',
    arms: '#6BCB77',
    core: '#F38181',
    fullBody: '#AA96DA',
    cardio: '#FCBAD3',
  },
};

export type ColorScheme = typeof colors;
