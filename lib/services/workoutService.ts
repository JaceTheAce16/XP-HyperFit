import { supabase } from '../supabase';
import { Workout, WorkoutSession, WorkoutSet, PersonalRecord } from '@/types';

export const workoutService = {
  // Workout Sessions
  async startSession(userId: string, workoutId?: string): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        workout_id: workoutId,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeSession(
    sessionId: string,
    durationMinutes: number,
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('workout_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
        notes,
      })
      .eq('id', sessionId);

    if (error) throw error;
  },

  async addSet(
    sessionId: string,
    exerciseId: string,
    setNumber: number,
    reps: number,
    weight: number,
    rpe?: number
  ): Promise<WorkoutSet> {
    const { data, error } = await supabase
      .from('workout_sets')
      .insert({
        session_id: sessionId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps,
        weight,
        rpe,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSessions(userId: string, limit = 10): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Personal Records
  async checkAndUpdatePR(
    userId: string,
    exerciseId: string,
    weight: number,
    reps: number
  ): Promise<PersonalRecord | null> {
    const oneRepMax = weight * (1 + reps / 30.0);

    // Check existing PR
    const { data: existingPR, error: prError } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('one_rep_max', { ascending: false })
      .limit(1)
      .single();

    if (prError && prError.code !== 'PGRST116') throw prError;

    // If new PR, insert it
    if (!existingPR || oneRepMax > existingPR.one_rep_max) {
      const { data, error } = await supabase
        .from('personal_records')
        .insert({
          user_id: userId,
          exercise_id: exerciseId,
          weight,
          reps,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    return null;
  },

  // Workout Templates
  async getUserWorkouts(userId: string): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createWorkout(
    userId: string,
    name: string,
    description?: string,
    isTemplate = true
  ): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        name,
        description,
        is_template: isTemplate,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
