import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, User, ReportedJob } from '../../types';
import { formatDate, getStatusBadgeColor } from '../../utils/formatters';
import {
  Shield,
  Users,
  Briefcase,
  Flag,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Search,
  UserCheck,
  UserX,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    jobs,
    applications,
    reportedJobs,
    approveJob,
    rejectJob,
    deleteJob,
    resolveReport,
    setSelectedJobForDetails,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'jobs' | 'reports' | 'users'>('stats');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'job_seeker' | 'recruiter' | 'admin'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const totalUsers = users.length;
  const seekersCount = users.filter((u) => u.role === 'job_seeker').length;
  const recruitersCount = users.filter((u) => u.role === 'recruiter').length;
  const totalJobs = jobs.length;
  const approvedJobs = jobs.filter((j) => j.status === 'approved').length;
  const pendingJobs = jobs.filter((j) => j.status === 'pending').length;
  const totalApps = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'accepted').length;
  const pendingReports = reportedJobs.filter((r) => r.status === 'pending').length;

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30 mb-3">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Governance & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Audit platform activities, verify recruiter job quality, moderate reports, and maintain community safety.
          </p>
        </div>

        {pendingReports > 0 && (
          <div className="px-4 py-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{pendingReports} Reported Listing(s) Pending Action</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'stats'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Platform Analytics
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Job Postings ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Moderation Queue</span>
          {pendingReports > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
              {pendingReports}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          User Accounts ({users.length})
        </button>
      </div>

      {/* Tab 1: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalUsers}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Total Registered Users
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                {seekersCount} Seekers • {recruitersCount} Recruiters
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalJobs}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Total Job Requisitions
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                {approvedJobs} Approved & Published
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalApps}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Applications Processed
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Across all companies
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{acceptedApps}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Successful Hires Made
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                {totalApps > 0 ? `${((acceptedApps / totalApps) * 100).toFixed(0)}% Hire Rate` : '0%'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All Job Postings */}
      {activeTab === 'jobs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
            Platform-wide Job Moderation
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Title & Company</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applicants</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p
                            onClick={() => setSelectedJobForDetails(job)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                          >
                            {job.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{job.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{job.category}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{job.applicantCount}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status !== 'approved' && (
                          <button
                            onClick={() => approveJob(job.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                        {job.status !== 'rejected' && (
                          <button
                            onClick={() => rejectJob(job.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700"
                          >
                            Flag / Reject
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${job.title}" completely?`)) {
                              deleteJob(job.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                          title="Delete Permanently"
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
      )}

      {/* Tab 3: Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reportedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportedJobs.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
                      Reason: {rep.reason}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(rep.reportedAt)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rep.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Reported by: <strong>{rep.reportedByName}</strong>
                    </p>
                    {rep.details && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl mt-2 italic">
                        "{rep.details}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold capitalize text-slate-500">
                      Status: {rep.status}
                    </span>
                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => resolveReport(rep.id, 'dismissed')}
                          className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => {
                            deleteJob(rep.jobId);
                            resolveReport(rep.id, 'resolved');
                          }}
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                        >
                          Remove Job
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Moderation Queue Clean
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                No active complaints or user reports pending review.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['all', 'job_seeker', 'recruiter', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition ${
                    userRoleFilter === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{u.phone}</td>
                    <td className="p-4 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
