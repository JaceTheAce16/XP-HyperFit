import { supabase } from '../supabase';
import { OnboardingData, UserLevel, FitnessGoal, UserProfile } from '@/types';

/**
 * Onboarding Service
 * Handles user onboarding flow, profile setup, and initial workout generation
 */
export const onboardingService = {
  /**
   * Update user profile with onboarding data
   */
  async completeOnboarding(
    userId: string,
    data: OnboardingData
  ): Promise<void> {
    // Update profile with experience level and mark onboarding as complete
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        level: data.experience_level,
        onboarding_completed: true,
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Store full onboarding data in user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { onboarding_data: data },
    });

    if (metadataError) throw metadataError;

    // Initialize user's default settings
    await this.initializeUserDefaults(userId, data);
  },

  /**
   * Initialize default settings for new user
   */
  async initializeUserDefaults(
    userId: string,
    data: OnboardingData
  ): Promise<void> {
    // Create default subscription (free tier)
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        tier: 'free',
        form_checks_remaining: 3,
        form_checks_limit: 3,
      });

    if (subError && subError.code !== '23505') throw subError; // Ignore duplicate

    // Create default notification settings
    const { error: notifError } = await supabase
      .from('notification_settings')
      .insert({
        user_id: userId,
        workout_reminders: true,
        friend_activity: true,
        challenge_updates: true,
        mascot_nudges: true,
        frequency: 'medium',
      });

    if (notifError && notifError.code !== '23505') throw notifError;

    // Create default plateau settings based on experience level
    const plateauSettings = this.getDefaultPlateauSettings(data.experience_level);
    const { error: plateauError } = await supabase
      .from('plateau_settings')
      .insert({
        user_id: userId,
        ...plateauSettings,
      });

    if (plateauError && plateauError.code !== '23505') throw plateauError;

    // Initialize streak record
    const { error: streakError } = await supabase
      .from('streaks')
      .insert({
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
      });

    if (streakError && streakError.code !== '23505') throw streakError;
  },

  /**
   * Get default plateau detection settings based on experience level
   */
  getDefaultPlateauSettings(level: UserLevel) {
    switch (level) {
      case 'beginner':
        return {
          enabled_metrics: ['volume', 'frequency'],
          detection_window_days: 21, // 3 weeks
          threshold_percentage: 10, // More lenient for beginners
        };
      case 'intermediate':
        return {
          enabled_metrics: ['volume', 'strength', 'frequency'],
          detection_window_days: 14, // 2 weeks
          threshold_percentage: 5,
        };
      case 'advanced':
      case 'gym_junkie':
        return {
          enabled_metrics: ['volume', 'strength', 'frequency', 'recovery'],
          detection_window_days: 14,
          threshold_percentage: 3, // Strict for advanced
        };
      default:
        return {
          enabled_metrics: ['volume', 'strength'],
          detection_window_days: 14,
          threshold_percentage: 5,
        };
    }
  },

  /**
   * Get user profile with onboarding data
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Get onboarding data from user metadata
    const { data: { user } } = await supabase.auth.getUser();
    const onboardingData = user?.user_metadata?.onboarding_data;

    return {
      ...profile,
      onboarding_data: onboardingData,
    };
  },
};
