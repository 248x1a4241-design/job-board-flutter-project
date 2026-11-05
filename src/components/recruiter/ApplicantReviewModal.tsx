import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { formatDate, getStatusBadgeColor } from '../../utils/formatters';
import {
  X,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const ApplicantReviewModal: React.FC = () => {
  const {
    selectedApplicationForReview,
    setSelectedApplicationForReview,
    updateApplicationStatus,
    openChatWith,
  } = useApp();

  if (!selectedApplicationForReview) return null;

  const app = selectedApplicationForReview;

  const [notes, setNotes] = useState(app.notes || '');
  const [interviewDate, setInterviewDate] = useState(
    app.interviewDate || '2026-11-15 at 2:00 PM EST via Google Meet'
  );
  const [isScheduling, setIsScheduling] = useState(app.status === 'interview');
  const [statusUpdatedAlert, setStatusUpdatedAlert] = useState<string | null>(null);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    updateApplicationStatus(
      app.id,
      newStatus,
      notes,
      newStatus === 'interview' ? interviewDate : undefined
    );

    setStatusUpdatedAlert(`Candidate status set to ${newStatus.toUpperCase()}`);
    setTimeout(() => {
      setStatusUpdatedAlert(null);
    }, 2500);
  };

  const handleChat = () => {
    openChatWith({
      id: app.applicantId,
      name: app.applicantName,
      role: 'job_seeker',
      jobId: app.jobId,
      jobTitle: app.jobTitle,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex items-center gap-3.5">
            <img
              src={app.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={app.applicantName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {app.applicantName}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(
                    app.status
                  )}`}
                >
                  {app.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Applied for <strong className="text-slate-700 dark:text-slate-300">{app.jobTitle}</strong> • {formatDate(app.appliedDate)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedApplicationForReview(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification banner if updated */}
        {statusUpdatedAlert && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 px-6 py-2 border-b border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusUpdatedAlert}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[11px] text-slate-400 block">Email Address</span>
                <span className="font-bold text-slate-900 dark:text-white">{app.applicantEmail}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[11px] text-slate-400 block">Phone Number</span>
                <span className="font-bold text-slate-900 dark:text-white">{app.applicantPhone}</span>
              </div>
            </div>
          </div>

          {/* Attached Resume */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Candidate Resume
            </h3>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {app.resumeFileName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PDF format • Verified candidate upload
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert(`Simulating PDF Viewer for: ${app.resumeFileName}`)}
                className="px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-bold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Resume</span>
              </button>
            </div>
          </div>

          {/* Cover Letter */}
          {app.coverLetter && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Candidate Cover Letter
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                {app.coverLetter}
              </div>
            </div>
          )}

          {/* Recruiter Evaluation & Interview Scheduling */}
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-4">
            <h3 className="text-sm font-bold text-blue-950 dark:text-blue-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Hiring Action & Status Control</span>
            </h3>

            {/* Quick Actions Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleStatusChange('in_review')}
                className={`py-2 px-2.5 rounded-xl font-bold border transition text-center ${
                  app.status === 'in_review'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
                }`}
              >
                Mark In Review
              </button>

              <button
                onClick={() => {
                  setIsScheduling(true);
                  handleStatusChange('interview');
                }}
                className={`py-2 px-2.5 rounded-xl font-bold border transition text-center ${
                  app.status === 'interview'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50'
                }`}
              >
                Schedule Interview
              </button>

              <button
                onClick={() => handleStatusChange('accepted')}
                className={`py-2 px-2.5 rounded-xl font-bold border transition text-center ${
                  app.status === 'accepted'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                }`}
              >
                Accept Candidate
              </button>

              <button
                onClick={() => handleStatusChange('rejected')}
                className={`py-2 px-2.5 rounded-xl font-bold border transition text-center ${
                  app.status === 'rejected'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50'
                }`}
              >
                Reject Candidate
              </button>
            </div>

            {/* If interview, show date/time input */}
            {(app.status === 'interview' || isScheduling) && (
              <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800">
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Interview Date & Instructions
                </label>
                <input
                  type="text"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  placeholder="e.g. Nov 15 at 2:00 PM EST via Google Meet"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>
            )}

            {/* Recruiter Private Notes */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Internal Recruiter Notes / Evaluation
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Candidate feedback, coding score, team fit notes..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={handleChat}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Chat with Candidate</span>
          </button>

          <button
            onClick={() => setSelectedApplicationForReview(null)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
