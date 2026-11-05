import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, getStatusBadgeColor } from '../../utils/formatters';
import { Application, ApplicationStatus } from '../../types';
import {
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ApplicationsView: React.FC = () => {
  const {
    applications,
    currentUser,
    withdrawApplication,
    openChatWith,
    jobs,
    setSelectedJobForDetails,
    setCurrentView,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Filter only applications belonging to the current user
  const userApplications = applications.filter(
    (app) => currentUser && app.applicantId === currentUser.id
  );

  const filtered = userApplications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getTimelineSteps = (status: ApplicationStatus) => {
    const steps = [
      { key: 'applied', label: 'Submitted' },
      { key: 'in_review', label: 'Under Review' },
      { key: 'interview', label: 'Interview' },
      { key: 'accepted', label: 'Decision' },
    ];

    let activeIndex = 0;
    if (status === 'in_review') activeIndex = 1;
    if (status === 'interview') activeIndex = 2;
    if (status === 'accepted' || status === 'rejected') activeIndex = 3;

    return { steps, activeIndex, isRejected: status === 'rejected' };
  };

  const handleWithdraw = (appId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) {
      withdrawApplication(appId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Application Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track the real-time status of your active submissions, interview invites, and recruiter notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
            {userApplications.length} Total Applied
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['all', 'applied', 'in_review', 'interview', 'accepted', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider shrink-0 transition ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((app) => {
            const { steps, activeIndex, isRejected } = getTimelineSteps(app.status);
            const associatedJob = jobs.find((j) => j.id === app.jobId);

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition"
              >
                {/* Top Row: Company, Role, Status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={app.companyLogo}
                      alt={app.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3
                        onClick={() => associatedJob && setSelectedJobForDetails(associatedJob)}
                        className="font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                      >
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {app.companyName} • Applied on {formatDate(app.appliedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeColor(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Status Timeline Bar */}
                {app.status !== 'withdrawn' && (
                  <div className="my-6 px-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                      
                      {steps.map((step, idx) => {
                        const isDone = idx <= activeIndex && !(isRejected && idx === activeIndex);
                        const isCurrent = idx === activeIndex;

                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                isCurrent && isRejected
                                  ? 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-950'
                                  : isDone
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] font-semibold mt-1.5 ${
                                isCurrent
                                  ? 'text-slate-900 dark:text-white font-bold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {isRejected && idx === 3 ? 'Not Selected' : step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interview Highlight Callout if scheduled */}
                {app.status === 'interview' && app.interviewDate && (
                  <div className="mb-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-purple-900 dark:text-purple-300">
                        Interview Confirmed
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
                        {app.interviewDate}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recruiter Notes or Feedback */}
                {app.notes && (
                  <div className="mb-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-slate-200">Recruiter Note: </strong>
                    {app.notes}
                  </div>
                )}

                {/* Attached Document & Actions Row */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {app.resumeFileName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        openChatWith({
                          id: associatedJob?.recruiterId || 'user_recruiter_1',
                          name: associatedJob?.recruiterName || 'Hiring Recruiter',
                          role: 'recruiter',
                          jobId: app.jobId,
                          jobTitle: app.jobTitle,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Recruiter</span>
                    </button>

                    {app.status !== 'withdrawn' && app.status !== 'accepted' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 font-semibold transition flex items-center gap-1"
                        title="Withdraw this application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No applications found in this category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Ready to find your next opportunity? Browse open vacancies and apply in seconds.
          </p>
          <button
            onClick={() => setCurrentView('explore')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
          >
            Explore Jobs Now
          </button>
        </div>
      )}
    </div>
  );
};
