import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/**
 * SkeletonLoader - Animated loading placeholder
 * Shows while content is loading for better UX
 */
export const SkeletonLoader: React.FC<{
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}> = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    />
  );
};

/**
 * SkeletonCard - Card-shaped loading placeholder
 */
export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <SkeletonLoader width="60%" height={24} style={styles.title} />
      <SkeletonLoader width="90%" height={16} style={styles.subtitle} />
      <SkeletonLoader width="40%" height={16} style={styles.subtitle} />
      <View style={styles.divider} />
      <SkeletonLoader width="100%" height={44} borderRadius={12} />
    </View>
  );
};

/**
 * SkeletonWorkoutCard - Workout card loading placeholder
 */
export const SkeletonWorkoutCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <SkeletonLoader width="70%" height={24} style={styles.title} />
      <SkeletonLoader width="100%" height={16} style={styles.subtitle} />
      <SkeletonLoader width="30%" height={14} style={styles.subtitle} />
      <View style={styles.divider} />
      <SkeletonLoader width="100%" height={48} borderRadius={12} />
    </View>
  );
};

/**
 * SkeletonExerciseCard - Exercise card loading placeholder
 */
export const SkeletonExerciseCard: React.FC = () => {
  return (
    <View style={styles.exerciseCard}>
      <SkeletonLoader width={80} height={80} borderRadius={12} />
      <View style={styles.exerciseInfo}>
        <SkeletonLoader width="80%" height={20} />
        <SkeletonLoader width="60%" height={14} style={{ marginTop: spacing.xs }} />
        <SkeletonLoader width="40%" height={14} style={{ marginTop: spacing.xs }} />
      </View>
    </View>
  );
};

/**
 * SkeletonList - Multiple skeleton items
 */
export const SkeletonList: React.FC<{
  count?: number;
  type?: 'card' | 'workout' | 'exercise';
}> = ({ count = 3, type = 'card' }) => {
  const SkeletonComponent =
    type === 'workout'
      ? SkeletonWorkoutCard
      : type === 'exercise'
      ? SkeletonExerciseCard
      : SkeletonCard;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.dark.surfaceElevated,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xs,
  },
  divider: {
    height: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
