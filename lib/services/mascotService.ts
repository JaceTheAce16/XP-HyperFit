import { supabase } from '../supabase';
import { Mascot, UserMascot } from '@/types';

export const mascotService = {
  async getAllMascots(): Promise<Mascot[]> {
    const { data, error } = await supabase
      .from('mascots')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getUserMascots(userId: string): Promise<UserMascot[]> {
    const { data, error } = await supabase
      .from('user_mascots')
      .select('*, mascots(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async selectMascot(userId: string, mascotId: string): Promise<void> {
    // First, check if user already has this mascot
    const { data: existing, error: checkError } = await supabase
      .from('user_mascots')
      .select('*')
      .eq('user_id', userId)
      .eq('mascot_id', mascotId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    // If not, create it
    if (!existing) {
      const { error: insertError } = await supabase
        .from('user_mascots')
        .insert({
          user_id: userId,
          mascot_id: mascotId,
          selected: true,
        });

      if (insertError) throw insertError;
    }

    // Deselect all other mascots
    const { error: deselectError } = await supabase
      .from('user_mascots')
      .update({ selected: false })
      .eq('user_id', userId)
      .neq('mascot_id', mascotId);

    if (deselectError) throw deselectError;

    // Select this one
    const { error: selectError } = await supabase
      .from('user_mascots')
      .update({ selected: true })
      .eq('user_id', userId)
      .eq('mascot_id', mascotId);

    if (selectError) throw selectError;
  },

  /**
   * Calculate mascot level based on streak milestones
   * PRODUCT DIFFERENTIATOR: Mascots level up at 7, 14, 30, 60, 90 day streaks
   *
   * Level 1: 0-6 days
   * Level 2: 7-13 days
   * Level 3: 14-29 days
   * Level 4: 30-59 days
   * Level 5: 60-89 days
   * Level 6: 90+ days (MAX)
   */
  calculateMascotLevel(streakDays: number): number {
    if (streakDays >= 90) return 5;
    if (streakDays >= 60) return 4;
    if (streakDays >= 30) return 3;
    if (streakDays >= 14) return 2;
    if (streakDays >= 7) return 2;
    return 1;
  },

  /**
   * Update mascot level based on current streak
   * Returns { level, leveledUp } to trigger celebrations
   */
  async updateMascotLevel(
    userId: string,
    mascotId: string,
    streakDays: number
  ): Promise<{ level: number; leveledUp: boolean; previousLevel: number }> {
    // Get current mascot level
    const { data: currentMascot, error: fetchError } = await supabase
      .from('user_mascots')
      .select('current_level')
      .eq('user_id', userId)
      .eq('mascot_id', mascotId)
      .single();

    if (fetchError) throw fetchError;

    const previousLevel = currentMascot?.current_level || 1;
    const newLevel = this.calculateMascotLevel(streakDays);
    const leveledUp = newLevel > previousLevel;

    const { error } = await supabase
      .from('user_mascots')
      .update({
        current_level: newLevel,
        streak_days: streakDays,
      })
      .eq('user_id', userId)
      .eq('mascot_id', mascotId);

    if (error) throw error;

    return {
      level: newLevel,
      leveledUp,
      previousLevel,
    };
  },

  /**
   * Get milestone message for level-up celebrations
   */
  getMilestoneMessage(level: number): string {
    const messages: Record<number, string> = {
      2: '🎉 7-day streak! Your mascot evolved!',
      3: '🔥 14-day streak! Your mascot is growing stronger!',
      4: '⚡ 30-day streak! Your mascot reached new heights!',
      5: '💪 60-day streak! Your mascot is elite!',
      6: '👑 90-day streak! Maximum level achieved!',
    };
    return messages[level] || 'Keep going!';
  },

  async getSelectedMascot(userId: string): Promise<UserMascot | null> {
    const { data, error } = await supabase
      .from('user_mascots')
      .select('*, mascots(*)')
      .eq('user_id', userId)
      .eq('selected', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },
};
