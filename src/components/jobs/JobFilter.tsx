import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Filter, RotateCcw, DollarSign, Briefcase } from 'lucide-react';
import { JOB_CATEGORIES } from '../../data/mockData';

export const JobFilter: React.FC = () => {
  const {
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
  } = useApp();

  const jobTypes = ['All', 'Full-time', 'Remote', 'Part-time', 'Internship'];
  const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Director'];

  const hasActiveFilters =
    searchQuery !== '' ||
    locationQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedJobType !== 'All' ||
    selectedExperience !== 'All' ||
    salaryMinFilter > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs mb-8 transition-colors">
      {/* Search and Location Primary Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        {/* Search by Title / Company / Skill */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by job title, company, or skills (e.g. Flutter, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Location Input */}
        <div className="md:col-span-4 relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Location or 'Remote'..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-2 flex items-center">
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              hasActiveFilters
                ? 'border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scroll / Pills */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Row: Job Type, Experience, Minimum Salary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Job Type Selector */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Job Type
          </label>
          <div className="flex flex-wrap gap-1">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedJobType(type)}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  selectedJobType === type
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level Selector */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Experience Level
          </label>
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            {experienceLevels.map((exp) => (
              <option key={exp} value={exp}>
                {exp === 'All' ? 'All Experience Levels' : exp}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Salary Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span>Minimum Salary</span>
            <span className="text-blue-600 dark:text-blue-400">
              {salaryMinFilter === 0 ? 'Any' : `$${salaryMinFilter / 1000}k+/year`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="180000"
            step="10000"
            value={salaryMinFilter}
            onChange={(e) => setSalaryMinFilter(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
