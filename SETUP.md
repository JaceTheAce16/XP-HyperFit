# XP HyperFit - Development Build Setup

This guide will help you build and install XP HyperFit on your phone as a standalone development app.

## Prerequisites

### 1. Install Required Tools

```bash
# Install Node.js 18+ (if not already installed)
node --version

# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

### 2. Create Expo Account

If you don't have an Expo account:
1. Go to https://expo.dev
2. Sign up for a free account
3. Verify your email

## Setup Steps

### Step 1: Login to EAS

```bash
# Login to your Expo account
eas login
```

Enter your Expo username and password when prompted.

### Step 2: Configure Your Project

```bash
# Initialize EAS in your project (if not already done)
eas build:configure
```

This will:
- Create/update `eas.json` (already configured)
- Link your project to your Expo account
- Update `app.json` with your project ID

### Step 3: Set Up Environment Variables

**Option A: For EAS Secrets (Recommended for builds)**

```bash
# Add your Supabase credentials as EAS secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_supabase_url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_supabase_anon_key"

# Verify secrets were added
eas secret:list
```

**Option B: Local .env file (For local development)**

```bash
# Create .env file from example
cp .env.example .env

# Edit .env and add your credentials:
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get Supabase Credentials:**
1. Go to https://supabase.com
2. Open your project (or create one)
3. Settings → API
4. Copy "Project URL" and "anon public" key

### Step 4: Install Dependencies

```bash
npm install
```

This will install `expo-dev-client` and all other dependencies.

### Step 5: Set Up Supabase Database

If you haven't already:

1. Go to Supabase SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/seed.sql`

## Building for Your Device

### iOS (iPhone/iPad)

**Option 1: Build for Simulator (Mac only)**

```bash
eas build --profile development --platform ios --local
```

**Option 2: Build for Physical Device**

```bash
# Build on EAS servers (recommended)
eas build --profile development --platform ios

# This will:
# - Build your app in the cloud (10-20 minutes)
# - Generate an installable .ipa file
# - Provide a QR code or download link
```

**Installing on iPhone:**
1. Scan the QR code with your iPhone camera
2. Download the build
3. Go to Settings → General → VPN & Device Management
4. Trust the developer certificate
5. Open XP HyperFit app

**Note:** For iOS, you need:
- Apple Developer account ($99/year for production)
- OR use Ad Hoc provisioning (free, limited devices)

### Android

**Build APK (easier, recommended):**

```bash
# Build on EAS servers
eas build --profile development --platform android

# This will:
# - Build your app in the cloud (10-20 minutes)
# - Generate an installable .apk file
# - Provide a QR code or download link
```

**Installing on Android:**
1. Scan QR code or download the APK on your phone
2. Allow installation from unknown sources when prompted
3. Install and open XP HyperFit

**Local Build (if you have Android Studio):**

```bash
eas build --profile development --platform android --local
```

## Running Your Development Build

Once installed, you have two options:

### Option 1: Connect to Dev Server (Recommended)

1. Start the dev server on your laptop:
   ```bash
   npx expo start --dev-client
   ```

2. On your phone:
   - Open the XP HyperFit dev app
   - Scan the QR code or enter the URL manually
   - App will load with hot reload enabled

**Benefits:**
- Instant updates as you code
- Full debugging capabilities
- No need to rebuild

### Option 2: Standalone Mode

Your development build can also run standalone with the bundled JavaScript, but you won't get live updates.

## Troubleshooting

### Build Fails

**"No bundle identifier":**
- iOS builds need a bundle identifier
- Already configured: `com.xphyperfit.app`
- If still failing, you may need an Apple Developer account

**"Invalid credentials":**
```bash
# Re-login to EAS
eas logout
eas login
```

**"Project not configured":**
```bash
# Re-initialize EAS
eas build:configure
```

### Environment Variables Not Working

**Check secrets:**
```bash
eas secret:list
```

**If missing, re-add:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_key"
```

### Can't Install on iOS

**"Unable to install":**
1. Settings → General → VPN & Device Management
2. Trust the developer profile
3. Try installing again

**"Untrusted Enterprise Developer":**
- This is expected for development builds
- Must trust manually in Settings

### Can't Install on Android

**"App not installed":**
1. Enable "Install from unknown sources"
2. Settings → Security → Unknown sources
3. Try installing again

## Quick Reference

### Common Commands

```bash
# Login to EAS
eas login

# Check build status
eas build:list

# Create new build
eas build --profile development --platform ios     # iOS
eas build --profile development --platform android # Android
eas build --profile development --platform all     # Both

# Start dev server for development build
npx expo start --dev-client

# View build logs
eas build:view

# List secrets
eas secret:list
```

### Build Profiles

- **development**: For testing on your device (includes dev tools)
- **preview**: Internal testing (no dev tools)
- **production**: App Store/Play Store release

## Alternative: Use Expo Go (Simpler)

If EAS Build seems too complex, you can use Expo Go for initial testing:

```bash
# Start dev server
npm start

# Scan QR code with Expo Go app
```

**Limitations:**
- Some native features may not work
- Expo Go has library restrictions
- Development build recommended for full testing

## Next Steps After Build

1. **Test the complete flow:**
   - Sign up → Onboarding → Workout logging

2. **Test new features:**
   - Haptic feedback (physical device only)
   - Toast notifications
   - Pull-to-refresh
   - Skeleton screens

3. **Test offline behavior**

4. **Report bugs** in GitHub issues

## Support

- Expo Docs: https://docs.expo.dev/build/introduction/
- EAS Build: https://docs.expo.dev/build/setup/
- Troubleshooting: https://docs.expo.dev/build-reference/troubleshooting/

---

**Quick Start (TL;DR):**

```bash
# One-time setup
npm install -g eas-cli
eas login
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_key"

# Install dependencies
npm install

# Build for your platform
eas build --profile development --platform ios     # or android

# Install on phone (scan QR code)
# Then start dev server:
npx expo start --dev-client
```
