import * as Haptics from 'expo-haptics';

/**
 * Haptic Feedback Utilities
 * Provides tactile feedback for user actions
 *
 * WCAG: Haptics are supplementary, never required for functionality
 */
export const haptics = {
  /**
   * Light impact - for selections, toggles
   */
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },

  /**
   * Medium impact - for button presses
   */
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },

  /**
   * Heavy impact - for important actions
   */
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },

  /**
   * Success - for completed actions, PRs, level-ups
   */
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },

  /**
   * Warning - for destructive actions
   */
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },

  /**
   * Error - for failed actions
   */
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },

  /**
   * Selection - for picker changes
   */
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Haptics not supported, silent fail
    }
  },
};
