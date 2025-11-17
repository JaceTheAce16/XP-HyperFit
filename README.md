# XP HyperFit: Gamified Muscle & Fitness

> A world-class mobile fitness app with AI-powered form analysis, gamified mascot progression, and comprehensive social features.

## Overview

XP HyperFit is an advanced, gamified fitness app designed to serve a diverse spectrum of workout enthusiasts, from beginners to elite "Gym Junkies." The app leverages a comprehensive exercise library, AI-powered form feedback (Phase 2), customizable plateau detection, and engaging mascot progression to motivate and guide users toward their health and fitness goals.

## Tech Stack

- **Frontend**: React Native with Expo (TypeScript strict mode)
- **Backend**: Supabase (PostgreSQL, real-time subscriptions, Edge Functions)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet with atomic design system
- **Authentication**: Supabase Auth (email + social login)
- **Platform**: iOS (Phase 1), Android (Phase 2)

## Features (Phase 1 MVP)

### ✅ Completed

1. **Project Infrastructure**
   - React Native + Expo setup with TypeScript
   - Supabase backend configuration
   - Database schema with comprehensive tables
   - Row-level security (RLS) policies
   - Exercise library seed data (45+ exercises, expandable to 300-500)

2. **Theme System**
   - Dark mode optimized for gym environments
   - WCAG 2.1 Level AA compliant colors
   - Typography system with accessible font sizes
   - Spacing system with proper touch targets (44px minimum)

3. **Component Library (Atomic Design)**
   - **Atoms**: Button, Card, Input
   - All components fully accessible
   - Consistent styling and theming

4. **Authentication**
   - Email/password authentication
   - Sign up and login flows
   - Session management with auto-refresh

5. **Navigation**
   - Bottom tab navigation (Home, Workout, Progress, Social, Settings)
   - Auth flow with protected routes
   - Expo Router setup

6. **Core Services**
   - Exercise service (search, filter by muscle group/category)
   - Workout service (sessions, sets, PRs)
   - Mascot service (selection, level progression)
   - Streak service (daily tracking, longest streak)

### 🚧 In Progress

7. **Onboarding Flow**
   - Multi-step survey for personalization
   - Experience level selection
   - Workout preferences
   - Initial mascot selection

8. **Workout System**
   - Workout logging interface
   - Set/rep/weight tracking
   - Rest timer
   - Offline-first capability

9. **Mascot System**
   - 6 mascots (Dragon, Phoenix, Wolf, Bear, Lion, Tiger)
   - Level progression (1-5) based on streaks
   - Visual transformations at milestones (7, 14, 30, 60, 90 days)

10. **Progress Tracking**
    - Personal Records (PR) tracking
    - Streak visualization
    - Volume analytics
    - Plateau detection algorithm

11. **Social Features**
    - Friend system
    - Workout sharing
    - Challenges
    - Leaderboards

## Database Schema

### Core Tables

- **profiles**: User profiles with experience level and subscription
- **subscriptions**: Tier management (free, mid, top) and form check limits
- **exercises**: 300-500 exercise library with categories and muscle groups
- **workouts**: Workout templates (user-created and public)
- **workout_sessions**: Actual workout instances
- **workout_sets**: Individual sets performed
- **mascots**: 6 mascot types with level progression
- **user_mascots**: User's mascot collection and current selection
- **personal_records**: PR tracking with calculated 1RM
- **streaks**: Current and longest workout streaks
- **progress_metrics**: Daily aggregated metrics
- **plateau_settings**: Customizable plateau detection preferences
- **friendships**: Social connections
- **challenges**: User challenges and competitions
- **leaderboards**: Global and friend leaderboards

## Project Structure

```
xp-hyperfit/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home screen
│   │   ├── workout.tsx
│   │   ├── progress.tsx
│   │   ├── social.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
├── components/
│   ├── atoms/                    # Small, reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── molecules/                # Medium complexity (planned)
│   └── organisms/                # Complex components (planned)
├── lib/
│   ├── hooks/
│   │   └── useAuth.ts            # Authentication hook
│   ├── services/
│   │   ├── exerciseService.ts    # Exercise CRUD operations
│   │   ├── workoutService.ts     # Workout and PR management
│   │   ├── mascotService.ts      # Mascot progression logic
│   │   └── streakService.ts      # Streak calculations
│   ├── store/
│   │   ├── userStore.ts          # User state (Zustand)
│   │   └── workoutStore.ts       # Active workout state
│   └── supabase.ts               # Supabase client configuration
├── theme/
│   ├── colors.ts                 # Color system (WCAG AA)
│   ├── typography.ts             # Font system
│   ├── spacing.ts                # Spacing and touch targets
│   └── index.ts                  # Theme exports
├── types/
│   └── index.ts                  # TypeScript interfaces
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                  # Exercise and mascot seed data
├── app.json                      # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xp-hyperfit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at https://supabase.com
   - Run the migration: Copy contents of `supabase/migrations/001_initial_schema.sql` to SQL Editor
   - Run the seed data: Copy contents of `supabase/seed.sql` to SQL Editor
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on iOS simulator**
   ```bash
   npm run ios
   ```

## Pricing Tiers

### Free Tier
- 3 AI video form checks (total, lifetime)
- Basic workout plans
- Mascot progression
- Basic analytics
- Apple Health/Google Fit/Strava integration

### Mid Tier ($12.99/month, $99.99/year)
- 5 AI video form checks per month
- Advanced analytics and progress curves
- All workout programs
- Customizable plateau detection
- Priority support

### Top Tier ($19.99/month, $149.99/year)
- Unlimited AI video form checks
- Voice + visual form feedback annotations
- Advanced periodization
- Priority AI coach responses
- Full community access

## Accessibility

XP HyperFit is built to WCAG 2.1 Level AA standards:

- ✅ Minimum 16px font size for body text
- ✅ 44px minimum touch target size
- ✅ Sufficient color contrast ratios (4.5:1 for text)
- ✅ Screen reader labels on all interactive elements
- ✅ Semantic HTML/component structure
- ✅ Keyboard navigation support

## Development Standards

### Code Quality
- **TypeScript**: Strict mode enabled, full type coverage
- **Components**: Atomic design pattern (atoms → molecules → organisms)
- **Testing**: Unit tests for critical business logic (planned)
- **Error Handling**: Try-catch blocks with user-friendly messages
- **Performance**: React.memo for expensive components, lazy loading

### Git Workflow
- **Commits**: Conventional commits (feat, fix, docs, etc.)
- **Branches**: Feature branches merged to main
- **Pre-commit**: Prettier + ESLint formatting

## Roadmap

### Phase 1 MVP (Current)
- ✅ iOS app launch
- ✅ Core infrastructure and database
- ✅ Authentication system
- ✅ Theme and component library
- 🚧 Onboarding survey
- 🚧 Workout logging
- 🚧 Mascot system
- 🚧 Social features
- 🚧 Progress tracking
- 🚧 Health platform integrations

### Phase 2 (Months 3-6)
- Android app launch
- AI video form analysis (Big 5 lifts)
- Mascot animations and voice
- Advanced analytics dashboard
- Garmin + Fitbit integrations

### Phase 3 (Months 6+)
- AI nutrition tracking (CalAI-inspired)
- Mascot personalization
- Full exercise form library
- Community groups and coaching
- In-app messaging

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary and confidential.

## Support

For support, email support@xphyperfit.com or open an issue in the repository.

---

**Built with ❤️ for the fitness community**
