import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, Application } from '../../types';
import { formatSalary, formatDate, getStatusBadgeColor } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Building2,
  FileText,
  Calendar,
  MessageSquare,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const {
    jobs,
    applications,
    currentUser,
    setIsPostJobModalOpen,
    setJobToEdit,
    deleteJob,
    setSelectedApplicationForReview,
    setSelectedJobForDetails,
    openChatWith,
    companies,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants' | 'company'>('jobs');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Jobs posted by this recruiter (or all jobs for demo company if recruiter)
  const recruiterJobs = jobs.filter(
    (j) =>
      currentUser &&
      (j.recruiterId === currentUser.id ||
        j.company.toLowerCase().includes((currentUser.companyName || 'cloudsphere').toLowerCase()))
  );

  // Applications for these jobs
  const jobIds = recruiterJobs.map((j) => j.id);
  const receivedApplications = applications.filter((app) => jobIds.includes(app.jobId));

  // Stats
  const totalJobsCount = recruiterJobs.length;
  const totalApplicantsCount = receivedApplications.length;
  const totalInterviewsCount = receivedApplications.filter((a) => a.status === 'interview').length;
  const totalHiredCount = receivedApplications.filter((a) => a.status === 'accepted').length;

  // Filtered applications
  const filteredApps = receivedApplications.filter((app) => {
    if (selectedJobFilter !== 'all' && app.jobId !== selectedJobFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        app.applicantName.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q) ||
        app.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleEditJob = (job: Job) => {
    setJobToEdit(job);
    setIsPostJobModalOpen(true);
  };

  const handleDeleteJob = (jobId: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the job listing "${title}"?`)) {
      deleteJob(jobId);
    }
  };

  // Recruiter Company info
  const companyInfo = companies[0];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-3">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Recruiter & Talent Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Manage your open job requisitions, evaluate candidate PDF resumes, schedule interviews, and collaborate with applicants.
          </p>
        </div>

        <button
          onClick={() => {
            setJobToEdit(null);
            setIsPostJobModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalJobsCount}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Active Job Openings
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {totalApplicantsCount}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Received Applications
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {totalInterviewsCount}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Interviews Scheduled
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalHiredCount}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Hired Candidates
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Job Postings ({recruiterJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applicants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'applicants'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline ({receivedApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'company'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Profile</span>
        </button>
      </div>

      {/* Tab 1: Job Postings */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Published Requisitions
            </h2>
            <button
              onClick={() => {
                setJobToEdit(null);
                setIsPostJobModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Vacancy</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Role Title & Company</th>
                    <th className="p-4">Type & Level</th>
                    <th className="p-4">Salary Range</th>
                    <th className="p-4 text-center">Applicants</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {recruiterJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                          />
                          <div>
                            <span
                              onClick={() => setSelectedJobForDetails(job)}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer block"
                            >
                              {job.title}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-[11px] mr-1">
                          {job.jobType}
                        </span>
                        <span className="text-[11px] text-slate-500">{job.experienceLevel}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedJobFilter(job.id);
                            setActiveTab('applicants');
                          }}
                          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-bold hover:bg-blue-100 dark:hover:bg-blue-900 text-slate-800 dark:text-slate-200 transition"
                        >
                          {job.applicantCount} candidates
                        </button>
                      </td>
                      <td className="p-4 font-medium text-slate-500">
                        {formatDate(job.deadline)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedJobForDetails(job)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Preview Job"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditJob(job)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Job"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Candidate Pipeline */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates by name or role..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="text-slate-500 font-medium">Filter by Job:</span>
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="all">All Jobs ({receivedApplications.length})</option>
                {recruiterJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applicants Table / Cards */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={app.applicantName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {app.applicantName}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Applied for: <strong className="text-slate-700 dark:text-slate-300">{app.jobTitle}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formatDate(app.appliedDate)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Resume PDF Badge */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {app.resumeFileName}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      PDF Validated
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() =>
                        openChatWith({
                          id: app.applicantId,
                          name: app.applicantName,
                          role: 'job_seeker',
                          jobId: app.jobId,
                          jobTitle: app.jobTitle,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-bold text-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => setSelectedApplicationForReview(app)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Review & Decide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No candidates found for this selection
              </h3>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Company Profile */}
      {activeTab === 'company' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xs space-y-5 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {companyInfo.name}
              </h3>
              <p className="text-slate-500 font-medium">{companyInfo.industry}</p>
              <p className="text-slate-400">{companyInfo.location} • {companyInfo.size}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Website
              </label>
              <input
                type="text"
                defaultValue={companyInfo.website}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                About Company
              </label>
              <textarea
                rows={4}
                defaultValue={companyInfo.description}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium leading-relaxed"
              />
            </div>

            <button
              onClick={() => alert('Company profile saved successfully!')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Update Company Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
