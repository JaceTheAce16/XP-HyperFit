import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, typography, spacing } from '@/theme';

interface OptionCardProps {
  title: string;
  description?: string;
  selected?: boolean;
  onPress: () => void;
  icon?: string;
}

/**
 * OptionCard - Selectable card for onboarding and settings
 * Used for experience level, goals, preferences selection
 */
export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  selected = false,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <View style={styles.content}>
        <Text style={[styles.title, selected && styles.titleSelected]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.description, selected && styles.descriptionSelected]}>
            {description}
          </Text>
        )}
      </View>
      {selected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.dark.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  cardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.dark.surfaceElevated,
  },
  icon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  titleSelected: {
    color: colors.primary.main,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.text.secondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  descriptionSelected: {
    color: colors.dark.text.primary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  checkmarkText: {
    color: colors.primary.contrast,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
