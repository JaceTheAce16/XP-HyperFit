import { supabase } from '../supabase';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types';

export const exerciseService = {
  async getAllExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('muscle_group', muscleGroup)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getExercisesByCategory(category: ExerciseCategory): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getExerciseById(id: string): Promise<Exercise | null> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async searchExercises(query: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  },
};
