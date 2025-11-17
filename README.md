# XP HyperFit: Gamified Muscle & Fitness 🏋️‍♂️

> A world-class mobile fitness app with AI-powered form analysis (Phase 2), gamified mascot progression, and comprehensive workout tracking.

## 🎯 Overview

XP HyperFit is an advanced, gamified fitness app designed to serve a diverse spectrum of workout enthusiasts, from beginners to elite "Gym Junkies." The app features a comprehensive exercise library, personalized workout generation, **mascot companions that evolve with your workout streaks**, and intelligent progress tracking.

**Product Differentiators:**
- 🐉 **Mascot Progression System**: Level up at 7, 14, 30, 60, 90-day streaks
- 🎯 **Persona-Driven Workouts**: Automatically generated plans based on experience and goals
- 💪 **Intelligent PR Detection**: Automatic personal record tracking with 1RM calculations
- 📊 **Customizable Plateau Detection**: User-configurable stagnation alerts
- 🎮 **Gamified Experience**: Streaks, achievements, celebrations, social challenges

## 🚀 Current Status: Phase 1 MVP Complete

### ✅ Fully Implemented Features

#### 1. Complete Onboarding System
**5-step personalized onboarding flow:**
- **Welcome Screen**: Introduces app value proposition
- **Experience Level**: 4 personas (Beginner → Gym Junkie)
- **Goals Selection**: Multi-select fitness objectives
- **Workout Preferences**: Frequency, duration, equipment, gym access
- **Mascot Selection**: Choose your companion (6 options)
- **Intelligent Workout Generation**: Auto-creates personalized split

**Persona Distribution (aligned with PRD):**
- 25% Beginner
- 25% Intermediate
- 20% Advanced
- 30% Gym Junkie

#### 2. Personalized Workout Generator
**Adaptive split selection based on frequency and experience:**
- **2-3 days/week**: Full body split (all levels)
- **4-5 days/week**: Upper/Lower split (intermediate+)
- **6-7 days/week**: Push/Pull/Legs (advanced/gym junkie)

**Smart exercise selection:**
- Filters by difficulty level (1-5 scale)
- Respects equipment preferences
- Prioritizes compound movements
- Ensures balanced muscle group coverage
- Progressive overload parameters

**Sets/Reps based on goals:**
- Strength: 3-6 reps, 3-4min rest
- Hypertrophy: 8-12 reps, 90sec rest
- Endurance: 12-15 reps, 60sec rest

#### 3. Mascot Progression System (DIFFERENTIATOR)
**6 Mascots**: Dragon, Phoenix, Wolf, Bear, Lion, Tiger

**Level Progression (streak-based):**
- Level 1: 0-6 days
- Level 2: 7-13 days (🎉 First milestone!)
- Level 3: 14-29 days (🔥 Building momentum!)
- Level 4: 30-59 days (⚡ Serious commitment!)
- Level 5: 60-89 days (💪 Elite status!)
- Level 6: 90+ days (👑 Maximum level!)

**Features:**
- Auto-levels on workout completion
- Celebratory messages on level-up
- Visual transformations at milestones
- Motivational nudges (customizable frequency)

#### 4. Complete Workout Logging System
**Active Workout Session:**
- Real-time volume tracking: Σ(reps × weight)
- Session timer with live elapsed time
- Large touch targets (44px minimum) for gym use
- Quick set logging: reps, weight, RPE (optional)
- Set history with remove capability
- Progress indicators per exercise
- Auto-completion detection

**ActiveWorkoutCard Component:**
- Shows target sets × reps
- X/Y sets complete visualization
- Pre-filled inputs with targets
- Number pad optimized keyboards
- Accessibility compliant

**Post-Workout Workflow:**
1. Session completion with duration
2. Total volume calculation
3. Streak update (daily tracking)
4. Mascot level progression check
5. Personal record detection (all exercises)
6. Daily progress metrics update
7. Celebration modal with achievements

#### 5. Intelligent Progress Tracking
**Streak System:**
- Daily workout tracking
- Consecutive day detection
- Streak break handling
- Longest streak tracking
- Integrates with mascot progression

**Personal Records:**
- Auto-detection using Epley formula: `1RM = weight × (1 + reps/30)`
- Per-exercise PR tracking
- Historical comparison
- Celebration on new PRs

**Daily Metrics:**
- Total volume (aggregate)
- Workout count
- Average session duration
- Running statistics

#### 6. User Defaults & Settings
**Automatic initialization on signup:**
- Free tier subscription (3 form checks)
- Notification preferences (medium frequency)
- Plateau detection settings (experience-based)
- Streak record initialization

**Plateau Detection (customizable):**
- Beginner: 21-day window, 10% threshold
- Intermediate: 14-day window, 5% threshold
- Advanced: 14-day window, 3% threshold
- Metrics: volume, strength, frequency, recovery, ROM

#### 7. Component Library (Atomic Design)
**Atoms:**
- Button (4 variants, 3 sizes)
- Card (elevated option)
- Input (with validation states)

**Molecules:**
- OptionCard (selectable with icons)
- ProgressBar (5-step indicator)

**Organisms:**
- ActiveWorkoutCard (complete set logging)

**All components:**
- TypeScript strict mode
- WCAG 2.1 AA compliant
- Full accessibility support

#### 8. Database Schema (14 tables)
- **profiles**: User data with experience level
- **subscriptions**: Tier management (free/mid/top)
- **exercises**: 45+ exercises (expandable to 300-500)
- **workouts**: User workout templates
- **workout_exercises**: Exercise-workout junction
- **workout_sessions**: Actual workout instances
- **workout_sets**: Individual sets performed
- **mascots**: 6 mascot types with level progression
- **user_mascots**: User's mascot collection
- **personal_records**: PR tracking with calculated 1RM
- **streaks**: Current and longest streaks
- **progress_metrics**: Daily aggregated metrics
- **plateau_settings**: User-configurable detection
- **notification_settings**: Customizable alerts

**Row-Level Security:**
- All user data protected
- Proper RLS policies on all tables
- Public exercises and mascots
- Social features with friend visibility

### 🎨 Theme & Design System
- **Dark Mode**: Optimized for gym environments
- **WCAG 2.1 AA Compliant**: All color contrasts meet standards
- **Typography**: Minimum 16px body text, clear hierarchy
- **Spacing**: Consistent 4px base unit
- **Touch Targets**: 44px minimum for all interactive elements

## 📁 Project Structure

```
xp-hyperfit/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/
│   │   ├── index.tsx              # Home with mascot & streak
│   │   ├── workout.tsx            # Workout selection
│   │   ├── progress.tsx           # Analytics (Phase 2)
│   │   ├── social.tsx             # Social features (Phase 2)
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── onboarding/
│   │   ├── welcome.tsx
│   │   ├── experience.tsx         # Experience level selection
│   │   ├── goals.tsx              # Fitness goals
│   │   ├── preferences.tsx        # Workout preferences
│   │   ├── mascot.tsx             # Mascot selection
│   │   ├── complete.tsx           # Workout generation
│   │   └── _layout.tsx
│   ├── workout/
│   │   ├── active-session.tsx     # Live workout tracking
│   │   └── _layout.tsx
│   ├── _layout.tsx                # Root layout
│   └── index.tsx                  # Entry point with routing logic
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── molecules/
│   │   ├── OptionCard.tsx
│   │   └── ProgressBar.tsx
│   └── organisms/
│       └── ActiveWorkoutCard.tsx  # Complete set logging
├── lib/
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── exerciseService.ts
│   │   ├── workoutService.ts
│   │   ├── mascotService.ts
│   │   ├── streakService.ts
│   │   ├── onboardingService.ts
│   │   ├── workoutGeneratorService.ts
│   │   └── workoutCompletionService.ts  # Post-workout orchestration
│   ├── store/
│   │   ├── userStore.ts
│   │   └── workoutStore.ts
│   └── supabase.ts
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
├── types/
│   └── index.ts                   # Comprehensive TypeScript types
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                   # Exercises & mascots
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Supabase account and project
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JaceTheAce16/XP-HyperFit.git
   cd XP-HyperFit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at https://supabase.com
   - Go to SQL Editor
   - Run `supabase/migrations/001_initial_schema.sql` (creates tables)
   - Run `supabase/seed.sql` (adds exercises and mascots)
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   npm run ios      # iOS Simulator (Mac only)
   npm run android  # Android Emulator
   ```

## 💰 Pricing Tiers

### Free Tier
- ✅ 3 AI video form checks (total, lifetime) - Phase 2
- ✅ Complete workout logging
- ✅ Mascot progression system
- ✅ Personalized workout plans
- ✅ PR tracking and streaks
- ✅ Basic analytics
- ✅ Apple Health/Google Fit/Strava integration

### Mid Tier ($12.99/month, $99.99/year)
- ✅ Everything in Free
- 📹 5 AI video form checks per month (Phase 2)
- 📊 Advanced analytics and progress curves
- 🎯 Advanced plateau detection
- 🏆 Community leaderboards
- 🔔 Priority support

### Top Tier ($19.99/month, $149.99/year)
- ✅ Everything in Mid
- 📹 Unlimited AI video form checks (Phase 2)
- 🎙️ Voice + visual form feedback annotations (Phase 2)
- 📈 Advanced periodization
- 🤖 Priority AI coach responses (Phase 2)
- 👑 Elite features and early access

## 🔒 Accessibility

XP HyperFit is built to WCAG 2.1 Level AA standards:

- ✅ Minimum 16px font size for body text
- ✅ 44px minimum touch target size
- ✅ Color contrast ratios of 4.5:1 for text
- ✅ Screen reader labels on all interactive elements
- ✅ Semantic component structure
- ✅ Keyboard navigation support
- ✅ Clear visual focus indicators

## 🗺️ Roadmap

### Phase 1 MVP ✅ (COMPLETE)
- ✅ iOS app foundation
- ✅ Complete onboarding flow
- ✅ Personalized workout generator
- ✅ Workout logging with set tracking
- ✅ Mascot progression system
- ✅ Streak tracking
- ✅ PR detection
- ✅ Progress analytics

### Phase 2 (Next 3-6 Months)
- 📱 Android app launch
- 📹 AI video form analysis (Big 5 lifts)
- 🎬 Mascot animations and voice
- 📊 Advanced analytics dashboard
- 🏃 Exercise library browser
- 👥 Social features (friends, challenges, leaderboards)
- ⌚ Garmin + Fitbit integrations
- 🔕 Advanced notification system

### Phase 3 (6+ Months)
- 🍎 AI nutrition tracking (CalAI-inspired)
- 🎨 Mascot customization
- 📹 Full exercise form library
- 👥 Community groups and coaching
- 💬 In-app messaging
- 📤 External social media sharing

## 🔧 Development Standards

### Code Quality
- **TypeScript**: Strict mode enabled, 100% type coverage
- **Components**: Atomic design pattern (atoms → molecules → organisms)
- **Error Handling**: Try-catch blocks with user-friendly messages
- **Performance**: Optimized re-renders, lazy loading where applicable

### Git Workflow
- **Commits**: Conventional commits (feat, fix, docs, refactor, etc.)
- **Branches**: Feature branches merged to main
- **Code Review**: Required for all changes

## 📊 Success Metrics

### User Engagement
- Daily/weekly active users
- Streak retention rates
- Mascot level distribution
- Average session duration

### Conversion
- Free-to-paid conversion rates
- Trial engagement
- Form check usage (Phase 2)

### Progress Tracking
- PRs per user per month
- Plateau breakthrough rate
- Average streak length
- Total volume trends

## 🤝 Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is proprietary and confidential.

## 📧 Support

For support, email support@xphyperfit.com or open an issue in the repository.

---

**Built with ❤️ for the fitness community**

**Status**: Phase 1 MVP Complete ✅
**Next**: Android launch + AI form analysis (Phase 2)
