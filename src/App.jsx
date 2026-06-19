import React from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";

import Login from './pages/Login'
import Dashboard from "./pages/Dashboard";
import WorkoutBuilder from "./pages/WorkoutBuilder";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import LogWorkout from "./pages/LogWorkout";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><WorkoutBuilder /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><ExerciseLibrary /></ProtectedRoute>} />
          <Route path="/log" element={<ProtectedRoute><LogWorkout /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App