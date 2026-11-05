import React from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Code2, Shield, Heart, ExternalLink, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openInfoModal, switchUserRole, setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                WorkBridge
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A comprehensive Job Board & Career Ecosystem connecting job seekers with hiring companies. Built with enterprise role-based workflows for Seekers, Recruiters, and Administrators.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Flutter & Firebase Spec</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span>Production Ready</span>
              </span>
            </div>
          </div>

          {/* Quick Role Portals */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Role Dashboards
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    switchUserRole('job_seeker');
                    setCurrentView('explore');
                  }}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span>Job Seeker Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchUserRole('recruiter');
                    setCurrentView('recruiter_dashboard');
                  }}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span>Recruiter Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchUserRole('admin');
                    setCurrentView('admin_dashboard');
                  }}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span>Admin Moderation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('flutter_guide')}
                  className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-semibold"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Flutter Architecture</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Platform Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => openInfoModal('about')}
                  className="hover:text-blue-400 transition"
                >
                  About WorkBridge
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('contact')}
                  className="hover:text-blue-400 transition"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('privacy')}
                  className="hover:text-blue-400 transition"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('terms')}
                  className="hover:text-blue-400 transition"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Project Highlights */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              College Project Spec
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Fulfills all requirements: User Auth, Job Search & Filtering, Details, PDF Resumes, Recruiter Posting, Admin Moderation, Chat, and Notifications.
            </p>
            <button
              onClick={() => openInfoModal('flutter_guide')}
              className="w-full text-xs font-bold text-center py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow"
            >
              View Code & Viva Guide
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WorkBridge Portal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => openInfoModal('privacy')} className="hover:text-slate-400">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => openInfoModal('terms')} className="hover:text-slate-400">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => openInfoModal('contact')} className="hover:text-slate-400">
              Help
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
