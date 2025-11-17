import { supabase } from '../supabase';
import { Streak } from '@/types';

export const streakService = {
  async getUserStreak(userId: string): Promise<Streak | null> {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async updateStreak(userId: string, workoutDate: Date): Promise<Streak> {
    const today = new Date(workoutDate);
    today.setHours(0, 0, 0, 0);

    // Get existing streak
    const existing = await this.getUserStreak(userId);

    let currentStreak = 1;
    let longestStreak = 1;

    if (existing) {
      const lastWorkout = new Date(existing.last_workout_date);
      lastWorkout.setHours(0, 0, 0, 0);

      const daysSince = Math.floor(
        (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSince === 0) {
        // Same day, no change
        return existing;
      } else if (daysSince === 1) {
        // Consecutive day
        currentStreak = existing.current_streak + 1;
      } else {
        // Streak broken
        currentStreak = 1;
      }

      longestStreak = Math.max(currentStreak, existing.longest_streak);

      const { data, error } = await supabase
        .from('streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_workout_date: today.toISOString().split('T')[0],
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new streak
      const { data, error } = await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_workout_date: today.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};
