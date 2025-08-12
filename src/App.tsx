import React, { useState } from 'react';
import Header from './components/Header';
import HRPortal from './components/HRPortal';
import CandidatePortal from './components/CandidatePortal';
import JobListings from './components/JobListings';
import CVListings from './components/CVListings';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'hr' | 'candidate' | 'jobs' | 'cvs' | 'admin'>('hr');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = (success: boolean) => {
    setIsAdminLoggedIn(success);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('hr');
  };

  const handleViewChange = (view: 'hr' | 'candidate' | 'jobs' | 'cvs' | 'admin') => {
    if (view === 'admin' && !isAdminLoggedIn) {
      // Don't change view, admin login will be shown
    } else {
      setCurrentView(view);
    }
  };

  // Show admin login if admin view is selected but not logged in
  if (currentView === 'admin' && !isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  // Show admin dashboard if logged in and admin view selected
  if (currentView === 'admin' && isAdminLoggedIn) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="min-h-[calc(100vh-120px)]">
        {currentView === 'hr' && <HRPortal />}
        {currentView === 'candidate' && <CandidatePortal />}
        {currentView === 'jobs' && <JobListings />}
        {currentView === 'cvs' && <CVListings />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            JobMatch AI © 2025 - Intelligent Job Matching Platform powered by Advanced AI Processing
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;