/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SeekerDashboard } from './components/seeker/SeekerDashboard';
import { SavedJobsView } from './components/seeker/SavedJobsView';
import { ApplicationsView } from './components/seeker/ApplicationsView';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { JobDetailsModal } from './components/jobs/JobDetailsModal';
import { ApplyModal } from './components/jobs/ApplyModal';
import { PostJobModal } from './components/recruiter/PostJobModal';
import { ApplicantReviewModal } from './components/recruiter/ApplicantReviewModal';
import { ProfileModal } from './components/seeker/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { ChatModal } from './components/chat/ChatModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { InfoModal } from './components/info/InfoModal';
import { Smartphone, Monitor, Wifi, Battery, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, mobileFrameMode, toggleMobileFrameMode } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'saved':
        return <SavedJobsView />;
      case 'applications':
        return <ApplicationsView />;
      case 'recruiter_dashboard':
        return <RecruiterDashboard />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'explore':
      default:
        return <SeekerDashboard />;
    }
  };

  if (mobileFrameMode) {
    return (
      <div className="min-h-screen bg-slate-950 py-6 px-4 flex flex-col items-center justify-center font-sans antialiased">
        {/* Frame Toggle Header */}
        <div className="mb-4 flex items-center justify-between w-full max-w-sm text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Flutter Mobile Shell Mode</span>
          </div>
          <button
            onClick={toggleMobileFrameMode}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Desktop View</span>
          </button>
        </div>

        {/* iPhone / Flutter Mobile Frame */}
        <div className="relative w-full max-w-[410px] h-[844px] bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border-[10px] border-slate-800 ring-1 ring-slate-700/50 overflow-hidden flex flex-col">
          {/* Mobile Status Bar */}
          <div className="h-10 bg-slate-900 text-white px-7 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none z-30">
            <span>9:41</span>
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile Screen Scrollable View */}
          <div className="flex-1 overflow-y-auto flex flex-col scrollbar-none">
            <Navbar />
            <main className="flex-1 px-4 py-5">
              {renderCurrentView()}
            </main>
            <Footer />
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-5 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 z-30">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>

        {/* Floating Modals in Mobile Frame */}
        <JobDetailsModal />
        <ApplyModal />
        <PostJobModal />
        <ApplicantReviewModal />
        <ProfileModal />
        <AuthModal />
        <ChatModal />
        <NotificationDrawer />
        <InfoModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <JobDetailsModal />
      <ApplyModal />
      <PostJobModal />
      <ApplicantReviewModal />
      <ProfileModal />
      <AuthModal />
      <ChatModal />
      <NotificationDrawer />
      <InfoModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
