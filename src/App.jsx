import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkoutBuilder from "./pages/WorkoutBuilder";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import LogWorkout from "./pages/LogWorkout";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import AddExercise from "./pages/AddExercise";

// Wraps any protected page with both the auth check AND the navbar,
// so we don't have to repeat <Navbar /> on every single route below
function Layout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#020817]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/builder" element={<Layout><WorkoutBuilder /></Layout>} />
        <Route path="/library" element={<Layout><ExerciseLibrary /></Layout>} />
        <Route path="/log" element={<Layout><LogWorkout /></Layout>} />
        <Route path="/progress" element={<Layout><Progress /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/add-exercise" element={<Layout><AddExercise /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
