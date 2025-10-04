import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Pricing from './components/Pricing';
import AppHome from './pages/AppHome';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './pages/Onboarding.jsx';

// Import existing pages for backward compatibility
import Settings from './pages/Settings.jsx';
import Upgrade from './pages/Upgrade.jsx';
import CreateDeal from './pages/CreateDeal.jsx';
import SavedDeals from './pages/SavedDeals.jsx';
import Checklist from './pages/Checklist.jsx';
import Notes from './pages/Notes.jsx';
import HowToUse from './pages/HowToUse.jsx';
import Legal from './pages/Legal.jsx';

function AppRoutes() {
  const navigate = useNavigate();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Onboarding onStart={() => navigate('/pricing')} />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <AppHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/upgrade"
          element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/create-deal"
          element={
            <ProtectedRoute>
              <CreateDeal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/saved-deals"
          element={
            <ProtectedRoute>
              <SavedDeals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/checklist"
          element={
            <ProtectedRoute>
              <Checklist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/how-to-use"
          element={
            <ProtectedRoute>
              <HowToUse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/legal"
          element={
            <ProtectedRoute>
              <Legal />
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirect to landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
