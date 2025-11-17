import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { colors } from '@/theme';

/**
 * App Entry Point
 * Handles authentication and onboarding routing
 *
 * Routing Logic:
 * - Not authenticated → /(auth)/login
 * - Authenticated but onboarding incomplete → /onboarding/welcome
 * - Authenticated and onboarding complete → /(tabs)
 */
export default function Index() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    checkAuthAndOnboarding();
  }, [user]);

  const checkAuthAndOnboarding = async () => {
    if (authLoading) return;

    if (!user) {
      // Not authenticated, go to login
      router.replace('/(auth)/login');
      return;
    }

    try {
      // Check if onboarding is complete
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (!profile?.onboarding_completed) {
        // Onboarding not complete, start onboarding
        router.replace('/onboarding/welcome');
      } else {
        // All good, go to main app
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if unsure
      router.replace('/onboarding/welcome');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
