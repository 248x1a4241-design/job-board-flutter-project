import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobCategory, JobType } from '../../types';
import { JOB_CATEGORIES } from '../../data/mockData';
import { X, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

export const PostJobModal: React.FC = () => {
  const {
    isPostJobModalOpen,
    setIsPostJobModalOpen,
    jobToEdit,
    setJobToEdit,
    addJob,
    updateJob,
    currentUser,
  } = useApp();

  if (!isPostJobModalOpen) return null;

  const isEditing = Boolean(jobToEdit);

  const [title, setTitle] = useState(jobToEdit?.title || '');
  const [company, setCompany] = useState(jobToEdit?.company || currentUser?.companyName || 'CloudSphere Tech');
  const [companyLogo, setCompanyLogo] = useState(
    jobToEdit?.companyLogo ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'
  );
  const [location, setLocation] = useState(jobToEdit?.location || 'Remote (Global)');
  const [jobType, setJobType] = useState<JobType>(jobToEdit?.jobType || 'Full-time');
  const [category, setCategory] = useState<JobCategory>(
    jobToEdit?.category || 'Software Development'
  );
  const [salaryMin, setSalaryMin] = useState(jobToEdit?.salaryMin || 120000);
  const [salaryMax, setSalaryMax] = useState(jobToEdit?.salaryMax || 150000);
  const [experienceLevel, setExperienceLevel] = useState<Job['experienceLevel']>(
    jobToEdit?.experienceLevel || 'Mid Level'
  );
  const [description, setDescription] = useState(
    jobToEdit?.description ||
      'We are looking for a talented engineer to join our fast-growing engineering team...'
  );
  const [skillsStr, setSkillsStr] = useState(jobToEdit?.skills.join(', ') || 'Flutter, Dart, Firebase, REST APIs');
  const [deadline, setDeadline] = useState(jobToEdit?.deadline || '2026-12-31');
  const [responsibilitiesStr, setResponsibilitiesStr] = useState(
    jobToEdit?.responsibilities?.join('\n') ||
      'Develop clean and modular Flutter mobile code\nCollaborate with cross-functional teams\nParticipate in code reviews and architecture design'
  );
  const [benefitsStr, setBenefitsStr] = useState(
    jobToEdit?.benefits?.join('\n') ||
      '100% remote flexibility\nCompetitive stock options & health insurance\nAnnual wellness and hardware stipend'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const responsibilities = responsibilitiesStr
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const benefits = benefitsStr
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    if (isEditing && jobToEdit) {
      updateJob(jobToEdit.id, {
        title,
        company,
        companyLogo,
        location,
        jobType,
        category,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        experienceLevel,
        description,
        skills,
        responsibilities,
        benefits,
        deadline,
      });
      setJobToEdit(null);
    } else {
      addJob({
        title,
        company,
        companyLogo,
        recruiterId: currentUser?.id || 'user_recruiter_1',
        recruiterName: currentUser?.name || 'Sarah Jenkins',
        location,
        jobType,
        category,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        salaryCurrency: 'USD',
        experienceLevel,
        description,
        responsibilities,
        requirements: [
          'Proficiency in core modern languages and frameworks',
          'Experience building and deploying scalable applications',
          'Strong team collaboration and asynchronous communication skills',
        ],
        skills,
        benefits,
        deadline,
      });
    }

    setIsPostJobModalOpen(false);
  };

  const handleClose = () => {
    setJobToEdit(null);
    setIsPostJobModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/40 dark:bg-blue-950/20">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Job Posting' : 'Create & Publish Job Vacancy'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide complete role requirements to attract top candidates
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Flutter Mobile Developer"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. CloudSphere Tech"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                {JOB_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="Full-time">Full-time</option>
                <option value="Remote">Remote</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX (or Remote)"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Director">Lead / Director</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Min Annual Salary ($)
              </label>
              <input
                type="number"
                step="5000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Max Annual Salary ($)
              </label>
              <input
                type="number"
                step="5000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. Flutter, Dart, Firebase, Provider, State Management"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Job Description Overview
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Key Responsibilities (one per line)
            </label>
            <textarea
              rows={3}
              value={responsibilitiesStr}
              onChange={(e) => setResponsibilitiesStr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Benefits & Perks (one per line)
            </label>
            <textarea
              rows={3}
              value={benefitsStr}
              onChange={(e) => setBenefitsStr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium leading-relaxed"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Vacancy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
