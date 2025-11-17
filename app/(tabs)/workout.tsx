import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import { workoutService } from '@/lib/services/workoutService';
import { supabase } from '@/lib/supabase';
import { colors, typography, spacing } from '@/theme';
import { Workout, WorkoutExercise } from '@/types';

/**
 * Workout Screen
 * Shows user's generated workout plans and allows starting a session
 */
export default function WorkoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    if (!user) return;

    try {
      const userWorkouts = await workoutService.getUserWorkouts(user.id);
      setWorkouts(userWorkouts.filter(w => w.is_template));
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = (workoutId: string) => {
    router.push({
      pathname: '/workout/active-session',
      params: { workout_id: workoutId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <Text style={styles.subtitle}>Choose a workout to begin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary.main} style={styles.loader} />
        ) : workouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>
              Complete onboarding to generate your personalized plan
            </Text>
          </Card>
        ) : (
          workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onStart={() => handleStartWorkout(workout.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const WorkoutCard: React.FC<{
  workout: Workout;
  onStart: () => void;
}> = ({ workout, onStart }) => {
  const [exerciseCount, setExerciseCount] = useState(0);

  useEffect(() => {
    loadExerciseCount();
  }, []);

  const loadExerciseCount = async () => {
    const { count } = await supabase
      .from('workout_exercises')
      .select('*', { count: 'exact', head: true })
      .eq('workout_id', workout.id);

    setExerciseCount(count || 0);
  };

  return (
    <Card style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        {workout.description && (
          <Text style={styles.workoutDescription}>{workout.description}</Text>
        )}
        <Text style={styles.exerciseCount}>{exerciseCount} exercises</Text>
      </View>

      <Button
        title="Start Workout"
        onPress={onStart}
        fullWidth
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  loader: {
    marginTop: spacing.xl,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    textAlign: 'center',
  },
  workoutCard: {
    marginBottom: spacing.lg,
  },
  workoutHeader: {
    marginBottom: spacing.md,
  },
  workoutName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  workoutDescription: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    marginBottom: spacing.sm,
  },
  exerciseCount: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
});
