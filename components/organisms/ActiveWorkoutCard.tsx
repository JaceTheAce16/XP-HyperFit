import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { colors, typography, spacing, touchTarget } from '@/theme';
import { Exercise, WorkoutSet } from '@/types';

interface ActiveWorkoutCardProps {
  exercise: Exercise;
  targetSets: number;
  targetReps: number;
  completedSets: WorkoutSet[];
  onAddSet: (reps: number, weight: number, rpe?: number) => void;
  onRemoveSet: (setNumber: number) => void;
}

/**
 * ActiveWorkoutCard - Card for logging sets during active workout
 * OPTIMIZED FOR GYM USE: Large touch targets, clear visuals, minimal friction
 */
export const ActiveWorkoutCard: React.FC<ActiveWorkoutCardProps> = ({
  exercise,
  targetSets,
  targetReps,
  completedSets,
  onAddSet,
  onRemoveSet,
}) => {
  const [reps, setReps] = useState(targetReps.toString());
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('');

  const currentSetNumber = completedSets.length + 1;
  const isComplete = completedSets.length >= targetSets;

  const handleAddSet = () => {
    const repsNum = parseInt(reps) || 0;
    const weightNum = parseFloat(weight) || 0;
    const rpeNum = rpe ? parseInt(rpe) : undefined;

    if (repsNum > 0 && weightNum >= 0) {
      onAddSet(repsNum, weightNum, rpeNum);
      // Keep same weight for next set, clear RPE
      setRpe('');
    }
  };

  return (
    <Card style={[styles.card, isComplete ? styles.cardComplete : undefined]}>
      {/* Exercise Header */}
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.muscleGroup}>{exercise.muscle_group.toUpperCase()}</Text>
      </View>

      {/* Target Info */}
      <View style={styles.targetInfo}>
        <Text style={styles.targetText}>
          Target: {targetSets} sets × {targetReps} reps
        </Text>
        <Text style={styles.progressText}>
          {completedSets.length}/{targetSets} sets complete
        </Text>
      </View>

      {/* Completed Sets List */}
      {completedSets.length > 0 && (
        <View style={styles.completedSets}>
          {completedSets.map((set, index) => (
            <View key={set.id || index} style={styles.setRow}>
              <Text style={styles.setNumber}>Set {set.set_number}</Text>
              <Text style={styles.setText}>
                {set.reps} reps × {set.weight} lbs
                {set.rpe && ` @ RPE ${set.rpe}`}
              </Text>
              <TouchableOpacity
                onPress={() => onRemoveSet(set.set_number)}
                style={styles.removeButton}
                accessibilityLabel="Remove set"
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Input Section (only if not complete) */}
      {!isComplete && (
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Set {currentSetNumber}</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reps</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.dark.text.disabled}
                selectTextOnFocus
                accessibilityLabel="Number of reps"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.dark.text.disabled}
                selectTextOnFocus
                accessibilityLabel="Weight in pounds"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>RPE</Text>
              <TextInput
                style={styles.input}
                value={rpe}
                onChangeText={setRpe}
                keyboardType="number-pad"
                placeholder="—"
                placeholderTextColor={colors.dark.text.disabled}
                maxLength={2}
                accessibilityLabel="Rate of perceived exertion"
                accessibilityHint="1 to 10"
              />
            </View>
          </View>

          <Button
            title="Complete Set"
            onPress={handleAddSet}
            size="large"
            fullWidth
            disabled={!reps || !weight}
          />
        </View>
      )}

      {isComplete && (
        <View style={styles.completeSection}>
          <Text style={styles.completeText}>✓ Exercise Complete!</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  cardComplete: {
    borderColor: colors.success.main,
    borderWidth: 2,
  },
  header: {
    marginBottom: spacing.md,
  },
  exerciseName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  muscleGroup: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semiBold,
  },
  targetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  targetText: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
  },
  progressText: {
    fontSize: typography.fontSize.base,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
  completedSets: {
    marginBottom: spacing.md,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.dark.surfaceElevated,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  setNumber: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    width: 60,
  },
  setText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.dark.text.primary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: colors.error.contrast,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  inputSection: {
    marginTop: spacing.md,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.dark.text.secondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    minHeight: touchTarget.minHeight,
    backgroundColor: colors.dark.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    textAlign: 'center',
  },
  completeSection: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  completeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success.main,
  },
});
