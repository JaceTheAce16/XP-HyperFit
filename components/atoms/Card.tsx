import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  style,
  padding = 'md',
}) => {
  return (
    <View
      style={[
        styles.card,
        elevated ? styles.elevated : undefined,
        { padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  elevated: {
    backgroundColor: colors.dark.surfaceElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
