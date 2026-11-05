import React from 'react';
import { useApp } from '../../context/AppContext';
import { JobCard } from '../jobs/JobCard';
import { Bookmark, ArrowRight, Briefcase } from 'lucide-react';

export const SavedJobsView: React.FC = () => {
  const { savedJobIds, jobs, setCurrentView } = useApp();

  const savedJobs = savedJobIds
    .map((id) => jobs.find((j) => j.id === id))
    .filter((j): j is (typeof jobs)[0] => Boolean(j));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-blue-600 fill-blue-600" />
            <span>Saved Jobs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jobs you have bookmarked for later consideration. Review requirements and apply before deadlines.
          </p>
        </div>

        <div>
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
            {savedJobs.length} Bookmarked
          </span>
        </div>
      </div>

      {/* Grid of Saved Jobs */}
      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            You haven't bookmarked any jobs yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it here for later.
          </p>
          <button
            onClick={() => setCurrentView('explore')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-2"
          >
            <span>Browse Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
