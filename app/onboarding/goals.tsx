import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { OptionCard } from '@/components/molecules/OptionCard';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { colors, typography, spacing } from '@/theme';
import { FitnessGoal } from '@/types';

/**
 * Goals Selection Screen
 * Step 2 of onboarding - allows multiple goal selection
 */
export default function GoalsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);

  const goals = [
    {
      goal: 'build_muscle' as FitnessGoal,
      title: 'Build Muscle',
      description: 'Hypertrophy and size gains',
      icon: '💪',
    },
    {
      goal: 'lose_fat' as FitnessGoal,
      title: 'Lose Fat',
      description: 'Lean down and reveal definition',
      icon: '🔥',
    },
    {
      goal: 'gain_strength' as FitnessGoal,
      title: 'Gain Strength',
      description: 'Increase your max lifts and power',
      icon: '⚡',
    },
    {
      goal: 'improve_endurance' as FitnessGoal,
      title: 'Improve Endurance',
      description: 'Build cardiovascular fitness',
      icon: '🏃',
    },
    {
      goal: 'general_fitness' as FitnessGoal,
      title: 'General Fitness',
      description: 'Overall health and wellness',
      icon: '🌟',
    },
    {
      goal: 'athletic_performance' as FitnessGoal,
      title: 'Athletic Performance',
      description: 'Sport-specific training',
      icon: '🏆',
    },
  ];

  const toggleGoal = (goal: FitnessGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      router.push({
        pathname: '/onboarding/preferences',
        params: {
          ...params,
          fitness_goals: JSON.stringify(selectedGoals),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={2} totalSteps={5} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What are your fitness goals?</Text>
          <Text style={styles.subtitle}>
            Select all that apply - we'll tailor your program
          </Text>
        </View>

        <View style={styles.options}>
          {goals.map((goal) => (
            <OptionCard
              key={goal.goal}
              title={goal.title}
              description={goal.description}
              icon={goal.icon}
              selected={selectedGoals.includes(goal.goal)}
              onPress={() => toggleGoal(goal.goal)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={selectedGoals.length === 0}
          size="large"
          fullWidth
        />
        <Text style={styles.footerHint}>
          {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  options: {
    marginBottom: spacing.xl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  footerHint: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
