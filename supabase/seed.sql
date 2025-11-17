-- Seed Mascots
INSERT INTO mascots (name, type, description, image_base_url, level_images) VALUES
('Blaze', 'dragon', 'A fierce dragon that grows more powerful with your dedication', '/mascots/dragon',
  '{"1": "/mascots/dragon/level1.png", "2": "/mascots/dragon/level2.png", "3": "/mascots/dragon/level3.png", "4": "/mascots/dragon/level4.png", "5": "/mascots/dragon/level5.png"}'::jsonb),
('Ember', 'phoenix', 'Rise from the ashes stronger than before', '/mascots/phoenix',
  '{"1": "/mascots/phoenix/level1.png", "2": "/mascots/phoenix/level2.png", "3": "/mascots/phoenix/level3.png", "4": "/mascots/phoenix/level4.png", "5": "/mascots/phoenix/level5.png"}'::jsonb),
('Fenrir', 'wolf', 'Hunt your goals with unwavering focus', '/mascots/wolf',
  '{"1": "/mascots/wolf/level1.png", "2": "/mascots/wolf/level2.png", "3": "/mascots/wolf/level3.png", "4": "/mascots/wolf/level4.png", "5": "/mascots/wolf/level5.png"}'::jsonb),
('Ursa', 'bear', 'Build strength like the mighty bear', '/mascots/bear',
  '{"1": "/mascots/bear/level1.png", "2": "/mascots/bear/level2.png", "3": "/mascots/bear/level3.png", "4": "/mascots/bear/level4.png", "5": "/mascots/bear/level5.png"}'::jsonb),
('Leo', 'lion', 'Lead your fitness journey with courage', '/mascots/lion',
  '{"1": "/mascots/lion/level1.png", "2": "/mascots/lion/level2.png", "3": "/mascots/lion/level3.png", "4": "/mascots/lion/level4.png", "5": "/mascots/lion/level5.png"}'::jsonb),
('Tigris', 'tiger', 'Strike your PRs with precision and power', '/mascots/tiger',
  '{"1": "/mascots/tiger/level1.png", "2": "/mascots/tiger/level2.png", "3": "/mascots/tiger/level3.png", "4": "/mascots/tiger/level4.png", "5": "/mascots/tiger/level5.png"}'::jsonb);

-- Seed Exercises - Chest
INSERT INTO exercises (name, description, category, muscle_group, equipment, difficulty_level, instructions, is_compound) VALUES
('Barbell Bench Press', 'The king of chest exercises for building mass and strength', 'compound', 'chest', ARRAY['barbell']::equipment[], 3,
  '["Lie flat on bench with feet planted", "Grip bar slightly wider than shoulder width", "Lower bar to mid-chest with control", "Press bar up to full extension", "Maintain tight core throughout"]'::jsonb, true),
('Dumbbell Bench Press', 'Great for balanced chest development and shoulder health', 'compound', 'chest', ARRAY['dumbbell']::equipment[], 3,
  '["Lie on bench with dumbbells at chest level", "Press weights up until arms fully extended", "Lower with control to chest level", "Keep elbows at 45-degree angle", "Maintain stable shoulder blades"]'::jsonb, true),
('Incline Barbell Bench Press', 'Targets upper chest for complete development', 'compound', 'chest', ARRAY['barbell']::equipment[], 3,
  '["Set bench to 30-45 degree incline", "Grip bar slightly wider than shoulders", "Lower to upper chest", "Press to full extension", "Keep feet planted for stability"]'::jsonb, true),
('Cable Fly', 'Perfect isolation for chest stretch and contraction', 'isolation', 'chest', ARRAY['cable']::equipment[], 2,
  '["Set cables to chest height", "Stand in center with slight forward lean", "Bring handles together in front of chest", "Squeeze chest at peak contraction", "Return with control to stretch"]'::jsonb, false),
('Push-ups', 'Classic bodyweight chest builder', 'compound', 'chest', ARRAY['bodyweight']::equipment[], 1,
  '["Start in plank position", "Lower body until chest nearly touches ground", "Keep elbows close to body", "Push back to starting position", "Maintain straight body line"]'::jsonb, true),
('Dumbbell Fly', 'Excellent for chest stretch and mind-muscle connection', 'isolation', 'chest', ARRAY['dumbbell']::equipment[], 2,
  '["Lie on bench with dumbbells extended above chest", "Lower weights in arc motion", "Feel stretch in chest", "Return to starting position", "Keep slight bend in elbows"]'::jsonb, false),

-- Back Exercises
('Barbell Deadlift', 'The ultimate full-body strength builder', 'compound', 'back', ARRAY['barbell']::equipment[], 4,
  '["Stand with feet hip-width apart", "Grip bar just outside legs", "Keep back straight and chest up", "Drive through heels to stand", "Lower bar with control"]'::jsonb, true),
('Pull-ups', 'Best bodyweight exercise for back development', 'compound', 'back', ARRAY['bodyweight']::equipment[], 3,
  '["Hang from bar with overhand grip", "Pull body up until chin over bar", "Lower with control", "Keep core tight", "Avoid swinging"]'::jsonb, true),
('Barbell Row', 'Classic back thickness builder', 'compound', 'back', ARRAY['barbell']::equipment[], 3,
  '["Bend forward at hips", "Grip bar with hands shoulder-width", "Pull bar to lower chest", "Squeeze shoulder blades together", "Lower with control"]'::jsonb, true),
('Lat Pulldown', 'Great for building back width', 'compound', 'back', ARRAY['cable', 'machine']::equipment[], 2,
  '["Sit at machine with thighs secured", "Grip bar wider than shoulders", "Pull bar to upper chest", "Squeeze lats at bottom", "Control return to top"]'::jsonb, false),
('Seated Cable Row', 'Perfect for mid-back development', 'compound', 'back', ARRAY['cable']::equipment[], 2,
  '["Sit at cable station", "Grip handle with both hands", "Pull to torso keeping back straight", "Squeeze shoulder blades", "Extend arms with control"]'::jsonb, false),
('Dumbbell Row', 'Unilateral back builder for balance', 'compound', 'back', ARRAY['dumbbell']::equipment[], 2,
  '["Place one knee and hand on bench", "Hold dumbbell in free hand", "Pull weight to hip", "Keep back parallel to ground", "Lower with control"]'::jsonb, false),

-- Leg Exercises
('Barbell Squat', 'The king of leg exercises', 'compound', 'legs', ARRAY['barbell']::equipment[], 4,
  '["Bar on upper back", "Feet shoulder-width apart", "Squat down keeping chest up", "Go to parallel or below", "Drive through heels to stand"]'::jsonb, true),
('Romanian Deadlift', 'Best hamstring developer', 'compound', 'legs', ARRAY['barbell']::equipment[], 3,
  '["Hold bar at hip level", "Hinge at hips keeping legs straight", "Lower bar down shins", "Feel hamstring stretch", "Drive hips forward to return"]'::jsonb, true),
('Leg Press', 'Safe alternative for quad development', 'compound', 'legs', ARRAY['machine']::equipment[], 2,
  '["Sit in machine with back supported", "Place feet shoulder-width on platform", "Lower platform with control", "Press through heels", "Avoid locking knees at top"]'::jsonb, false),
('Walking Lunges', 'Unilateral leg strength and balance', 'compound', 'legs', ARRAY['dumbbell', 'bodyweight']::equipment[], 2,
  '["Step forward into lunge position", "Lower back knee toward ground", "Push through front heel", "Step forward with back leg", "Alternate legs"]'::jsonb, true),
('Leg Curl', 'Isolation for hamstrings', 'isolation', 'legs', ARRAY['machine']::equipment[], 1,
  '["Lie face down on machine", "Place heels under pad", "Curl legs toward glutes", "Squeeze hamstrings", "Lower with control"]'::jsonb, false),
('Leg Extension', 'Quad isolation exercise', 'isolation', 'legs', ARRAY['machine']::equipment[], 1,
  '["Sit in machine", "Place shins behind pad", "Extend legs to full extension", "Squeeze quads at top", "Lower with control"]'::jsonb, false),

-- Shoulder Exercises
('Overhead Press', 'Best overall shoulder developer', 'compound', 'shoulders', ARRAY['barbell']::equipment[], 3,
  '["Bar at shoulder level", "Feet shoulder-width apart", "Press bar overhead", "Lock out at top", "Lower to shoulders with control"]'::jsonb, true),
('Dumbbell Shoulder Press', 'Great for balanced shoulder development', 'compound', 'shoulders', ARRAY['dumbbell']::equipment[], 2,
  '["Sit with back supported", "Start with dumbbells at shoulder level", "Press weights overhead", "Avoid arching back", "Lower to shoulders"]'::jsonb, true),
('Lateral Raise', 'Isolation for side delts', 'isolation', 'shoulders', ARRAY['dumbbell']::equipment[], 2,
  '["Stand with dumbbells at sides", "Raise weights to shoulder height", "Keep slight bend in elbows", "Lower with control", "Avoid using momentum"]'::jsonb, false),
('Face Pull', 'Rear delt and upper back health', 'isolation', 'shoulders', ARRAY['cable']::equipment[], 2,
  '["Set cable to face height", "Pull rope toward face", "Separate hands at end", "Squeeze rear delts", "Control return"]'::jsonb, false),
('Arnold Press', 'Complete shoulder developer', 'compound', 'shoulders', ARRAY['dumbbell']::equipment[], 3,
  '["Start with palms facing you", "Rotate and press overhead", "Reverse motion to return", "Full range of motion", "Control throughout"]'::jsonb, true),

-- Arm Exercises
('Barbell Curl', 'Classic bicep mass builder', 'isolation', 'arms', ARRAY['barbell']::equipment[], 2,
  '["Stand with bar at arms length", "Curl bar to shoulders", "Keep elbows stationary", "Squeeze biceps at top", "Lower with control"]'::jsonb, false),
('Dumbbell Curl', 'Versatile bicep developer', 'isolation', 'arms', ARRAY['dumbbell']::equipment[], 2,
  '["Stand with dumbbells at sides", "Curl weights to shoulders", "Can alternate or do both together", "Keep upper arms still", "Control descent"]'::jsonb, false),
('Tricep Dips', 'Best bodyweight tricep exercise', 'compound', 'arms', ARRAY['bodyweight']::equipment[], 3,
  '["Support body on parallel bars", "Lower body by bending elbows", "Go until upper arms parallel", "Press back to start", "Lean forward for chest emphasis"]'::jsonb, true),
('Skull Crusher', 'Excellent tricep mass builder', 'isolation', 'arms', ARRAY['barbell', 'dumbbell']::equipment[], 2,
  '["Lie on bench with bar extended", "Lower bar to forehead", "Keep upper arms vertical", "Extend arms to return", "Control throughout"]'::jsonb, false),
('Cable Tricep Pushdown', 'Great tricep isolation', 'isolation', 'arms', ARRAY['cable']::equipment[], 1,
  '["Stand at cable station", "Push bar down to full extension", "Keep elbows at sides", "Squeeze triceps at bottom", "Return with control"]'::jsonb, false),
('Hammer Curl', 'Targets brachialis for arm thickness', 'isolation', 'arms', ARRAY['dumbbell']::equipment[], 2,
  '["Hold dumbbells with neutral grip", "Curl weights to shoulders", "Keep thumbs up throughout", "Control descent", "Avoid swinging"]'::jsonb, false),

-- Core Exercises
('Plank', 'Foundation core stability exercise', 'strength', 'core', ARRAY['bodyweight']::equipment[], 1,
  '["Support body on forearms and toes", "Keep body in straight line", "Engage core and glutes", "Hold position", "Breathe steadily"]'::jsonb, false),
('Cable Crunch', 'Weighted ab exercise for development', 'isolation', 'core', ARRAY['cable']::equipment[], 2,
  '["Kneel in front of cable", "Hold rope behind head", "Crunch down bringing elbows to knees", "Squeeze abs", "Return with control"]'::jsonb, false),
('Russian Twist', 'Oblique strengthener', 'isolation', 'core', ARRAY['bodyweight', 'dumbbell']::equipment[], 2,
  '["Sit with knees bent, feet off ground", "Rotate torso side to side", "Touch ground on each side", "Keep core engaged", "Control rotation"]'::jsonb, false),
('Hanging Leg Raise', 'Advanced core exercise', 'compound', 'core', ARRAY['bodyweight']::equipment[], 3,
  '["Hang from pull-up bar", "Raise legs to 90 degrees", "Keep legs straight if possible", "Lower with control", "Avoid swinging"]'::jsonb, false),
('Ab Wheel Rollout', 'Challenging core strengthener', 'compound', 'core', ARRAY['other']::equipment[], 3,
  '["Start on knees with wheel", "Roll forward extending body", "Keep core tight", "Roll back to start", "Maintain control"]'::jsonb, false),

-- Cardio Exercises
('Running', 'Classic cardiovascular exercise', 'cardio', 'cardio', ARRAY['bodyweight']::equipment[], 1,
  '["Maintain steady pace", "Land midfoot", "Keep upright posture", "Breathe rhythmically", "Start slow and progress"]'::jsonb, false),
('Rowing Machine', 'Full-body cardio workout', 'cardio', 'full_body', ARRAY['machine']::equipment[], 2,
  '["Sit on rower with feet secured", "Push with legs first", "Pull handle to chest", "Extend arms, then legs", "Maintain rhythm"]'::jsonb, false),
('Jump Rope', 'High-intensity cardio', 'cardio', 'cardio', ARRAY['other']::equipment[], 2,
  '["Hold rope handles", "Jump over rope as it passes", "Land on balls of feet", "Keep elbows close", "Maintain rhythm"]'::jsonb, false),
('Burpees', 'Full-body conditioning', 'cardio', 'full_body', ARRAY['bodyweight']::equipment[], 3,
  '["Start standing", "Drop to push-up position", "Perform push-up", "Jump feet to hands", "Explode up with jump"]'::jsonb, true),
('Cycling', 'Low-impact cardio option', 'cardio', 'cardio', ARRAY['machine']::equipment[], 1,
  '["Adjust seat height properly", "Maintain steady cadence", "Vary resistance for intensity", "Keep core engaged", "Breathe steadily"]'::jsonb, false);

-- Create default leaderboards
INSERT INTO leaderboards (type, time_period, metric) VALUES
('global', 'weekly', 'total_volume'),
('global', 'monthly', 'total_volume'),
('global', 'all_time', 'total_volume'),
('global', 'weekly', 'workout_count'),
('global', 'monthly', 'workout_count'),
('global', 'weekly', 'streak'),
('global', 'monthly', 'streak'),
('friends', 'weekly', 'total_volume'),
('friends', 'monthly', 'total_volume');
