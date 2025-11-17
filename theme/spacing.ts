// Spacing System - 4px base unit

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Minimum touch target size (WCAG 2.1 AA)
export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
};

export type Spacing = typeof spacing;
