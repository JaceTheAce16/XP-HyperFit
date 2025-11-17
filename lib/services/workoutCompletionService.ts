import { supabase } from '../supabase';
import { streakService } from './streakService';
import { mascotService } from './mascotService';
import { workoutService } from './workoutService';
import { WorkoutSet, PersonalRecord } from '@/types';

/**
 * Workout Completion Service
 * Orchestrates all post-workout logic: streaks, mascot progression, PRs, analytics
 *
 * PRODUCT DIFFERENTIATOR: Automated progression tracking with celebratory feedback
 */

export interface WorkoutCompletionResult {
  streakUpdated: boolean;
  currentStreak: number;
  longestStreak: number;
  mascotLeveledUp: boolean;
  newMascotLevel: number;
  milestoneMessage?: string;
  personalRecords: PersonalRecord[];
  totalVolume: number;
  durationMinutes: number;
}

export const workoutCompletionService = {
  /**
   * Complete a workout session and update all related metrics
   * This is the CORE workflow after every workout
   */
  async completeWorkout(
    userId: string,
    sessionId: string,
    durationMinutes: number,
    notes?: string
  ): Promise<WorkoutCompletionResult> {
    const result: WorkoutCompletionResult = {
      streakUpdated: false,
      currentStreak: 0,
      longestStreak: 0,
      mascotLeveledUp: false,
      newMascotLevel: 1,
      personalRecords: [],
      totalVolume: 0,
      durationMinutes,
    };

    try {
      // 1. Mark session as complete
      await workoutService.completeSession(sessionId, durationMinutes, notes);

      // 2. Get all sets from this session
      const { data: sets, error: setsError } = await supabase
        .from('workout_sets')
        .select('*')
        .eq('session_id', sessionId);

      if (setsError) throw setsError;

      // 3. Calculate total volume (sets * reps * weight)
      result.totalVolume = this.calculateTotalVolume(sets || []);

      // 4. Update streak
      const streak = await streakService.updateStreak(userId, new Date());
      result.streakUpdated = true;
      result.currentStreak = streak.current_streak;
      result.longestStreak = streak.longest_streak;

      // 5. Update mascot level based on new streak
      const selectedMascot = await mascotService.getSelectedMascot(userId);
      if (selectedMascot) {
        const mascotUpdate = await mascotService.updateMascotLevel(
          userId,
          selectedMascot.mascot_id,
          streak.current_streak
        );

        result.mascotLeveledUp = mascotUpdate.leveledUp;
        result.newMascotLevel = mascotUpdate.level;

        if (mascotUpdate.leveledUp) {
          result.milestoneMessage = mascotService.getMilestoneMessage(mascotUpdate.level);
        }
      }

      // 6. Check for personal records
      result.personalRecords = await this.checkPersonalRecords(userId, sets || []);

      // 7. Update daily progress metrics
      await this.updateProgressMetrics(userId, result.totalVolume, durationMinutes);

      return result;
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  },

  /**
   * Calculate total volume from workout sets
   * Volume = Σ(sets × reps × weight)
   */
  calculateTotalVolume(sets: WorkoutSet[]): number {
    return sets.reduce((total, set) => {
      return total + (set.reps * set.weight);
    }, 0);
  },

  /**
   * Check for personal records in this workout
   * Returns array of new PRs
   */
  async checkPersonalRecords(
    userId: string,
    sets: WorkoutSet[]
  ): Promise<PersonalRecord[]> {
    const personalRecords: PersonalRecord[] = [];

    // Group sets by exercise
    const exerciseGroups = sets.reduce((groups, set) => {
      if (!groups[set.exercise_id]) {
        groups[set.exercise_id] = [];
      }
      groups[set.exercise_id].push(set);
      return groups;
    }, {} as Record<string, WorkoutSet[]>);

    // Check each exercise for PRs
    for (const [exerciseId, exerciseSets] of Object.entries(exerciseGroups)) {
      // Find the best set (highest 1RM) for this exercise
      let bestSet = exerciseSets[0];
      let bestOneRepMax = this.calculateOneRepMax(bestSet.weight, bestSet.reps);

      for (const set of exerciseSets) {
        const oneRepMax = this.calculateOneRepMax(set.weight, set.reps);
        if (oneRepMax > bestOneRepMax) {
          bestSet = set;
          bestOneRepMax = oneRepMax;
        }
      }

      // Check if this is a PR
      const pr = await workoutService.checkAndUpdatePR(
        userId,
        exerciseId,
        bestSet.weight,
        bestSet.reps
      );

      if (pr) {
        personalRecords.push(pr);
      }
    }

    return personalRecords;
  },

  /**
   * Calculate estimated 1-rep max using Epley formula
   * 1RM = weight × (1 + reps / 30)
   */
  calculateOneRepMax(weight: number, reps: number): number {
    return weight * (1 + reps / 30);
  },

  /**
   * Update daily progress metrics
   */
  async updateProgressMetrics(
    userId: string,
    totalVolume: number,
    durationMinutes: number
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Check if metrics exist for today
    const { data: existing, error: fetchError } = await supabase
      .from('progress_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existing) {
      // Update existing metrics
      const { error: updateError } = await supabase
        .from('progress_metrics')
        .update({
          total_volume: existing.total_volume + totalVolume,
          total_workouts: existing.total_workouts + 1,
          avg_session_duration: Math.round(
            (existing.avg_session_duration * existing.total_workouts + durationMinutes) /
            (existing.total_workouts + 1)
          ),
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      // Create new metrics for today
      const { error: insertError } = await supabase
        .from('progress_metrics')
        .insert({
          user_id: userId,
          date: today,
          total_volume: totalVolume,
          total_workouts: 1,
          avg_session_duration: durationMinutes,
        });

      if (insertError) throw insertError;
    }
  },

  /**
   * Get formatted completion message for user
   */
  getCompletionMessage(result: WorkoutCompletionResult): string {
    const messages: string[] = ['🎉 Workout Complete!'];

    // Add volume
    messages.push(`💪 Total Volume: ${Math.round(result.totalVolume)} lbs`);

    // Add duration
    messages.push(`⏱️ Duration: ${result.durationMinutes} minutes`);

    // Add streak
    messages.push(`🔥 Streak: ${result.currentStreak} days`);

    // Add mascot level-up
    if (result.mascotLeveledUp && result.milestoneMessage) {
      messages.push(`\n${result.milestoneMessage}`);
    }

    // Add PRs
    if (result.personalRecords.length > 0) {
      messages.push(`\n🏆 ${result.personalRecords.length} Personal Record${result.personalRecords.length > 1 ? 's' : ''}!`);
    }

    return messages.join('\n');
  },
};
