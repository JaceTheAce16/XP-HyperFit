import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { OptionCard } from '@/components/molecules/OptionCard';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { colors, typography, spacing } from '@/theme';
import { WorkoutFrequency, SessionDuration, Equipment } from '@/types';

/**
 * Workout Preferences Screen
 * Step 3 of onboarding - frequency, duration, equipment, gym access
 */
export default function PreferencesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [frequency, setFrequency] = useState<WorkoutFrequency | null>(null);
  const [duration, setDuration] = useState<SessionDuration | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [hasGymAccess, setHasGymAccess] = useState<boolean | null>(null);

  const frequencies: { value: WorkoutFrequency; label: string; description: string }[] = [
    { value: '2-3', label: '2-3 Days/Week', description: 'Great for beginners' },
    { value: '4-5', label: '4-5 Days/Week', description: 'Build solid routine' },
    { value: '6-7', label: '6-7 Days/Week', description: 'For dedicated athletes' },
  ];

  const durations: { value: SessionDuration; label: string; description: string }[] = [
    { value: '30-45', label: '30-45 Minutes', description: 'Quick and efficient' },
    { value: '45-60', label: '45-60 Minutes', description: 'Standard workout length' },
    { value: '60-90', label: '60-90 Minutes', description: 'Comprehensive training' },
    { value: '90+', label: '90+ Minutes', description: 'Extended sessions' },
  ];

  const equipmentOptions: { value: Equipment; label: string; icon: string }[] = [
    { value: 'barbell', label: 'Barbell', icon: '🏋️' },
    { value: 'dumbbell', label: 'Dumbbells', icon: '💪' },
    { value: 'machine', label: 'Machines', icon: '🔧' },
    { value: 'cable', label: 'Cables', icon: '🪢' },
    { value: 'bodyweight', label: 'Bodyweight', icon: '🧘' },
    { value: 'kettlebell', label: 'Kettlebells', icon: '⚫' },
    { value: 'bands', label: 'Resistance Bands', icon: '🎗️' },
  ];

  const toggleEquipment = (eq: Equipment) => {
    if (equipment.includes(eq)) {
      setEquipment(equipment.filter(e => e !== eq));
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  const handleContinue = () => {
    if (frequency && duration && hasGymAccess !== null) {
      router.push({
        pathname: '/onboarding/mascot',
        params: {
          ...params,
          workout_frequency: frequency,
          session_duration: duration,
          preferred_equipment: JSON.stringify(equipment),
          has_gym_access: hasGymAccess.toString(),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={5} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How often will you train?</Text>
          {frequencies.map((freq) => (
            <OptionCard
              key={freq.value}
              title={freq.label}
              description={freq.description}
              selected={frequency === freq.value}
              onPress={() => setFrequency(freq.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How long are your sessions?</Text>
          {durations.map((dur) => (
            <OptionCard
              key={dur.value}
              title={dur.label}
              description={dur.description}
              selected={duration === dur.value}
              onPress={() => setDuration(dur.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Do you have gym access?</Text>
          <OptionCard
            title="Yes, I have a gym"
            description="Access to full equipment"
            selected={hasGymAccess === true}
            onPress={() => setHasGymAccess(true)}
            icon="🏢"
          />
          <OptionCard
            title="No, training at home"
            description="Bodyweight or minimal equipment"
            selected={hasGymAccess === false}
            onPress={() => setHasGymAccess(false)}
            icon="🏠"
          />
        </View>

        {hasGymAccess && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              What equipment do you prefer? (optional)
            </Text>
            <Text style={styles.sectionSubtitle}>
              Leave blank for full variety
            </Text>
            <View style={styles.equipmentGrid}>
              {equipmentOptions.map((eq) => (
                <OptionCard
                  key={eq.value}
                  title={eq.label}
                  icon={eq.icon}
                  selected={equipment.includes(eq.value)}
                  onPress={() => toggleEquipment(eq.value)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!frequency || !duration || hasGymAccess === null}
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.text.secondary,
    marginBottom: spacing.md,
  },
  equipmentGrid: {
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
