// User Types
export type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'gym_junkie';

export interface User {
  id: string;
  email: string;
  full_name: string;
  level: UserLevel;
  created_at: string;
  subscription_tier: SubscriptionTier;
  onboarding_completed: boolean;
}

// Subscription Types
export type SubscriptionTier = 'free' | 'mid' | 'top';

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  form_checks_remaining: number;
  form_checks_limit: number;
  started_at: string;
  expires_at: string | null;
}

// Exercise Types
export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'compound' | 'isolation';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'full_body' | 'cardio';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'kettlebell' | 'bands' | 'other';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  muscle_group: MuscleGroup;
  equipment: Equipment[];
  difficulty_level: number; // 1-5
  instructions: string[];
  video_url?: string;
  image_url?: string;
  is_compound: boolean;
  created_at: string;
}

// Workout Types
export interface Workout {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  is_template: boolean;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order: number;
  target_sets: number;
  target_reps: number;
  target_weight?: number;
  rest_seconds: number;
}

// Workout Session Types
export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string;
  started_at: string;
  completed_at?: string;
  notes?: string;
  duration_minutes?: number;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion 1-10
  completed_at: string;
}

// Mascot Types
export type MascotType = 'dragon' | 'phoenix' | 'wolf' | 'bear' | 'lion' | 'tiger';

export interface Mascot {
  id: string;
  name: string;
  type: MascotType;
  description: string;
  image_base_url: string;
  level_images: {
    [key: number]: string; // level -> image URL
  };
}

export interface UserMascot {
  id: string;
  user_id: string;
  mascot_id: string;
  current_level: number;
  streak_days: number;
  selected: boolean;
  unlocked_at: string;
}

// Progress Tracking Types
export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  achieved_at: string;
  one_rep_max: number; // Calculated
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_workout_date: string;
}

export interface ProgressMetrics {
  id: string;
  user_id: string;
  date: string;
  total_volume: number; // sets * reps * weight
  total_workouts: number;
  avg_session_duration: number;
  body_weight?: number;
}

// Plateau Detection Types
export type PlateauMetric = 'volume' | 'strength' | 'frequency' | 'recovery' | 'rom';

export interface PlateauSettings {
  id: string;
  user_id: string;
  enabled_metrics: PlateauMetric[];
  detection_window_days: number;
  threshold_percentage: number; // e.g., 5% stagnation
}

export interface DetectedPlateau {
  id: string;
  user_id: string;
  exercise_id?: string;
  metric: PlateauMetric;
  detected_at: string;
  resolved_at?: string;
  suggestion?: string;
}

// Social Types
export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'total_volume' | 'workout_count' | 'streak' | 'specific_exercise';
  target_value: number;
  start_date: string;
  end_date: string;
  created_by: string;
  is_public: boolean;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  current_value: number;
  joined_at: string;
  completed: boolean;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'friends' | 'challenge';
  time_period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  metric: 'total_volume' | 'workout_count' | 'streak';
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  user_id: string;
  rank: number;
  value: number;
  updated_at: string;
}

// Notification Types
export interface NotificationSettings {
  id: string;
  user_id: string;
  workout_reminders: boolean;
  friend_activity: boolean;
  challenge_updates: boolean;
  mascot_nudges: boolean;
  quiet_hours_start?: string; // HH:mm format
  quiet_hours_end?: string;
  frequency: 'high' | 'medium' | 'low' | 'quiet';
}

// Form Analysis Types (Phase 2, but schema ready)
export interface FormAnalysis {
  id: string;
  user_id: string;
  exercise_id: string;
  video_url: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  feedback_text?: string;
  feedback_voice_url?: string;
  annotations?: object; // JSON structure for visual annotations
  created_at: string;
  analyzed_at?: string;
}
