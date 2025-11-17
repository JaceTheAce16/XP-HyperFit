import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { OptionCard } from '@/components/molecules/OptionCard';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { colors, typography, spacing } from '@/theme';
import { UserLevel } from '@/types';

/**
 * Experience Level Selection Screen
 * Step 1 of onboarding - determines user persona (25% beginner, 25% intermediate, 20% advanced, 30% gym junkie)
 */
export default function ExperienceScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | null>(null);

  const experiences = [
    {
      level: 'beginner' as UserLevel,
      title: 'Beginner',
      description: 'New to working out or getting back after a break',
      icon: '🌱',
    },
    {
      level: 'intermediate' as UserLevel,
      title: 'Intermediate',
      description: 'Training consistently for 6+ months',
      icon: '💪',
    },
    {
      level: 'advanced' as UserLevel,
      title: 'Advanced',
      description: 'Training seriously for 2+ years',
      icon: '🔥',
    },
    {
      level: 'gym_junkie' as UserLevel,
      title: 'Gym Junkie',
      description: 'Elite athlete or competitive lifter',
      icon: '⚡',
    },
  ];

  const handleContinue = () => {
    if (selectedLevel) {
      // Store in temp state (we'll use context or AsyncStorage in production)
      router.push({
        pathname: '/onboarding/goals',
        params: { experience_level: selectedLevel },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={1} totalSteps={5} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your experience level?</Text>
          <Text style={styles.subtitle}>
            This helps us personalize your workout plan
          </Text>
        </View>

        <View style={styles.options}>
          {experiences.map((exp) => (
            <OptionCard
              key={exp.level}
              title={exp.title}
              description={exp.description}
              icon={exp.icon}
              selected={selectedLevel === exp.level}
              onPress={() => setSelectedLevel(exp.level)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedLevel}
          size="large"
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
});
