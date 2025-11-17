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

  async updateMascotLevel(
    userId: string,
    mascotId: string,
    streakDays: number
  ): Promise<number> {
    // Calculate level based on streak milestones
    let level = 1;
    if (streakDays >= 90) level = 5;
    else if (streakDays >= 60) level = 4;
    else if (streakDays >= 30) level = 3;
    else if (streakDays >= 14) level = 2;
    else if (streakDays >= 7) level = 2;

    const { error } = await supabase
      .from('user_mascots')
      .update({
        current_level: level,
        streak_days: streakDays,
      })
      .eq('user_id', userId)
      .eq('mascot_id', mascotId);

    if (error) throw error;
    return level;
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
