import { colors, ColorScheme } from './colors';
import { typography, Typography } from './typography';
import { spacing, touchTarget, Spacing } from './spacing';

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing & { touchTarget: typeof touchTarget };
  isDark: boolean;
}

// Light and Dark themes for future theme switching
export const lightTheme = {
  colors: colors,
  typography,
  spacing: { ...spacing, touchTarget },
  isDark: false,
} as const;

export const darkTheme = {
  colors: colors,
  typography,
  spacing: { ...spacing, touchTarget },
  isDark: true,
} as const;

export { colors, typography, spacing, touchTarget };
