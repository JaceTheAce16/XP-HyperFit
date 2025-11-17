import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { mascotService } from '@/lib/services/mascotService';
import { colors, typography, spacing } from '@/theme';
import { Mascot } from '@/types';
import { TouchableOpacity } from 'react-native-gesture-handler';

/**
 * Mascot Selection Screen
 * Step 4 of onboarding - choose your companion
 *
 * PRODUCT DIFFERENTIATOR: Mascots level up with streaks (7, 14, 30, 60, 90 days)
 */
export default function MascotScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [mascots, setMascots] = useState<Mascot[]>([]);
  const [selectedMascot, setSelectedMascot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMascots();
  }, []);

  const loadMascots = async () => {
    try {
      const data = await mascotService.getAllMascots();
      setMascots(data);
    } catch (error) {
      console.error('Error loading mascots:', error);
      Alert.alert('Error', 'Failed to load mascots');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedMascot) {
      router.push({
        pathname: '/onboarding/complete',
        params: {
          ...params,
          mascot_id: selectedMascot,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={4} totalSteps={5} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Companion</Text>
          <Text style={styles.subtitle}>
            Your mascot will level up as you build workout streaks!
          </Text>
          <Card style={styles.infoCard}>
            <Text style={styles.infoText}>
              🌟 Level up at 7, 14, 30, 60, and 90-day streaks
            </Text>
          </Card>
        </View>

        <View style={styles.mascotGrid}>
          {mascots.map((mascot) => (
            <MascotCard
              key={mascot.id}
              mascot={mascot}
              selected={selectedMascot === mascot.id}
              onPress={() => setSelectedMascot(mascot.id)}
            />
          ))}
        </View>

        {loading && (
          <Text style={styles.loadingText}>Loading mascots...</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedMascot}
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const MascotCard: React.FC<{
  mascot: Mascot;
  selected: boolean;
  onPress: () => void;
}> = ({ mascot, selected, onPress }) => {
  // Map mascot types to emojis (in production, use actual images)
  const getEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      dragon: '🐉',
      phoenix: '🔥',
      wolf: '🐺',
      bear: '🐻',
      lion: '🦁',
      tiger: '🐅',
    };
    return emojiMap[type] || '🐾';
  };

  return (
    <TouchableOpacity
      style={[styles.mascotCard, selected && styles.mascotCardSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Select ${mascot.name}`}
    >
      <Text style={styles.mascotEmoji}>{getEmoji(mascot.type)}</Text>
      <Text style={[styles.mascotName, selected && styles.mascotNameSelected]}>
        {mascot.name}
      </Text>
      <Text style={styles.mascotDescription}>{mascot.description}</Text>
      {selected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

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
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.dark.surfaceElevated,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    textAlign: 'center',
  },
  mascotGrid: {
    gap: spacing.md,
  },
  mascotCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.dark.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  mascotCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.dark.surfaceElevated,
  },
  mascotEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  mascotName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  mascotNameSelected: {
    color: colors.primary.main,
  },
  mascotDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.text.secondary,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: colors.primary.contrast,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
