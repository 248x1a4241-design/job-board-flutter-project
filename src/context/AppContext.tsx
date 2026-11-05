import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Job,
  Application,
  ChatMessage,
  Notification,
  ReportedJob,
  Company,
  UserRole,
  JobType,
  JobCategory,
  ApplicationStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_REPORTED_JOBS,
  INITIAL_COMPANIES,
} from '../data/mockData';

interface AppContextType {
  // Auth & User
  currentUser: User | null;
  users: User[];
  login: (email: string, role?: UserRole) => boolean;
  signup: (userData: { name: string; email: string; phone: string; role: UserRole; companyName?: string }) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  
  // Jobs
  jobs: Job[];
  addJob: (newJob: Omit<Job, 'id' | 'postedDate' | 'viewsCount' | 'applicantCount' | 'status'>) => void;
  updateJob: (jobId: string, updated: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  approveJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  reportJob: (jobId: string, jobTitle: string, reason: string, details: string) => void;
  reportedJobs: ReportedJob[];
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;

  // Applications
  applications: Application[];
  applyForJob: (job: Job, resumeFileName: string, coverLetter: string, resumeUrl?: string) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => void;
  withdrawApplication: (appId: string) => void;

  // Saved Jobs
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;

  // Recently Viewed
  recentlyViewedIds: string[];
  addToRecentlyViewed: (jobId: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // Chat
  messages: ChatMessage[];
  sendMessage: (receiverId: string, receiverName: string, text: string, jobId?: string, jobTitle?: string) => void;
  openChatWith: (targetUser: { id: string; name: string; role: UserRole; jobId?: string; jobTitle?: string }) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  activeChatTarget: { id: string; name: string; role: UserRole; jobId?: string; jobTitle?: string } | null;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  locationQuery: string;
  setLocationQuery: (loc: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedJobType: string;
  setSelectedJobType: (type: string) => void;
  selectedExperience: string;
  setSelectedExperience: (exp: string) => void;
  salaryMinFilter: number;
  setSalaryMinFilter: (min: number) => void;
  resetFilters: () => void;

  // Navigation & Modals
  currentView: 'explore' | 'saved' | 'applications' | 'recruiter_dashboard' | 'admin_dashboard';
  setCurrentView: (view: 'explore' | 'saved' | 'applications' | 'recruiter_dashboard' | 'admin_dashboard') => void;
  selectedJobForDetails: Job | null;
  setSelectedJobForDetails: (job: Job | null) => void;
  jobToApply: Job | null;
  setJobToApply: (job: Job | null) => void;
  jobToEdit: Job | null;
  setJobToEdit: (job: Job | null) => void;
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  selectedApplicationForReview: Application | null;
  setSelectedApplicationForReview: (app: Application | null) => void;
  infoModal: { isOpen: boolean; type: 'about' | 'contact' | 'privacy' | 'terms' | 'flutter_guide' };
  openInfoModal: (type: 'about' | 'contact' | 'privacy' | 'terms' | 'flutter_guide') => void;
  closeInfoModal: () => void;

  // Platform & Settings
  darkMode: boolean;
  toggleDarkMode: () => void;
  mobileFrameMode: boolean;
  toggleMobileFrameMode: () => void;
  resetAllToDemoData: () => void;
  companies: Company[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper for localStorage
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`workbridge_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStored = <T,>(key: string, data: T) => {
    try {
      localStorage.setItem(`workbridge_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  // State
  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = loadStored<User | null>('currentUser', null);
    if (saved) return saved;
    // Default to Alex Chen (Job Seeker)
    return INITIAL_USERS[0];
  });
  const [jobs, setJobs] = useState<Job[]>(() => loadStored('jobs', INITIAL_JOBS));
  const [applications, setApplications] = useState<Application[]>(() => loadStored('applications', INITIAL_APPLICATIONS));
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => loadStored('savedJobs', ['job_1', 'job_3']));
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => loadStored('recentJobs', ['job_1']));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStored('messages', INITIAL_MESSAGES));
  const [reportedJobs, setReportedJobs] = useState<ReportedJob[]>(() => loadStored('reportedJobs', INITIAL_REPORTED_JOBS));
  const [companies, setCompanies] = useState<Company[]>(() => loadStored('companies', INITIAL_COMPANIES));

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [salaryMinFilter, setSalaryMinFilter] = useState(0);

  // Navigation
  const [currentView, setCurrentView] = useState<'explore' | 'saved' | 'applications' | 'recruiter_dashboard' | 'admin_dashboard'>('explore');

  // Modals
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [selectedApplicationForReview, setSelectedApplicationForReview] = useState<Application | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatTarget, setActiveChatTarget] = useState<{ id: string; name: string; role: UserRole; jobId?: string; jobTitle?: string } | null>(null);
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; type: 'about' | 'contact' | 'privacy' | 'terms' | 'flutter_guide' }>({
    isOpen: false,
    type: 'about',
  });

  // UI preferences
  const [darkMode, setDarkMode] = useState<boolean>(() => loadStored('darkMode', false));
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);

  // Effects to synchronize state to localStorage
  useEffect(() => saveStored('users', users), [users]);
  useEffect(() => saveStored('currentUser', currentUser), [currentUser]);
  useEffect(() => saveStored('jobs', jobs), [jobs]);
  useEffect(() => saveStored('applications', applications), [applications]);
  useEffect(() => saveStored('savedJobs', savedJobIds), [savedJobIds]);
  useEffect(() => saveStored('recentJobs', recentlyViewedIds), [recentlyViewedIds]);
  useEffect(() => saveStored('notifications', notifications), [notifications]);
  useEffect(() => saveStored('messages', messages), [messages]);
  useEffect(() => saveStored('reportedJobs', reportedJobs), [reportedJobs]);
  useEffect(() => saveStored('companies', companies), [companies]);
  useEffect(() => {
    saveStored('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auth operations
  const login = (email: string, role?: UserRole): boolean => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setIsAuthModalOpen(false);
      // Auto-navigate to their role's natural view
      if (existing.role === 'recruiter') setCurrentView('recruiter_dashboard');
      else if (existing.role === 'admin') setCurrentView('admin_dashboard');
      else setCurrentView('explore');
      return true;
    }
    // If not found, create a simple profile
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+1 (555) 000-0000',
      role: role || 'job_seeker',
      status: 'active',
      skills: ['Problem Solving', 'Communication'],
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = (userData: { name: string; email: string; phone: string; role: UserRole; companyName?: string }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      companyName: userData.companyName,
      status: 'active',
      skills: userData.role === 'job_seeker' ? ['General Skills', 'Communication'] : [],
      createdAt: new Date().toISOString(),
      avatar: userData.role === 'recruiter' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    // Welcome Notification
    const welcomeNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to WorkBridge!',
      message: `Your ${userData.role.replace('_', ' ')} account has been created. Start exploring!`,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    if (userData.role === 'recruiter') setCurrentView('recruiter_dashboard');
    else if (userData.role === 'admin') setCurrentView('admin_dashboard');
    else setCurrentView('explore');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('explore');
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'recruiter') setCurrentView('recruiter_dashboard');
      else if (role === 'admin') setCurrentView('admin_dashboard');
      else setCurrentView('explore');
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  // Job operations
  const addJob = (newJobData: Omit<Job, 'id' | 'postedDate' | 'viewsCount' | 'applicantCount' | 'status'>) => {
    const newJob: Job = {
      ...newJobData,
      id: `job_${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      applicantCount: 0,
      status: 'approved',
    };
    setJobs(prev => [newJob, ...prev]);
    setIsPostJobModalOpen(false);

    // Notify user
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId: currentUser?.id || 'admin',
      title: 'Job Vacancy Published! 🚀',
      message: `Your job "${newJob.title}" is now live and accepting applications.`,
      type: 'new_job',
      isRead: false,
      timestamp: new Date().toISOString(),
      relatedJobId: newJob.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateJob = (jobId: string, updated: Partial<Job>) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, ...updated } : j)));
    if (selectedJobForDetails?.id === jobId) {
      setSelectedJobForDetails(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (selectedJobForDetails?.id === jobId) setSelectedJobForDetails(null);
  };

  const approveJob = (jobId: string) => {
    updateJob(jobId, { status: 'approved' });
  };

  const rejectJob = (jobId: string) => {
    updateJob(jobId, { status: 'rejected' });
  };

  const reportJob = (jobId: string, jobTitle: string, reason: string, details: string) => {
    const newReport: ReportedJob = {
      id: `rep_${Date.now()}`,
      jobId,
      jobTitle,
      reportedBy: currentUser?.id || 'anonymous',
      reportedByName: currentUser?.name || 'Anonymous User',
      reason,
      details,
      reportedAt: new Date().toISOString(),
      status: 'pending',
    };
    setReportedJobs(prev => [newReport, ...prev]);

    // Admin Notification
    const adminNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: 'user_admin_1',
      title: 'Job Reported for Review',
      message: `"${jobTitle}" was flagged: "${reason}"`,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReportedJobs(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
  };

  // Applications
  const applyForJob = (job: Job, resumeFileName: string, coverLetter: string, resumeUrl?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      companyLogo: job.companyLogo,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantPhone: currentUser.phone,
      applicantAvatar: currentUser.avatar,
      resumeFileName,
      resumeUrl: resumeUrl || '#',
      coverLetter,
      status: 'applied',
      appliedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    setApplications(prev => [newApp, ...prev]);
    // increment applicant count on job
    updateJob(job.id, { applicantCount: job.applicantCount + 1 });
    setJobToApply(null);

    // Seeker notification
    const seekerNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Application Submitted! 📄',
      message: `You applied for "${job.title}" at ${job.company}. Track your status in Application Tracking.`,
      type: 'application_status',
      isRead: false,
      timestamp: new Date().toISOString(),
      relatedJobId: job.id,
      relatedApplicationId: newApp.id,
    };

    // Recruiter notification
    const recruiterNotif: Notification = {
      id: `notif_${Date.now() + 1}`,
      userId: job.recruiterId,
      title: 'New Applicant Received!',
      message: `${currentUser.name} just applied for "${job.title}".`,
      type: 'application_status',
      isRead: false,
      timestamp: new Date().toISOString(),
      relatedJobId: job.id,
      relatedApplicationId: newApp.id,
    };

    setNotifications(prev => [seekerNotif, recruiterNotif, ...prev]);
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const updated = {
            ...app,
            status,
            notes: notes !== undefined ? notes : app.notes,
            interviewDate: interviewDate !== undefined ? interviewDate : app.interviewDate,
            updatedDate: new Date().toISOString(),
          };

          // Send notification to applicant
          let notifTitle = 'Application Status Updated';
          let notifMsg = `Your application for "${app.jobTitle}" at ${app.companyName} is now: ${status.replace('_', ' ').toUpperCase()}`;
          let notifType: Notification['type'] = 'application_status';

          if (status === 'interview') {
            notifTitle = 'Interview Scheduled! 📅';
            notifMsg = `${app.companyName} invited you for an interview! Details: ${interviewDate || 'Check application tracking'}`;
            notifType = 'interview';
          } else if (status === 'accepted') {
            notifTitle = 'Congratulations! Job Offer Accepted! 🎉';
            notifMsg = `${app.companyName} has officially accepted your application for ${app.jobTitle}!`;
          } else if (status === 'rejected') {
            notifTitle = 'Application Status Update';
            notifMsg = `Thank you for your interest in ${app.companyName}. They have chosen another candidate at this time.`;
          }

          const statusNotif: Notification = {
            id: `notif_${Date.now()}`,
            userId: app.applicantId,
            title: notifTitle,
            message: notifMsg,
            type: notifType,
            isRead: false,
            timestamp: new Date().toISOString(),
            relatedJobId: app.jobId,
            relatedApplicationId: app.id,
          };
          setNotifications(n => [statusNotif, ...n]);

          return updated;
        }
        return app;
      })
    );
  };

  const withdrawApplication = (appId: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, status: 'withdrawn', updatedDate: new Date().toISOString() } : app
      )
    );
  };

  // Saved Jobs
  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => (prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]));
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  // Recently Viewed
  const addToRecentlyViewed = (jobId: string) => {
    setRecentlyViewedIds(prev => [jobId, ...prev.filter(id => id !== jobId)].slice(0, 10));
    // also increment view count
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, viewsCount: j.viewsCount + 1 } : j))
    );
  };

  // Notifications
  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.id));
  };

  // Chat
  const sendMessage = (
    receiverId: string,
    receiverName: string,
    text: string,
    jobId?: string,
    jobTitle?: string
  ) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId,
      receiverName,
      jobId,
      jobTitle,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMsg]);

    // Recipient notification
    const chatNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: receiverId,
      title: `Message from ${currentUser.name}`,
      message: text.slice(0, 80) + (text.length > 80 ? '...' : ''),
      type: 'message',
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [chatNotif, ...prev]);

    // Simulated quick response if applicant messages a recruiter
    if (currentUser.role === 'job_seeker' && receiverId.includes('recruiter')) {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          senderId: receiverId,
          senderName: receiverName,
          senderRole: 'recruiter',
          receiverId: currentUser.id,
          receiverName: currentUser.name,
          jobId,
          jobTitle,
          text: `Thank you for reaching out, ${currentUser.name.split(' ')[0]}! I've received your note and will review your profile shortly. Feel free to attach any extra portfolio links here.`,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setMessages(m => [...m, autoReply]);
      }, 1400);
    }
  };

  const openChatWith = (targetUser: { id: string; name: string; role: UserRole; jobId?: string; jobTitle?: string }) => {
    setActiveChatTarget(targetUser);
    setIsChatModalOpen(true);
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('All');
    setSelectedJobType('All');
    setSelectedExperience('All');
    setSalaryMinFilter(0);
  };

  // Info Modal helpers
  const openInfoModal = (type: 'about' | 'contact' | 'privacy' | 'terms' | 'flutter_guide') => {
    setInfoModal({ isOpen: true, type });
  };

  const closeInfoModal = () => {
    setInfoModal(prev => ({ ...prev, isOpen: false }));
  };

  // Dark Mode & Mobile Frame Mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleMobileFrameMode = () => setMobileFrameMode(prev => !prev);

  // Full Reset to Demo Data
  const resetAllToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setSavedJobIds(['job_1', 'job_3']);
    setRecentlyViewedIds(['job_1']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setMessages(INITIAL_MESSAGES);
    setReportedJobs(INITIAL_REPORTED_JOBS);
    setCompanies(INITIAL_COMPANIES);
    resetFilters();
    setCurrentView('explore');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        signup,
        logout,
        switchUserRole,
        updateProfile,

        jobs,
        addJob,
        updateJob,
        deleteJob,
        approveJob,
        rejectJob,
        reportJob,
        reportedJobs,
        resolveReport,

        applications,
        applyForJob,
        updateApplicationStatus,
        withdrawApplication,

        savedJobIds,
        toggleSaveJob,
        isJobSaved,

        recentlyViewedIds,
        addToRecentlyViewed,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,

        messages,
        sendMessage,
        openChatWith,
        isChatModalOpen,
        setIsChatModalOpen,
        activeChatTarget,

        searchQuery,
        setSearchQuery,
        locationQuery,
        setLocationQuery,
        selectedCategory,
        setSelectedCategory,
        selectedJobType,
        setSelectedJobType,
        selectedExperience,
        setSelectedExperience,
        salaryMinFilter,
        setSalaryMinFilter,
        resetFilters,

        currentView,
        setCurrentView,
        selectedJobForDetails,
        setSelectedJobForDetails,
        jobToApply,
        setJobToApply,
        jobToEdit,
        setJobToEdit,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        selectedApplicationForReview,
        setSelectedApplicationForReview,
        infoModal,
        openInfoModal,
        closeInfoModal,

        darkMode,
        toggleDarkMode,
        mobileFrameMode,
        toggleMobileFrameMode,
        resetAllToDemoData,
        companies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
