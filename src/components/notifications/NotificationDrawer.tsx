import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import {
  X,
  Bell,
  Calendar,
  FileText,
  Briefcase,
  MessageSquare,
  CheckCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setSelectedJobForDetails,
    jobs,
    setCurrentView,
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const userNotifications = notifications.filter(
    (n) => currentUser && n.userId === currentUser.id
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'application_status':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'new_job':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    if (notif.relatedJobId) {
      const job = jobs.find((j) => j.id === notif.relatedJobId);
      if (job) {
        setSelectedJobForDetails(job);
        setIsNotificationDrawerOpen(false);
        return;
      }
    }
    if (notif.type === 'application_status' || notif.type === 'interview') {
      setCurrentView('applications');
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Notifications
              </h2>
              <p className="text-[11px] text-slate-400">
                {userNotifications.filter((n) => !n.isRead).length} unread updates
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        {userNotifications.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={markAllNotificationsRead}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={clearNotifications}
              className="text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {userNotifications.length > 0 ? (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-3.5 ${
                  !notif.isRead
                    ? 'bg-blue-50/40 dark:bg-blue-950/20'
                    : 'bg-transparent opacity-85'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                    {new Date(notif.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No notifications right now
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                You will be notified about application reviews, interviews, and relevant job matches here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
