import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import { colors, typography, spacing } from '@/theme';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Text style={styles.placeholder}>Notification settings coming soon</Text>
        </Card>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          fullWidth
        />
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
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark.text.primary,
    marginBottom: spacing.sm,
  },
  email: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.secondary,
  },
  placeholder: {
    fontSize: typography.fontSize.base,
    color: colors.dark.text.disabled,
    fontStyle: 'italic',
  },
});
