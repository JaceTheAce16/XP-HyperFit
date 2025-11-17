import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useAuth } from '@/lib/hooks/useAuth';
import { onboardingService } from '@/lib/services/onboardingService';
import { workoutGeneratorService } from '@/lib/services/workoutGeneratorService';
import { mascotService } from '@/lib/services/mascotService';
import { colors, typography, spacing } from '@/theme';
import { OnboardingData, UserLevel, FitnessGoal, WorkoutFrequency, SessionDuration, Equipment } from '@/types';

/**
 * Onboarding Complete Screen
 * Step 5 - Process all data and generate personalized workout plan
 *
 * This is where the magic happens:
 * 1. Save onboarding data to profile
 * 2. Select user's mascot
 * 3. Generate personalized workout plan based on experience/goals
 * 4. Initialize default settings (plateau detection, notifications)
 */
export default function CompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Setting up your profile...');

  useEffect(() => {
    if (user) {
      completeOnboarding();
    }
  }, [user]);

  const completeOnboarding = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      // Parse onboarding data from params
      const onboardingData: OnboardingData = {
        experience_level: params.experience_level as UserLevel,
        fitness_goals: JSON.parse(params.fitness_goals as string) as FitnessGoal[],
        workout_frequency: params.workout_frequency as WorkoutFrequency,
        session_duration: params.session_duration as SessionDuration,
        preferred_equipment: params.preferred_equipment
          ? JSON.parse(params.preferred_equipment as string) as Equipment[]
          : [],
        has_gym_access: params.has_gym_access === 'true',
      };

      // Step 1: Complete onboarding and initialize defaults
      setProgress(20);
      setStatusMessage('Saving your preferences...');
      await onboardingService.completeOnboarding(user.id, onboardingData);

      // Step 2: Select mascot
      setProgress(40);
      setStatusMessage('Setting up your mascot...');
      await mascotService.selectMascot(user.id, params.mascot_id as string);

      // Step 3: Generate personalized workout plan
      setProgress(60);
      setStatusMessage('Creating your personalized workout plan...');
      const workoutIds = await workoutGeneratorService.generateInitialWorkoutPlan(
        user.id,
        onboardingData
      );

      setProgress(80);
      setStatusMessage('Finalizing setup...');

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(100);
      setStatusMessage('All set! Welcome to XP HyperFit!');

      // Navigate to main app
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);

    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert(
        'Error',
        'Failed to complete setup. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => completeOnboarding(),
          },
          {
            text: 'Cancel',
            onPress: () => router.back(),
            style: 'cancel',
          },
        ]
      );
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={5} totalSteps={5} />

      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Almost There!</Text>
          <Text style={styles.subtitle}>
            We're creating your personalized training plan
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        <View style={styles.features}>
          <FeatureCheck
            completed={progress >= 20}
            text="Profile configured"
          />
          <FeatureCheck
            completed={progress >= 40}
            text="Mascot selected"
          />
          <FeatureCheck
            completed={progress >= 60}
            text="Workout plan generated"
          />
          <FeatureCheck
            completed={progress >= 80}
            text="Default settings initialized"
          />
          <FeatureCheck
            completed={progress >= 100}
            text="Ready to train!"
          />
        </View>

        {processing && (
          <ActivityIndicator
            size="large"
            color={colors.primary.main}
            style={styles.spinner}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const FeatureCheck: React.FC<{ completed: boolean; text: string }> = ({
  completed,
  text,
}) => (
  <View style={styles.featureCheck}>
    <View style={[styles.checkCircle, completed && styles.checkCircleCompleted]}>
      {completed && <Text style={styles.checkMark}>✓</Text>}
    </View>
    <Text style={[styles.featureText, completed && styles.featureTextCompleted]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.dark.text.secondary,
    textAlign: 'center',
  },
  progressSection: {
    marginVertical: spacing.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.dark.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    textAlign: 'center',
  },
  features: {
    gap: spacing.md,
  },
  featureCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkCircleCompleted: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.main,
  },
  checkMark: {
    color: colors.success.contrast,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  featureText: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
  },
  featureTextCompleted: {
    color: colors.dark.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  spinner: {
    marginTop: spacing.xl,
  },
});
