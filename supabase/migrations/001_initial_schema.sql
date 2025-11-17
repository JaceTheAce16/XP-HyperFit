-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_level AS ENUM ('beginner', 'intermediate', 'advanced', 'gym_junkie');
CREATE TYPE subscription_tier AS ENUM ('free', 'mid', 'top');
CREATE TYPE exercise_category AS ENUM ('strength', 'cardio', 'flexibility', 'compound', 'isolation');
CREATE TYPE muscle_group AS ENUM ('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body', 'cardio');
CREATE TYPE equipment AS ENUM ('barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'kettlebell', 'bands', 'other');
CREATE TYPE mascot_type AS ENUM ('dragon', 'phoenix', 'wolf', 'bear', 'lion', 'tiger');
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');
CREATE TYPE challenge_type AS ENUM ('total_volume', 'workout_count', 'streak', 'specific_exercise');
CREATE TYPE leaderboard_type AS ENUM ('global', 'friends', 'challenge');
CREATE TYPE time_period AS ENUM ('daily', 'weekly', 'monthly', 'all_time');
CREATE TYPE metric_type AS ENUM ('total_volume', 'workout_count', 'streak');
CREATE TYPE plateau_metric AS ENUM ('volume', 'strength', 'frequency', 'recovery', 'rom');
CREATE TYPE notification_frequency AS ENUM ('high', 'medium', 'low', 'quiet');
CREATE TYPE analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  level user_level DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier subscription_tier DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  UNIQUE(email)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  form_checks_remaining INTEGER NOT NULL DEFAULT 3,
  form_checks_limit INTEGER NOT NULL DEFAULT 3,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  UNIQUE(user_id)
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category exercise_category NOT NULL,
  muscle_group muscle_group NOT NULL,
  equipment equipment[] NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  instructions JSONB,
  video_url TEXT,
  image_url TEXT,
  is_compound BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts (templates)
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE
);

-- Workout Exercises (exercise in a workout)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  target_sets INTEGER,
  target_reps INTEGER,
  target_weight DECIMAL,
  rest_seconds INTEGER DEFAULT 90
);

-- Workout Sessions (actual workout instance)
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  duration_minutes INTEGER
);

-- Workout Sets (actual set performed)
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL NOT NULL DEFAULT 0,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mascots
CREATE TABLE mascots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type mascot_type NOT NULL,
  description TEXT,
  image_base_url TEXT,
  level_images JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Mascots
CREATE TABLE user_mascots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mascot_id UUID NOT NULL REFERENCES mascots(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  selected BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mascot_id)
);

-- Personal Records
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  reps INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  one_rep_max DECIMAL GENERATED ALWAYS AS (weight * (1 + reps / 30.0)) STORED
);

-- Streaks
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  UNIQUE(user_id)
);

-- Progress Metrics (daily aggregates)
CREATE TABLE progress_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_volume DECIMAL DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  avg_session_duration INTEGER,
  body_weight DECIMAL,
  UNIQUE(user_id, date)
);

-- Plateau Detection Settings
CREATE TABLE plateau_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enabled_metrics plateau_metric[] DEFAULT ARRAY['volume', 'strength']::plateau_metric[],
  detection_window_days INTEGER DEFAULT 14,
  threshold_percentage DECIMAL DEFAULT 5.0,
  UNIQUE(user_id)
);

-- Detected Plateaus
CREATE TABLE detected_plateaus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  metric plateau_metric NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  suggestion TEXT
);

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_id != friend_id)
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type challenge_type NOT NULL,
  target_value DECIMAL NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Participants
CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_value DECIMAL DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(challenge_id, user_id)
);

-- Leaderboards
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type leaderboard_type NOT NULL,
  time_period time_period NOT NULL,
  metric metric_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard Entries
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  value DECIMAL NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(leaderboard_id, user_id)
);

-- Notification Settings
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workout_reminders BOOLEAN DEFAULT TRUE,
  friend_activity BOOLEAN DEFAULT TRUE,
  challenge_updates BOOLEAN DEFAULT TRUE,
  mascot_nudges BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  frequency notification_frequency DEFAULT 'medium',
  UNIQUE(user_id)
);

-- Form Analysis (Phase 2, but schema ready)
CREATE TABLE form_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  analysis_status analysis_status DEFAULT 'pending',
  feedback_text TEXT,
  feedback_voice_url TEXT,
  annotations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_workout_sets_session ON workout_sets(session_id);
CREATE INDEX idx_personal_records_user ON personal_records(user_id);
CREATE INDEX idx_progress_metrics_user_date ON progress_metrics(user_id, date);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_leaderboard_entries_leaderboard ON leaderboard_entries(leaderboard_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mascots ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE plateau_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_plateaus ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for workouts
CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "Users can create own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for workout sessions
CREATE POLICY "Users can view own sessions" ON workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON workout_sessions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for workout sets
CREATE POLICY "Users can view own sets" ON workout_sets FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM workout_sessions WHERE id = session_id)
);
CREATE POLICY "Users can create own sets" ON workout_sets FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM workout_sessions WHERE id = session_id)
);

-- RLS Policies for user mascots
CREATE POLICY "Users can view own mascots" ON user_mascots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own mascots" ON user_mascots FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for personal records
CREATE POLICY "Users can view own PRs" ON personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own PRs" ON personal_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streaks
CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for progress metrics
CREATE POLICY "Users can view own metrics" ON progress_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own metrics" ON progress_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for plateau settings
CREATE POLICY "Users can view own plateau settings" ON plateau_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own plateau settings" ON plateau_settings FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for friendships
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friendships" ON friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own friendships" ON friendships FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Exercises are public (read-only for users)
CREATE POLICY "Everyone can view exercises" ON exercises FOR SELECT TO authenticated USING (true);

-- Mascots are public
CREATE POLICY "Everyone can view mascots" ON mascots FOR SELECT TO authenticated USING (true);

-- Challenges are visible based on is_public flag
CREATE POLICY "Users can view public challenges" ON challenges FOR SELECT USING (is_public = TRUE OR created_by = auth.uid());
CREATE POLICY "Users can create challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Challenge participants
CREATE POLICY "Users can view challenge participants" ON challenge_participants FOR SELECT USING (
  user_id = auth.uid() OR
  challenge_id IN (SELECT id FROM challenges WHERE is_public = TRUE)
);
CREATE POLICY "Users can join challenges" ON challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboards and entries are public
CREATE POLICY "Everyone can view leaderboards" ON leaderboards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Everyone can view leaderboard entries" ON leaderboard_entries FOR SELECT TO authenticated USING (true);

-- Notification settings
CREATE POLICY "Users can view own notification settings" ON notification_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notification settings" ON notification_settings FOR UPDATE USING (auth.uid() = user_id);

-- Form analyses
CREATE POLICY "Users can view own form analyses" ON form_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own form analyses" ON form_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
