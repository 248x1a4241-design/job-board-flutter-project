import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Sparkles,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export const ApplyModal: React.FC = () => {
  const { jobToApply, setJobToApply, applyForJob, currentUser, setCurrentView } = useApp();

  const [useProfileResume, setUseProfileResume] = useState<boolean>(
    Boolean(currentUser?.resumeFileName)
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>(
    currentUser
      ? `Dear ${jobToApply?.company} Hiring Team,\n\nI am writing to express my strong enthusiasm for the ${jobToApply?.title} role. With my background in ${currentUser.skills.slice(0, 3).join(', ')}, I am confident in my ability to make an immediate impact on your team.\n\nThank you for considering my application.\n\nBest regards,\n${currentUser.name}`
      : ''
  );
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!jobToApply) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a PDF document (.pdf)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setError(null);
      setUploadedFileName(file.name);
      setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
      setUseProfileResume(false);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resumeToUse = useProfileResume ? currentUser?.resumeFileName : uploadedFileName;

    if (!resumeToUse) {
      setError('Please upload your resume in PDF format or select your saved profile resume.');
      return;
    }

    if (!coverLetter.trim()) {
      setError('Please provide a brief cover letter or note to the hiring team.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      applyForJob(jobToApply, resumeToUse, coverLetter);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#3b82f6', '#60a5fa', '#10b981'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }, 700);
  };

  const fillTemplate = (type: 'experienced' | 'graduate' | 'brief') => {
    if (type === 'experienced') {
      setCoverLetter(
        `Dear Hiring Manager at ${jobToApply.company},\n\nI have over 4 years of proven hands-on experience architecting scalable systems and shipping high-performance applications. I was immediately drawn to ${jobToApply.company}'s work in ${jobToApply.category}.\n\nMy skill set aligns closely with your requirements in ${jobToApply.skills.join(', ')}. I look forward to connecting soon.\n\nWarm regards,\n${currentUser?.name || 'Applicant'}`
      );
    } else if (type === 'graduate') {
      setCoverLetter(
        `Hello ${jobToApply.company} Team,\n\nI am eager to contribute my energy, foundational skills, and quick learning ability to the ${jobToApply.title} position. I have worked extensively with modern frameworks and have built practical projects demonstrating my problem-solving ability.\n\nThank you for reviewing my application!\n\nSincerely,\n${currentUser?.name || 'Applicant'}`
      );
    } else {
      setCoverLetter(
        `Hi ${jobToApply.recruiterName || 'Team'},\n\nI would love to be considered for ${jobToApply.title}. My background in ${currentUser?.skills.slice(0, 2).join(' & ') || 'software'} is a direct match. Looking forward to speaking!\n\n${currentUser?.name || 'Applicant'}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-3.5">
            <img
              src={jobToApply.companyLogo}
              alt={jobToApply.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Application Form
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {jobToApply.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {jobToApply.company} • {jobToApply.location}
              </p>
            </div>
          </div>
          <button
            onClick={() => setJobToApply(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Application Submitted!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your resume and cover letter have been sent directly to{' '}
              <strong className="text-slate-900 dark:text-white">{jobToApply.company}</strong>.
              You will receive real-time notifications as they review your application.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setJobToApply(null);
                  setCurrentView('applications');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>Track Application Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setJobToApply(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Applicant Information Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block mb-0.5">Applicant Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {currentUser?.name || 'Guest User'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {currentUser?.email || 'email@example.com'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            {/* Resume Upload Section */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Resume (PDF Format Required)
              </label>

              {/* Use Existing Resume Option */}
              {currentUser?.resumeFileName && (
                <div
                  onClick={() => setUseProfileResume(true)}
                  className={`p-3 rounded-xl border mb-3 cursor-pointer transition flex items-center justify-between ${
                    useProfileResume
                      ? 'bg-blue-50/80 border-blue-400 dark:bg-blue-900/30 dark:border-blue-700'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Use profile resume: {currentUser.resumeFileName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Saved in your profile • Ready to attach
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={useProfileResume}
                    onChange={() => setUseProfileResume(true)}
                    className="accent-blue-600"
                  />
                </div>
              )}

              {/* Upload New Resume */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition ${
                  !useProfileResume && uploadedFileName
                    ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {!useProfileResume && uploadedFileName ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {uploadedFileName}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        PDF Ready ({fileSize})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFileName('');
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-8 h-8 mx-auto text-blue-500 mb-1.5" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Click to upload new PDF resume or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PDF up to 5MB (validated)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  Cover Letter / Note to Recruiter
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">Quick templates:</span>
                  <button
                    type="button"
                    onClick={() => fillTemplate('experienced')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Senior
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => fillTemplate('graduate')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Graduate
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => fillTemplate('brief')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Short
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you are an ideal fit for this role..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setJobToApply(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
