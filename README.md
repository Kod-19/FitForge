# 🏋️ FitForge

A workout planner web app built to explore Firebase's ecosystem hands-on — authentication, Firestore, hosting, and analytics — paired with a third-party exercise database for searchable workout instructions.

## Features

- **Authentication** — Email/password and Google sign-in via Firebase Auth
- **Workout Builder** — Create custom workout plans with exercises, sets, reps, and rest timers
- **Exercise Library** — Search 1000+ exercises by name or body part, powered by the ExerciseDB API, with full instructions and animated form demos
- **Workout Logging** — Check off exercises as you complete them, with automatic streak tracking
- **Progress Tracking** — Weekly training volume charts and workout history
- **Profile Management** — Editable display name and profile photo

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Routing | React Router |
| Backend | Firebase (Auth, Firestore, Hosting, Analytics) |
| Exercise Data | ExerciseDB API (RapidAPI) |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Icons | Lucide React |

## Firebase Features Used

- **Authentication** — Email/password + Google OAuth, protected routes
- **Firestore** — User profiles, workout plans, and workout logs, with security rules scoping data to its owner
- **Hosting** — Production deployment with SPA rewrite rules for client-side routing
- **Analytics** — Page and event tracking

> Firebase Cloud Storage and Cloud Functions were deliberately skipped since both require the Blaze (pay-as-you-go) plan. Exercise media is sourced externally via the ExerciseDB API instead.

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (Auth, Firestore, and Hosting enabled)
- A free RapidAPI account subscribed to ExerciseDB

### Installation

```bash
git clone <your-repo-url>
cd fitforge
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
VITE_RAPIDAPI_KEY=
```

### Run Locally

```bash
npm run dev
```

### Run with Firebase Emulators

```bash
firebase emulators:start
```

## Deployment

```bash
npm run build
firebase deploy --only hosting
```

To deploy Firestore security rules after changes:

```bash
firebase deploy --only firestore:rules
```

## Project Structure

```
src/
  components/      # Navbar, ProtectedRoute, LazyExerciseGif, etc.
  firebase/        # Firebase config and auth helper functions
  hooks/           # useAuth and other shared hooks
  pages/           # Dashboard, Builder, Library, Log, Progress, Profile
  store/           # Zustand state (active workout session)
  utils/           # exerciseDb.js and other helpers
```

## Firestore Data Model

```
users/
  {userId}/
    name, email, photoURL, streak, joinedAt
    plans/
      {planId}/
        name, days[], exercises[]
    logs/
      {logId}/
        date, planId, completedExercises[], totalExercises
```

## Notes

- Exercise data and demo GIFs are fetched live from ExerciseDB and are not stored in Firestore.
- The ExerciseDB free tier has a limited daily request quota — heavy usage may require caching results locally.

## License

Personal/educational project.
