# GetFit

GetFit is a workout planner and tracking app built with React, Vite, and Firebase. It helps users plan training sessions, browse exercises, log workouts, and stay consistent over time.

## What the app does

- Sign in with Firebase authentication
- Create custom workout plans with exercise details, sets, reps, and rest time
- Browse an exercise library with search and demo media
- Log completed workouts and save progress
- Track streaks and workout history
- Update profile information
- Follow a simple onboarding/help flow for new users

## Tech stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Backend/auth: Firebase Auth + Firestore
- Data: ExerciseDB API via RapidAPI
- Charts: Recharts
- Notifications: react-hot-toast

## Project structure

```bash
src/
  components/
  firebase/
  hooks/
  pages/
  utils/
public/
functions/
```

Main screens include:

- Dashboard
- Workout Builder
- Exercise Library
- Log Workout
- Progress
- Profile
- Help

## Getting started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled
- A RapidAPI key for the ExerciseDB API

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create a `.env` file in the project root with your Firebase config and RapidAPI key:

```bash
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
VITE_RAPIDAPI_KEY=
```

These values come from your Firebase web app settings and your ExerciseDB API credentials.

### 3. Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### 4. Build for production

```bash
npm run build
```

## Firebase setup notes

This app uses Firebase for:

- user authentication
- storing workout plans and logged sessions
- profile data and streak tracking

If you are deploying update rules or related Firebase config, you can use:

```bash
firebase deploy --only firestore:rules
```

## Deployment

The app is intended to be deployed on Vercel, but the frontend can also be hosted anywhere that supports Vite static builds.

## Notes

- Exercise library data and demo media are loaded from the external ExerciseDB API.
- The app assumes Firebase is configured before login and Firestore actions can work properly.
- The project is designed to stay lightweight and simple for personal or learning use.

## License

This project is for personal or educational use.
