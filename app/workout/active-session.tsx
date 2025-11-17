import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { ActiveWorkoutCard } from '@/components/organisms/ActiveWorkoutCard';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/contexts/ToastContext';
import { haptics } from '@/lib/utils/haptics';
import { workoutService } from '@/lib/services/workoutService';
import { workoutCompletionService } from '@/lib/services/workoutCompletionService';
import { supabase } from '@/lib/supabase';
import { colors, typography, spacing } from '@/theme';
import { WorkoutExercise, WorkoutSet, WorkoutSession } from '@/types';

/**
 * Active Workout Session Screen
 * CORE USER EXPERIENCE: Logging sets during a workout
 *
 * Features:
 * - Large touch targets for gym use
 * - Real-time volume tracking
 * - Offline-first (local state, sync on complete)
 * - Session timer
 * - Quick set logging
 */
export default function ActiveSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [sets, setSets] = useState<Record<string, WorkoutSet[]>>({});
  const [startTime, setStartTime] = useState(new Date());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (user) {
      startWorkoutSession();
    }
  }, [user]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
      setElapsedMinutes(elapsed);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [startTime]);

  const startWorkoutSession = async () => {
    if (!user) return;

    try {
      const workoutId = params.workout_id as string;

      // Create session
      const newSession = await workoutService.startSession(user.id, workoutId);
      setSession(newSession);

      // Load workout exercises
      const { data: workoutExercises, error } = await supabase
        .from('workout_exercises')
        .select('*, exercise:exercises(*)')
        .eq('workout_id', workoutId)
        .order('order_index');

      if (error) throw error;
      setExercises(workoutExercises || []);

      // Initialize sets state
      const initialSets: Record<string, WorkoutSet[]> = {};
      workoutExercises?.forEach(ex => {
        initialSets[ex.exercise_id] = [];
      });
      setSets(initialSets);

    } catch (error) {
      console.error('Error starting workout:', error);
      showToast('Failed to start workout session', 'error');
      router.back();
    }
  };

  const handleAddSet = async (exerciseId: string, reps: number, weight: number, rpe?: number) => {
    if (!session) return;

    const exerciseSets = sets[exerciseId] || [];
    const setNumber = exerciseSets.length + 1;

    try {
      // Add set to database
      const newSet = await workoutService.addSet(
        session.id,
        exerciseId,
        setNumber,
        reps,
        weight,
        rpe
      );

      // Update local state
      setSets(prev => ({
        ...prev,
        [exerciseId]: [...(prev[exerciseId] || []), newSet],
      }));

      // Update total volume
      setTotalVolume(prev => prev + (reps * weight));

      // Success feedback
      haptics.medium();
      showToast(`Set ${setNumber} logged!`, 'success', 1500);

    } catch (error) {
      console.error('Error adding set:', error);
      haptics.error();
      showToast('Failed to log set', 'error');
    }
  };

  const handleRemoveSet = async (exerciseId: string, setNumber: number) => {
    const exerciseSets = sets[exerciseId] || [];
    const setToRemove = exerciseSets.find(s => s.set_number === setNumber);

    if (!setToRemove) return;

    try {
      // Remove from database
      const { error } = await supabase
        .from('workout_sets')
        .delete()
        .eq('id', setToRemove.id);

      if (error) throw error;

      // Update local state
      setSets(prev => ({
        ...prev,
        [exerciseId]: prev[exerciseId].filter(s => s.set_number !== setNumber),
      }));

      // Update total volume
      setTotalVolume(prev => prev - (setToRemove.reps * setToRemove.weight));

      haptics.light();
      showToast('Set removed', 'info', 1500);

    } catch (error) {
      console.error('Error removing set:', error);
      haptics.error();
      showToast('Failed to remove set', 'error');
    }
  };

  const handleCompleteWorkout = async () => {
    if (!session || !user) return;

    const totalSets = Object.values(sets).reduce((sum, exerciseSets) => sum + exerciseSets.length, 0);

    if (totalSets === 0) {
      Alert.alert('No Sets Logged', 'Please log at least one set before completing the workout.');
      return;
    }

    setCompleting(true);

    try {
      const duration = Math.max(1, Math.floor((new Date().getTime() - startTime.getTime()) / 60000));

      // Complete workout with all post-workout logic
      const result = await workoutCompletionService.completeWorkout(
        user.id,
        session.id,
        duration
      );

      // Success haptic
      haptics.success();

      // Show completion message
      const message = workoutCompletionService.getCompletionMessage(result);

      Alert.alert(
        'Workout Complete! 🎉',
        message,
        [
          {
            text: 'Awesome!',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );

    } catch (error) {
      console.error('Error completing workout:', error);
      haptics.error();
      showToast('Failed to complete workout. Your progress is saved.', 'error');
      setCompleting(false);
    }
  };

  const handleCancelWorkout = () => {
    Alert.alert(
      'Cancel Workout?',
      'Your progress will be lost. Are you sure?',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Cancel Workout',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const totalSets = Object.values(sets).reduce((sum, exerciseSets) => sum + exerciseSets.length, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Active Workout</Text>
          <Text style={styles.headerSubtitle}>
            {elapsedMinutes} min • {totalSets} sets • {Math.round(totalVolume)} lbs
          </Text>
        </View>
      </View>

      {/* Exercise Cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {exercises.map((workoutExercise) => (
          <ActiveWorkoutCard
            key={workoutExercise.id}
            exercise={workoutExercise.exercise!}
            targetSets={workoutExercise.target_sets}
            targetReps={workoutExercise.target_reps}
            completedSets={sets[workoutExercise.exercise_id] || []}
            onAddSet={(reps, weight, rpe) =>
              handleAddSet(workoutExercise.exercise_id, reps, weight, rpe)
            }
            onRemoveSet={(setNumber) =>
              handleRemoveSet(workoutExercise.exercise_id, setNumber)
            }
          />
        ))}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          title="Complete Workout"
          onPress={handleCompleteWorkout}
          size="large"
          fullWidth
          loading={completing}
          disabled={totalSets === 0}
        />
        <Button
          title="Cancel"
          onPress={handleCancelWorkout}
          variant="ghost"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    marginTop: spacing.xs,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    gap: spacing.sm,
  },
});
