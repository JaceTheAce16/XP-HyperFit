import { supabase } from '../supabase';
import {
  OnboardingData,
  UserLevel,
  FitnessGoal,
  Exercise,
  Workout,
  WorkoutExercise,
  MuscleGroup,
} from '@/types';

/**
 * Workout Generator Service
 * Creates personalized workout plans based on user profile and goals
 *
 * KEY DIFFERENTIATOR: Persona-driven workout generation with progressive overload
 */
export const workoutGeneratorService = {
  /**
   * Generate initial workout plan based on onboarding data
   * Returns array of workout IDs created for the user
   */
  async generateInitialWorkoutPlan(
    userId: string,
    onboardingData: OnboardingData
  ): Promise<string[]> {
    const { experience_level, fitness_goals, preferred_equipment, has_gym_access } = onboardingData;

    // Determine split type based on frequency and goals
    const workoutSplit = this.determineWorkoutSplit(onboardingData);

    // Generate workouts for the split
    const workoutIds: string[] = [];

    for (const day of workoutSplit) {
      const workoutId = await this.createWorkout(
        userId,
        day.name,
        day.description,
        day.muscleGroups,
        experience_level,
        fitness_goals,
        preferred_equipment,
        has_gym_access
      );
      workoutIds.push(workoutId);
    }

    return workoutIds;
  },

  /**
   * Determine workout split based on frequency and goals
   */
  determineWorkoutSplit(data: OnboardingData) {
    const { workout_frequency, fitness_goals } = data;

    // For beginners and 2-3 days: Full body
    if (data.experience_level === 'beginner' || workout_frequency === '2-3') {
      return [
        {
          name: 'Full Body A',
          description: 'Complete full body workout - push focus',
          muscleGroups: ['chest', 'shoulders', 'legs', 'core'] as MuscleGroup[],
        },
        {
          name: 'Full Body B',
          description: 'Complete full body workout - pull focus',
          muscleGroups: ['back', 'arms', 'legs', 'core'] as MuscleGroup[],
        },
      ];
    }

    // For intermediate 4-5 days: Upper/Lower split
    if (workout_frequency === '4-5' &&
        (data.experience_level === 'intermediate' || data.experience_level === 'advanced')) {
      return [
        {
          name: 'Upper Body A - Push',
          description: 'Chest, shoulders, and triceps',
          muscleGroups: ['chest', 'shoulders', 'arms'] as MuscleGroup[],
        },
        {
          name: 'Lower Body A',
          description: 'Quads, hamstrings, glutes, and calves',
          muscleGroups: ['legs', 'core'] as MuscleGroup[],
        },
        {
          name: 'Upper Body B - Pull',
          description: 'Back and biceps',
          muscleGroups: ['back', 'arms'] as MuscleGroup[],
        },
        {
          name: 'Lower Body B',
          description: 'Posterior chain focus',
          muscleGroups: ['legs', 'core'] as MuscleGroup[],
        },
      ];
    }

    // For advanced/gym junkie 6-7 days: PPL (Push/Pull/Legs)
    if (workout_frequency === '6-7' &&
        (data.experience_level === 'advanced' || data.experience_level === 'gym_junkie')) {
      return [
        {
          name: 'Push Day',
          description: 'Chest, shoulders, and triceps',
          muscleGroups: ['chest', 'shoulders', 'arms'] as MuscleGroup[],
        },
        {
          name: 'Pull Day',
          description: 'Back and biceps',
          muscleGroups: ['back', 'arms'] as MuscleGroup[],
        },
        {
          name: 'Leg Day',
          description: 'Complete lower body',
          muscleGroups: ['legs', 'core'] as MuscleGroup[],
        },
      ];
    }

    // Default: Full body for 4-5 days
    return [
      {
        name: 'Full Body A',
        description: 'Complete full body workout - push focus',
        muscleGroups: ['chest', 'shoulders', 'legs', 'core'] as MuscleGroup[],
      },
      {
        name: 'Full Body B',
        description: 'Complete full body workout - pull focus',
        muscleGroups: ['back', 'arms', 'legs', 'core'] as MuscleGroup[],
      },
      {
        name: 'Full Body C',
        description: 'Complete full body workout - balanced',
        muscleGroups: ['chest', 'back', 'legs', 'core'] as MuscleGroup[],
      },
    ];
  },

  /**
   * Create a single workout with exercises
   */
  async createWorkout(
    userId: string,
    name: string,
    description: string,
    muscleGroups: MuscleGroup[],
    experienceLevel: UserLevel,
    fitnessGoals: FitnessGoal[],
    preferredEquipment: string[],
    hasGymAccess: boolean
  ): Promise<string> {
    // Create workout template
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        name,
        description,
        is_template: true,
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Get appropriate exercises for this workout
    const exercises = await this.selectExercises(
      muscleGroups,
      experienceLevel,
      preferredEquipment,
      hasGymAccess
    );

    // Add exercises to workout
    const workoutExercises: Omit<WorkoutExercise, 'id'>[] = exercises.map((exercise, index) => ({
      workout_id: workout.id,
      exercise_id: exercise.id,
      order: index,
      target_sets: this.getTargetSets(experienceLevel, fitnessGoals),
      target_reps: this.getTargetReps(experienceLevel, fitnessGoals, exercise.is_compound),
      rest_seconds: this.getRestTime(experienceLevel, exercise.is_compound),
    }));

    const { error: exerciseError } = await supabase
      .from('workout_exercises')
      .insert(workoutExercises);

    if (exerciseError) throw exerciseError;

    return workout.id;
  },

  /**
   * Select appropriate exercises based on criteria
   */
  async selectExercises(
    muscleGroups: MuscleGroup[],
    experienceLevel: UserLevel,
    preferredEquipment: string[],
    hasGymAccess: boolean
  ): Promise<Exercise[]> {
    // Build query
    let query = supabase
      .from('exercises')
      .select('*')
      .in('muscle_group', muscleGroups);

    // Filter by equipment if specified
    if (preferredEquipment.length > 0) {
      query = query.overlaps('equipment', preferredEquipment);
    }

    // If no gym access, prioritize bodyweight and minimal equipment
    if (!hasGymAccess) {
      query = query.in('equipment', [['bodyweight'], ['bands'], ['dumbbell']]);
    }

    // Filter by difficulty based on experience
    const maxDifficulty = this.getMaxDifficulty(experienceLevel);
    query = query.lte('difficulty_level', maxDifficulty);

    const { data: allExercises, error } = await query;
    if (error) throw error;

    if (!allExercises || allExercises.length === 0) {
      throw new Error('No exercises found matching criteria');
    }

    // Select balanced set of exercises
    return this.balanceExerciseSelection(allExercises, muscleGroups, experienceLevel);
  },

  /**
   * Balance exercise selection to ensure good coverage
   */
  balanceExerciseSelection(
    exercises: Exercise[],
    muscleGroups: MuscleGroup[],
    experienceLevel: UserLevel
  ): Exercise[] {
    const selected: Exercise[] = [];
    const totalExercises = experienceLevel === 'beginner' ? 4 :
                          experienceLevel === 'intermediate' ? 6 : 8;

    // Prioritize compound movements
    const compounds = exercises.filter(e => e.is_compound);
    const isolations = exercises.filter(e => !e.is_compound);

    // Add 2-3 compound exercises
    const compoundCount = Math.min(3, compounds.length);
    for (let i = 0; i < compoundCount; i++) {
      if (compounds[i]) selected.push(compounds[i]);
    }

    // Fill remaining with isolation exercises, ensuring muscle group coverage
    const remaining = totalExercises - selected.length;
    for (const muscleGroup of muscleGroups) {
      const groupExercises = isolations.filter(e => e.muscle_group === muscleGroup);
      if (groupExercises.length > 0 && selected.length < totalExercises) {
        selected.push(groupExercises[0]);
      }
    }

    // Fill any remaining slots
    while (selected.length < totalExercises && isolations.length > 0) {
      const remaining = isolations.find(e => !selected.includes(e));
      if (remaining) selected.push(remaining);
      else break;
    }

    return selected.slice(0, totalExercises);
  },

  /**
   * Get maximum difficulty for experience level
   */
  getMaxDifficulty(level: UserLevel): number {
    switch (level) {
      case 'beginner': return 2;
      case 'intermediate': return 3;
      case 'advanced': return 4;
      case 'gym_junkie': return 5;
      default: return 2;
    }
  },

  /**
   * Get target sets based on experience and goals
   */
  getTargetSets(level: UserLevel, goals: FitnessGoal[]): number {
    // Strength focus needs fewer sets, hypertrophy needs more
    const isStrengthFocus = goals.includes('gain_strength');

    switch (level) {
      case 'beginner': return 3;
      case 'intermediate': return isStrengthFocus ? 4 : 3;
      case 'advanced': return isStrengthFocus ? 5 : 4;
      case 'gym_junkie': return isStrengthFocus ? 5 : 4;
      default: return 3;
    }
  },

  /**
   * Get target reps based on experience, goals, and exercise type
   */
  getTargetReps(level: UserLevel, goals: FitnessGoal[], isCompound: boolean): number {
    const isStrengthFocus = goals.includes('gain_strength');
    const isHypertrophyFocus = goals.includes('build_muscle');

    // Strength: 3-6 reps, Hypertrophy: 8-12 reps, General: 6-10 reps
    if (isStrengthFocus) {
      return isCompound ? 5 : 8;
    } else if (isHypertrophyFocus) {
      return isCompound ? 8 : 12;
    } else {
      return isCompound ? 8 : 10;
    }
  },

  /**
   * Get rest time based on experience and exercise type
   */
  getRestTime(level: UserLevel, isCompound: boolean): number {
    // Compound exercises need more rest
    const baseRest = isCompound ? 180 : 90; // 3min or 90sec

    // Advanced lifters may need more rest for heavy compounds
    if (level === 'advanced' || level === 'gym_junkie') {
      return isCompound ? 240 : 90; // 4min or 90sec
    }

    return baseRest;
  },
};
