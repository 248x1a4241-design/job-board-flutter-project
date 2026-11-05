import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobCard } from '../jobs/JobCard';
import { JobFilter } from '../jobs/JobFilter';
import { JOB_CATEGORIES } from '../../data/mockData';
import { calculateProfileCompletion } from '../../utils/formatters';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  UserCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  History,
} from 'lucide-react';

export const SeekerDashboard: React.FC = () => {
  const {
    currentUser,
    jobs,
    searchQuery,
    locationQuery,
    selectedCategory,
    selectedJobType,
    selectedExperience,
    salaryMinFilter,
    recentlyViewedIds,
    setSelectedJobForDetails,
    setIsProfileModalOpen,
    setSelectedCategory,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'salary_high' | 'popular'>('latest');

  // Filter jobs logic
  const filteredJobs = jobs.filter((job) => {
    // Only approved and open jobs for seekers
    if (job.status !== 'approved') return false;

    // Search query: title, company, or skills
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }

    // Location query
    if (locationQuery.trim()) {
      const loc = locationQuery.toLowerCase();
      if (!job.location.toLowerCase().includes(loc)) return false;
    }

    // Category
    if (selectedCategory !== 'All' && job.category !== selectedCategory) {
      return false;
    }

    // Job Type
    if (selectedJobType !== 'All' && job.jobType !== selectedJobType) {
      return false;
    }

    // Experience
    if (selectedExperience !== 'All' && job.experienceLevel !== selectedExperience) {
      return false;
    }

    // Minimum Salary
    if (salaryMinFilter > 0 && job.salaryMax < salaryMinFilter) {
      return false;
    }

    return true;
  });

  // Recommended jobs calculation: based on user's skills
  const recommendedJobs = jobs.filter((job) => {
    if (job.status !== 'approved') return false;
    if (!currentUser || !currentUser.skills || currentUser.skills.length === 0) {
      return job.isFeatured;
    }
    const userSkillsLower = currentUser.skills.map((s) => s.toLowerCase());
    const matchedSkills = job.skills.filter((s) =>
      userSkillsLower.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );
    return matchedSkills.length > 0 || job.isFeatured;
  });

  // Recently posted jobs (sorted by date)
  const recentlyPostedJobs = [...jobs]
    .filter((j) => j.status === 'approved')
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

  // Recently viewed jobs
  const recentlyViewedJobs = recentlyViewedIds
    .map((id) => jobs.find((j) => j.id === id))
    .filter((j): j is (typeof jobs)[0] => Boolean(j));

  // Sort filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'salary_high') {
      return b.salaryMax - a.salaryMax;
    }
    if (sortBy === 'popular') {
      return b.applicantCount - a.applicantCount;
    }
    // Default 'latest'
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  // Profile completion
  const profileCompletion = currentUser ? calculateProfileCompletion(currentUser) : null;

  return (
    <div className="space-y-8">
      {/* Welcome & Profile Completeness Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Over 1,200+ Verified Openings Live</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Job Seeker'}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Discover roles that match your craft in Flutter, Cross-Platform Mobile, Web Engineering, AI & Design. Apply with 1-click and track your status in real time.
          </p>

          {/* Profile Completeness Bar */}
          {profileCompletion && profileCompletion.percentage < 100 && (
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-blue-200">
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>Profile Strength: {profileCompletion.percentage}%</span>
                </span>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-white hover:underline text-xs"
                >
                  Complete Profile →
                </button>
              </div>
              <div className="w-full h-2 bg-blue-950/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
              {profileCompletion.missing.length > 0 && (
                <p className="text-[11px] text-blue-200 mt-2">
                  Tip: Add your <strong>{profileCompletion.missing[0]}</strong> to stand out to recruiters!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Featured Categories Carousel / Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Explore by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse openings by industry and specialty
            </p>
          </div>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Show All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {JOB_CATEGORIES.slice(0, 4).map((cat) => (
            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-4 rounded-2xl border transition cursor-pointer hover:shadow-md ${
                selectedCategory === cat.name
                  ? 'bg-blue-50 border-blue-400 dark:bg-blue-950/40 dark:border-blue-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {cat.count} open roles
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for You Section */}
      {recommendedJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Recommended for You</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 hidden sm:inline">
                  (Based on your skills & profile)
                </span>
              </h2>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {recommendedJobs.length} personalized picks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedJobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Primary Search & Filter Component */}
      <div id="all-jobs">
        <JobFilter />

        {/* View Controls & Sort Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 border-b sm:border-b-0 pb-2 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Matches ({sortedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'recent'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recently Posted</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
            >
              <option value="latest">Latest Posted</option>
              <option value="salary_high">Highest Salary</option>
              <option value="popular">Most Applicants</option>
            </select>
          </div>
        </div>

        {/* Job Listings Grid */}
        {sortedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(activeTab === 'all' ? sortedJobs : recentlyPostedJobs).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No jobs found matching your criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, changing the location, or lowering the minimum salary filter.
            </p>
          </div>
        )}
      </div>

      {/* Recently Viewed Jobs Section */}
      {recentlyViewedJobs.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recently Viewed by You
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewedJobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobForDetails(job)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 cursor-pointer transition flex items-center gap-3"
              >
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {job.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
