# Carely Pets - Folder Structure Documentation

## Project Overview

This is a React Native/Expo application for pet care management, including onboarding, authentication, and pet services.

## Folder Structure

```
d:\CarelyPets\
├── app/                          # Main app routing (Expo Router)
│   ├── _layout.tsx               # Root layout - manages onboarding flow
│   └── (auth)/                   # Auth-related screens group
│       ├── _layout.tsx           # Auth layout
│       ├── onboarding/
│       │   └── index.tsx          # Onboarding flow screen
│       ├── login/
│       │   └── index.tsx          # Login page wrapper
│       └── signup/
│           └── index.tsx          # Signup page wrapper
│
├── screens/                      # Screen components (business logic)
│   ├── onboarding/
│   │   ├── Onboarding1Screen.tsx  # Screen 1: "Your Complete Pet Care Companion"
│   │   ├── Onboarding2Screen.tsx  # Screen 2: "Pet Adoption Made Easy"
│   │   ├── Onboarding3Screen.tsx  # Screen 3: "Trusted Pet Services"
│   │   └── Onboarding4Screen.tsx  # Screen 4: "Smart Care Management"
│   └── auth/
│       ├── LoginScreen.tsx        # Login screen with email/password & Google
│       └── SignupScreen.tsx       # Registration screen with validation
│
├── constants/                    # App constants
│   └── colors/
│       └── index.ts              # Color palette, spacing, fonts, borders
│
├── assets/                       # Static assets
│   └── images/
│       ├── onboarding/           # Onboarding screen images (placeholder)
│       │   ├── onboarding1.png
│       │   ├── onboarding2.png
│       │   ├── onboarding3.png
│       │   └── onboarding4.png
│       ├── logos/                # App logos
│       │   ├── carely-logo.png
│       │   └── placeholder.png
│       └── auth/                 # Auth-related images
│
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── components/                   # Reusable UI components
│   └── ui/
│
└── package.json                  # Dependencies & scripts
```

## Key Features

### 1. Onboarding Flow (4 Screens)

- **Screen 1**: Introduction - "Carely Pets – Your Complete Pet Care Companion"
- **Screen 2**: Pet Adoption - "Pet Adoption Made Easy"
- **Screen 3**: Services - "Trusted Pet Services"
- **Screen 4**: Care Management - "Smart Care Management"

Each screen includes:

- Large image area
- Title and description
- Progress dots
- Next/Skip buttons
- Persistent state using AsyncStorage

### 2. Authentication

- **Login Screen**:
  - Email and password fields
  - Show/hide password toggle
  - "Forgot Password?" link
  - Google login option
  - Link to sign up
- **Signup Screen**:
  - Name, email, password fields
  - Password confirmation
  - Terms & conditions checkbox
  - Input validation
  - Google signup option
  - Link back to login

### 3. Styling System

- **Colors**: Primary (#00A8CC), Secondary, Background, Error, etc.
- **Spacing**: xs (4px) to xxl (48px)
- **Typography**: FontSizes (xs-xxxl), FontWeights (regular-bold)
- **Borders**: BorderRadius (sm-full)

## Flow

1. **First Launch**: User sees onboarding screens

   - Can skip at any time to login
   - Progress saved when "Get Started" is clicked

2. **Authentication**:

   - New users → Signup → Login
   - Existing users → Login directly

3. **Post-Login**: Ready for app navigation (not yet implemented)

## Image Placeholders

All images are currently placeholders (1x1 transparent PNGs). Replace with actual assets:

- `/assets/images/onboarding/onboarding1.png` - Cat with girl
- `/assets/images/onboarding/onboarding2.png` - Dog with person
- `/assets/images/onboarding/onboarding3.png` - Dog face
- `/assets/images/onboarding/onboarding4.png` - Calendar/management
- `/assets/images/logos/carely-logo.png` - App logo

## Dependencies Added

```json
{
  "@react-native-async-storage/async-storage": "latest"
}
```

## Setup & Running

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the app**:
   ```bash
   npm start        # Web
   npm run ios      # iOS
   npm run android  # Android
   ```

## Customization

### Colors

Edit `constants/colors/index.ts` to change the app theme.

### Text & Content

Update screen components in `screens/onboarding/` and `screens/auth/` for different text.

### Images

Replace placeholder images in `assets/images/` with your actual images.

### Navigation

All navigation logic is in `app/_layout.tsx` and individual screen files.

## Notes

- Onboarding status is stored in AsyncStorage with key `hasSeenOnboarding`
- All forms currently have placeholder logic (replace with actual API calls)
- Google login/signup needs to be implemented with proper SDK integration
- Main app screens (tabs, home, etc.) need to be created for post-login navigation
