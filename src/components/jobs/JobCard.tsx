import React from 'react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatSalary, getDaysRemaining } from '../../utils/formatters';
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  featuredOnly?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const {
    setSelectedJobForDetails,
    setJobToApply,
    toggleSaveJob,
    isJobSaved,
    applications,
    currentUser,
    addToRecentlyViewed,
    setIsAuthModalOpen,
  } = useApp();

  const saved = isJobSaved(job.id);
  const remaining = getDaysRemaining(job.deadline);

  // Check if current user already applied
  const existingApp = applications.find(
    a => currentUser && a.applicantId === currentUser.id && a.jobId === job.id && a.status !== 'withdrawn'
  );

  const handleCardClick = () => {
    addToRecentlyViewed(job.id);
    setSelectedJobForDetails(job);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setJobToApply(job);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
        job.isFeatured
          ? 'border-blue-300 dark:border-blue-800 ring-1 ring-blue-500/10 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 shadow-xs'
      }`}
    >
      {/* Featured Banner / Badge */}
      {job.isFeatured && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold py-0.5 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>FEATURED</span>
        </div>
      )}

      {/* Header Row: Company Logo, Title, Bookmark */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
              {job.company}
            </p>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl border transition ${
            saved
              ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300'
              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-200 dark:hover:text-blue-400'
          }`}
          aria-label={saved ? 'Remove Bookmark' : 'Save Job'}
          title={saved ? 'Remove from saved' : 'Save for later'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
        </button>
      </div>

      {/* Meta Pills: Location, Type, Experience Level */}
      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.location}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-800/50">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>{job.jobType}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/50 dark:border-indigo-800/50">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          <span>{job.experienceLevel}</span>
        </span>
      </div>

      {/* Description Snippet */}
      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skills Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
        {job.skills.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="text-[11px] text-slate-400 font-medium px-1">
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

      {/* Footer: Salary & Apply Action */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-0.5">
            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <Calendar className="w-3 h-3" />
            <span className={remaining.isUrgent ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
              Deadline: {remaining.text}
            </span>
          </div>
        </div>

        <div>
          {existingApp ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Applied</span>
            </div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-1.5 group/btn"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
