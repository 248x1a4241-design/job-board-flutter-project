import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Bookmark,
  FileText,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  User as UserIcon,
  LogOut,
  Shield,
  Building2,
  Code2,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    savedJobIds,
    applications,
    notifications,
    messages,
    setIsNotificationDrawerOpen,
    setIsChatModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsProfileModalOpen,
    logout,
    switchUserRole,
    darkMode,
    toggleDarkMode,
    mobileFrameMode,
    toggleMobileFrameMode,
    openInfoModal,
    resetAllToDemoData,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Counts
  const unreadNotifsCount = notifications.filter(
    n => currentUser && n.userId === currentUser.id && !n.isRead
  ).length;

  const unreadMessagesCount = messages.filter(
    m => currentUser && m.receiverId === currentUser.id && !m.isRead
  ).length;

  const userApplicationsCount = applications.filter(
    a => currentUser && a.applicantId === currentUser.id && a.status !== 'withdrawn'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Demo Bar / Quick Switcher Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white text-xs py-1.5 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium hidden sm:inline">Role Switcher:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => switchUserRole('job_seeker')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                currentUser?.role === 'job_seeker'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => switchUserRole('recruiter')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                currentUser?.role === 'recruiter'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Recruiter
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                currentUser?.role === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openInfoModal('flutter_guide')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30 transition text-xs font-semibold"
            title="View complete Flutter & Firebase Architecture reference for college submission"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Flutter & Firebase Docs</span>
          </button>

          <button
            onClick={resetAllToDemoData}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-xs"
            title="Reset data back to default demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentView('explore')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  WorkBridge
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                  Career Portal
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentView('explore')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  currentView === 'explore'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Find Jobs
              </button>

              {(!currentUser || currentUser.role === 'job_seeker') && (
                <>
                  <button
                    onClick={() => setCurrentView('saved')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                      currentView === 'saved'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Saved Jobs</span>
                    {savedJobIds.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                        {savedJobIds.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentView('applications')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                      currentView === 'applications'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Applications</span>
                    {userApplicationsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                        {userApplicationsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {currentUser?.role === 'recruiter' && (
                <button
                  onClick={() => setCurrentView('recruiter_dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    currentView === 'recruiter_dashboard'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Recruiter Dashboard</span>
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    currentView === 'admin_dashboard'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Moderation</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2">
            {/* Mobile Preview Frame Toggle */}
            <button
              onClick={toggleMobileFrameMode}
              className={`p-2 rounded-lg border transition flex items-center gap-1 text-xs font-semibold ${
                mobileFrameMode
                  ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={mobileFrameMode ? 'Switch to Full Desktop View' : 'Simulate Mobile Flutter App View'}
            >
              {mobileFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span className="hidden xl:inline">{mobileFrameMode ? 'Desktop' : 'Mobile View'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {currentUser ? (
              <>
                {/* Chat Trigger */}
                <button
                  onClick={() => setIsChatModalOpen(true)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition relative"
                  aria-label="Open Chat"
                  title="Direct Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={() => setIsNotificationDrawerOpen(true)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition relative"
                  aria-label="Open Notifications"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="hidden lg:block text-left text-xs leading-tight">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                        {currentUser.name}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold capitalize">
                        {currentUser.role.replace('_', ' ')}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </p>
                        <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          {currentUser.role.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                        >
                          <UserIcon className="w-4 h-4 text-blue-600" />
                          <span>My Profile & Resume</span>
                        </button>

                        {currentUser.role === 'recruiter' && (
                          <button
                            onClick={() => {
                              setCurrentView('recruiter_dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                          >
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            <span>Recruiter Dashboard</span>
                          </button>
                        )}

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setCurrentView('admin_dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>Admin Moderation</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            openInfoModal('flutter_guide');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                        >
                          <Code2 className="w-4 h-4 text-emerald-600" />
                          <span>Flutter & Firebase Architecture</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 md:hidden"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileNavOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1 animate-in fade-in">
            <button
              onClick={() => {
                setCurrentView('explore');
                setIsMobileNavOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentView === 'explore'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Find Jobs
            </button>

            {(!currentUser || currentUser.role === 'job_seeker') && (
              <>
                <button
                  onClick={() => {
                    setCurrentView('saved');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    currentView === 'saved'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    <span>Saved Jobs</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 dark:bg-slate-700 font-bold">
                    {savedJobIds.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('applications');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    currentView === 'applications'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>My Applications</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                    {userApplicationsCount}
                  </span>
                </button>
              </>
            )}

            {currentUser?.role === 'recruiter' && (
              <button
                onClick={() => {
                  setCurrentView('recruiter_dashboard');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  currentView === 'recruiter_dashboard'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Recruiter Dashboard</span>
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setCurrentView('admin_dashboard');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  currentView === 'admin_dashboard'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Moderation</span>
              </button>
            )}

            <button
              onClick={() => {
                openInfoModal('flutter_guide');
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Flutter & Firebase Architecture Guide</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
