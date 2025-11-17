import { colors, ColorScheme } from './colors';
import { typography, Typography } from './typography';
import { spacing, touchTarget, Spacing } from './spacing';

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing & { touchTarget: typeof touchTarget };
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: {
    ...colors,
    background: colors.light.background,
    surface: colors.light.surface,
    surfaceElevated: colors.light.surfaceElevated,
    border: colors.light.border,
    text: colors.light.text,
  },
  typography,
  spacing: { ...spacing, touchTarget },
  isDark: false,
};

export const darkTheme: Theme = {
  colors: {
    ...colors,
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceElevated: colors.dark.surfaceElevated,
    border: colors.dark.border,
    text: colors.dark.text,
  },
  typography,
  spacing: { ...spacing, touchTarget },
  isDark: true,
};

export { colors, typography, spacing, touchTarget };
