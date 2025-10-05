import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Pricing from './components/Pricing';
import AppHome from './pages/AppHome';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './pages/Onboarding.jsx';
import SignIn from './pages/SignIn';
import ResetPassword from './pages/ResetPassword';
import './styles/mobile-first-base.css';
import './styles/mobile-first.css';

// Import existing pages for backward compatibility
import Settings from './pages/Settings.jsx';
import Upgrade from './pages/Upgrade.jsx';
import CreateDeal from './pages/CreateDeal.jsx';

// CreateDeal wrapper component to handle navigation
function CreateDealWrapper() {
  const navigate = useNavigate();
  
  const handleSave = (dealData) => {
    // TODO: Implement deal saving logic
    console.log('Deal saved:', dealData);
    navigate('/app/saved-deals');
  };
  
  const handleCancel = () => {
    navigate('/app');
  };
  
  return <CreateDeal onSave={handleSave} onCancel={handleCancel} />;
}
import SavedDeals from './pages/SavedDeals.jsx';
import Checklist from './pages/Checklist.jsx';
import Notes from './pages/Notes.jsx';
import HowToUse from './pages/HowToUse.jsx';
import Legal from './pages/Legal.jsx';
import BillingManagement from './pages/BillingManagement.tsx';

function AppRoutes() {
  const navigate = useNavigate();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Onboarding onStart={() => navigate('/pricing')} />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
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
              <Settings onClearData={() => {}} onExportData={() => {}} deals={[]} notes={[]} photos={[]} navigateTo={() => {}} />
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
              <CreateDealWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/saved-deals"
          element={
            <ProtectedRoute>
              <SavedDeals deals={[]} setDeals={() => {}} navigateTo={() => {}} onUpdateDeal={() => {}} onAddPhoto={() => {}} onAddNote={() => {}} onUpdateChecklistProgress={() => {}} checklistProgress={{}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/checklist"
          element={
            <ProtectedRoute>
              <Checklist deals={[]} progress={{}} onUpdateProgress={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/notes"
          element={
            <ProtectedRoute>
              <Notes notes={[]} photos={[]} onNotesChange={() => {}} onPhotosChange={() => {}} onBack={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/how-to-use"
          element={
            <ProtectedRoute>
              <HowToUse onBack={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/legal"
          element={
            <ProtectedRoute>
              <Legal onBack={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/billing"
          element={
            <ProtectedRoute>
              <BillingManagement />
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




