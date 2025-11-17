import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import { mascotService } from '@/lib/services/mascotService';
import { streakService } from '@/lib/services/streakService';
import { colors, typography, spacing } from '@/theme';
import { UserMascot, Streak } from '@/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedMascot, setSelectedMascot] = useState<UserMascot | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHomeData();
    }
  }, [user]);

  const loadHomeData = async () => {
    if (!user) return;

    try {
      const [mascotData, streakData] = await Promise.all([
        mascotService.getSelectedMascot(user.id),
        streakService.getUserStreak(user.id),
      ]);

      setSelectedMascot(mascotData);
      setStreak(streakData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.username}>{user?.email?.split('@')[0]}</Text>
        </View>

        {/* Mascot Card */}
        <Card elevated style={styles.mascotCard}>
          <View style={styles.mascotContent}>
            <View style={styles.mascotPlaceholder}>
              <Text style={styles.mascotEmoji}>🐉</Text>
            </View>
            <View style={styles.mascotInfo}>
              <Text style={styles.mascotName}>
                {selectedMascot?.mascots?.name || 'Select a Mascot'}
              </Text>
              <Text style={styles.mascotLevel}>
                Level {selectedMascot?.current_level || 1}
              </Text>
            </View>
          </View>
        </Card>

        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <Text style={styles.cardTitle}>Your Streak</Text>
          <View style={styles.streakContent}>
            <View style={styles.streakItem}>
              <Text style={styles.streakNumber}>
                {streak?.current_streak || 0}
              </Text>
              <Text style={styles.streakLabel}>Days</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakNumber}>
                {streak?.longest_streak || 0}
              </Text>
              <Text style={styles.streakLabel}>Best</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Button
            title="Start Workout"
            onPress={() => {}}
            size="large"
            fullWidth
          />
          <Button
            title="View Progress"
            onPress={() => {}}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: typography.fontSize.lg,
    color: colors.dark.text.secondary,
  },
  username: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
  },
  mascotCard: {
    marginBottom: spacing.lg,
  },
  mascotContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mascotEmoji: {
    fontSize: 48,
  },
  mascotInfo: {
    flex: 1,
  },
  mascotName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.xs,
  },
  mascotLevel: {
    fontSize: typography.fontSize.base,
    color: colors.primary.main,
  },
  streakCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.md,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  streakLabel: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
    marginTop: spacing.xs,
  },
  streakDivider: {
    width: 1,
    backgroundColor: colors.dark.border,
  },
  quickActions: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.sm,
  },
});
