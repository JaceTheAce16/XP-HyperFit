import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { colors, typography, spacing } from '@/theme';

/**
 * Welcome Screen - First screen of onboarding
 * Introduces XP HyperFit and mascot system
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.mascotEmoji}>🏋️‍♂️</Text>
          <Text style={styles.title}>Welcome to XP HyperFit!</Text>
          <Text style={styles.subtitle}>
            Your journey to peak performance starts here
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem
            icon="📊"
            title="Track Your Progress"
            description="Log workouts, track PRs, and watch your gains grow"
          />
          <FeatureItem
            icon="🐉"
            title="Level Up Your Mascot"
            description="Build streaks and watch your companion evolve"
          />
          <FeatureItem
            icon="👥"
            title="Compete With Friends"
            description="Join challenges and climb the leaderboards"
          />
          <FeatureItem
            icon="🎯"
            title="Personalized Programs"
            description="Get workouts tailored to your goals and experience"
          />
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <Button
            title="Let's Get Started"
            onPress={() => router.push('/onboarding/experience')}
            size="large"
            fullWidth
          />
          <Text style={styles.footerText}>
            Takes just 2 minutes to set up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FeatureItem: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
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
  mascotEmoji: {
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
  features: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  footer: {
    gap: spacing.md,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.text.secondary,
    textAlign: 'center',
  },
});
