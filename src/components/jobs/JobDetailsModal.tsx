import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatSalary, formatDate, getDaysRemaining } from '../../utils/formatters';
import {
  X,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Users,
  Bookmark,
  Share2,
  Flag,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Globe,
} from 'lucide-react';

export const JobDetailsModal: React.FC = () => {
  const {
    selectedJobForDetails,
    setSelectedJobForDetails,
    setJobToApply,
    toggleSaveJob,
    isJobSaved,
    applications,
    currentUser,
    openChatWith,
    reportJob,
    setIsAuthModalOpen,
  } = useApp();

  const [isCopied, setIsCopied] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading information');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!selectedJobForDetails) return null;

  const job = selectedJobForDetails;
  const saved = isJobSaved(job.id);
  const remaining = getDaysRemaining(job.deadline);

  const existingApp = applications.find(
    a => currentUser && a.applicantId === currentUser.id && a.jobId === job.id && a.status !== 'withdrawn'
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApply = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setJobToApply(job);
  };

  const handleMessageRecruiter = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    openChatWith({
      id: job.recruiterId,
      name: job.recruiterName,
      role: 'recruiter',
      jobId: job.id,
      jobTitle: job.title,
    });
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    reportJob(job.id, job.title, reportReason, reportDetails);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportForm(false);
      setReportSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-300 transition shadow-xs text-xs font-semibold flex items-center gap-1"
            title="Share Job"
          >
            <Share2 className="w-4 h-4" />
            {isCopied && <span className="text-[10px] text-blue-600 font-bold pr-1">Copied!</span>}
          </button>

          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-full border transition shadow-xs ${
              saved
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300'
                : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
          </button>

          <button
            onClick={() => setSelectedJobForDetails(null)}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition shadow-xs"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {job.company}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Posted {formatDate(job.postedDate)}
                </span>
                {job.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {job.title}
              </h2>
            </div>
          </div>

          {/* Quick Metrics & Tags */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{job.location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{job.jobType}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>{job.experienceLevel}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
            </span>
          </div>

          {/* Social Proof stats */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{job.viewsCount} views</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{job.applicantCount} applicants</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{remaining.text} until deadline ({formatDate(job.deadline)})</span>
            </span>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Status Alert if Already Applied */}
          {existingApp && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    You have applied for this position!
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Status: <strong className="capitalize">{existingApp.status.replace('_', ' ')}</strong> on {formatDate(existingApp.appliedDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleMessageRecruiter}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Job Description
            </h3>
            <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">
              Required Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">
                Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">
                Candidate Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-2" />
                    <span className="text-slate-600 dark:text-slate-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Perks & Benefits</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="text-emerald-500 font-bold">★</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter / Hiring Contact Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                {job.recruiterName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Hiring Manager</p>
                <p className="font-bold text-slate-900 dark:text-white">{job.recruiterName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">CloudSphere Talent Team</p>
              </div>
            </div>
            <button
              onClick={handleMessageRecruiter}
              className="px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask a Question</span>
            </button>
          </div>

          {/* Report Job Section */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            {!showReportForm ? (
              <button
                onClick={() => setShowReportForm(true)}
                className="text-xs text-slate-400 hover:text-rose-500 transition flex items-center gap-1"
              >
                <Flag className="w-3 h-3" />
                <span>Report this listing to administrators</span>
              </button>
            ) : (
              <form onSubmit={handleSubmitReport} className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Job Listing</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
                {reportSubmitted ? (
                  <p className="text-xs text-emerald-600 font-bold">
                    Thank you. This report was submitted to the moderation team.
                  </p>
                ) : (
                  <>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Misleading information">Misleading information</option>
                      <option value="Suspected scam or phishing">Suspected scam or phishing</option>
                      <option value="Discriminatory language">Discriminatory language</option>
                      <option value="Expired or duplicate vacancy">Expired or duplicate vacancy</option>
                    </select>
                    <textarea
                      placeholder="Add brief details about the issue..."
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Submit Report
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Offered Salary</p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {existingApp ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <span>Apply for this Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
