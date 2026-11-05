import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Code2,
  BookOpen,
  Mail,
  Shield,
  FileCheck,
  CheckCircle2,
  Copy,
  Terminal,
  ExternalLink,
  Smartphone,
  Flame,
} from 'lucide-react';

export const InfoModal: React.FC = () => {
  const { infoModal, closeInfoModal } = useApp();

  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'privacy' | 'terms' | 'flutter_guide'>(
    infoModal.type
  );
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state if modal type changes
  React.useEffect(() => {
    if (infoModal.isOpen) {
      setActiveTab(infoModal.type);
    }
  }, [infoModal.type, infoModal.isOpen]);

  if (!infoModal.isOpen) return null;

  const flutterPubspec = `name: job_board_app
description: "A complete Flutter & Firebase Job Board Application."
version: 1.0.0+1
environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.6.0
  firebase_auth: ^5.3.1
  cloud_firestore: ^5.4.4
  firebase_storage: ^12.3.2
  firebase_messaging: ^15.1.3
  file_picker: ^8.1.4
  provider: ^6.1.2
  intl: ^0.19.0
  flutter_svg: ^2.0.10+1
  cached_network_image: ^3.4.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true`;

  const sampleDartModel = `// lib/models/job_model.dart
class JobModel {
  final String id;
  final String title;
  final String company;
  final String location;
  final String jobType; // Full-time, Remote, etc.
  final String category;
  final int salaryMin;
  final int salaryMax;
  final String description;
  final List<String> skills;
  final DateTime deadline;
  final String recruiterId;

  JobModel({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.jobType,
    required this.category,
    required this.salaryMin,
    required this.salaryMax,
    required this.description,
    required this.skills,
    required this.deadline,
    required this.recruiterId,
  });

  factory JobModel.fromFirestore(Map<String, dynamic> json, String docId) {
    return JobModel(
      id: docId,
      title: json['title'] ?? '',
      company: json['company'] ?? '',
      location: json['location'] ?? '',
      jobType: json['jobType'] ?? 'Full-time',
      category: json['category'] ?? 'General',
      salaryMin: json['salaryMin'] ?? 0,
      salaryMax: json['salaryMax'] ?? 0,
      description: json['description'] ?? '',
      skills: List<String>.from(json['skills'] ?? []),
      deadline: DateTime.tryParse(json['deadline'] ?? '') ?? DateTime.now(),
      recruiterId: json['recruiterId'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'company': company,
      'location': location,
      'jobType': jobType,
      'category': category,
      'salaryMin': salaryMin,
      'salaryMax': salaryMax,
      'description': description,
      'skills': skills,
      'deadline': deadline.toIso8601String(),
      'recruiterId': recruiterId,
    };
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                WorkBridge Information & Documentation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Project architecture, legal policies, and contact information
              </p>
            </div>
          </div>
          <button
            onClick={closeInfoModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('flutter_guide')}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'flutter_guide'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span>Flutter & Firebase Architecture Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>About Us</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* TAB: Flutter & Firebase College Project Guide */}
          {activeTab === 'flutter_guide' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <Flame className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300">
                    College Project Reference & Submission Blueprint
                  </h3>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                    Below is the complete architectural layout, Flutter folder structure, Dart model schemas, and Firebase Cloud Firestore collection blueprints designed for your college project report, viva defense, and Flutter codebase.
                  </p>
                </div>
              </div>

              {/* Step 1: Recommended Project Structure */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>1. Flutter Project Directory Layout</span>
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`job_board_app/
├── android/
├── ios/
├── web/
├── lib/
│   ├── main.dart                      # App entry point, Firebase.initializeApp()
│   ├── firebase_options.dart          # Auto-generated by flutterfire configure
│   ├── models/
│   │   ├── user_model.dart            # Seeker, Recruiter, Admin data model
│   │   ├── job_model.dart             # Job vacancy details, salaries, requirements
│   │   ├── application_model.dart     # Applicant tracking, PDF resume URL, status
│   │   └── chat_message_model.dart    # Real-time messages between seeker & recruiter
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── login_screen.dart      # Email/Password + Role switcher
│   │   │   └── signup_screen.dart     # Role-based registration
│   │   ├── seeker/
│   │   │   ├── home_dashboard.dart    # Categories, recommended & recent jobs
│   │   │   ├── search_filter_screen.dart
│   │   │   ├── job_details_screen.dart# Salary, requirements, apply button
│   │   │   ├── apply_job_screen.dart  # PDF resume file picker upload
│   │   │   ├── saved_jobs_screen.dart # Bookmarks
│   │   │   ├── applications_tracking.dart # Live status pipeline
│   │   │   └── profile_screen.dart    # Profile completion % & PDF resume
│   │   ├── recruiter/
│   │   │   ├── recruiter_dashboard.dart # My jobs, candidates pipeline
│   │   │   ├── post_job_screen.dart   # Create/Edit vacancy
│   │   │   └── candidate_review_screen.dart # Accept/Reject/Interview
│   │   ├── admin/
│   │   │   └── admin_moderation_screen.dart # Reported jobs & stats
│   │   └── chat/
│   │       └── chat_screen.dart       # Real-time Cloud Firestore chat
│   ├── services/
│   │   ├── auth_service.dart          # FirebaseAuth wrapper
│   │   ├── firestore_service.dart     # CRUD for jobs, applications, reports
│   │   └── storage_service.dart       # Firebase Storage PDF resume uploads
│   └── utils/
│       ├── app_theme.dart             # Professional blue & white color palette
│       └── constants.dart
└── pubspec.yaml`}
                </div>
              </div>

              {/* Step 2: Firestore Collections Schema */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  2. Cloud Firestore Database Schema
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <strong className="text-blue-600 block mb-1">Collection: users</strong>
                    <p className="text-slate-500 font-mono text-[11px]">
                      uid, name, email, phone, role ('job_seeker'|'recruiter'|'admin'), resumeUrl, skills[], createdAt
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <strong className="text-blue-600 block mb-1">Collection: jobs</strong>
                    <p className="text-slate-500 font-mono text-[11px]">
                      jobId, title, company, recruiterId, salaryMin, salaryMax, location, jobType, category, status, deadline
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <strong className="text-blue-600 block mb-1">Collection: applications</strong>
                    <p className="text-slate-500 font-mono text-[11px]">
                      appId, jobId, applicantId, resumeFileName, resumeUrl, status ('applied'|'in_review'|'interview'|'accepted'|'rejected'), notes
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <strong className="text-blue-600 block mb-1">Collection: chats / messages</strong>
                    <p className="text-slate-500 font-mono text-[11px]">
                      messageId, senderId, receiverId, jobId, text, timestamp, isRead
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Sample Dart Model */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    3. Sample Dart Job Model Code (Copy-Paste Ready)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(sampleDartModel)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {sampleDartModel}
                </pre>
              </div>

              {/* Step 4: Installation & Execution Steps */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  4. Execution & Setup Commands
                </h4>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
                  <p># 1. Create flutter project</p>
                  <p className="text-blue-600 font-bold">flutter create job_board_app</p>
                  <p># 2. Install dependencies</p>
                  <p className="text-blue-600 font-bold">flutter pub get</p>
                  <p># 3. Configure Firebase with FlutterFire CLI</p>
                  <p className="text-blue-600 font-bold">dart pub global activate flutterfire_cli</p>
                  <p className="text-blue-600 font-bold">flutterfire configure</p>
                  <p># 4. Run application</p>
                  <p className="text-blue-600 font-bold">flutter run -d chrome  # or -d emulator</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: About Us */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                About WorkBridge Career Portal
              </h3>
              <p>
                WorkBridge is a unified, enterprise-grade job marketplace platform designed to bridge the gap between talented job seekers and fast-growing organizations.
              </p>
              <p>
                Equipped with role-based dashboards, verified company vacancies, candidate tracking pipelines, instant messaging, and automated notifications, WorkBridge simplifies the hiring cycle from initial discovery to formal offer acceptance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <strong className="text-slate-900 dark:text-white block text-sm">3 Roles Supported</strong>
                  <p className="text-slate-500 text-xs mt-1">Job Seekers, Corporate Recruiters, and Platform Governance Admins.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <strong className="text-slate-900 dark:text-white block text-sm">Real-time Pipeline</strong>
                  <p className="text-slate-500 text-xs mt-1">Live tracking through Applied, In Review, Interview, and Offer stages.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <strong className="text-slate-900 dark:text-white block text-sm">Direct Messaging</strong>
                  <p className="text-slate-500 text-xs mt-1">Instant communication and interview coordination.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Contact Us */}
          {activeTab === 'contact' && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contact & Technical Support
              </h3>
              <p className="text-slate-500">
                Have questions regarding the application, job postings, or college project documentation? Reach out anytime.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    defaultValue="Alex Chen"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    defaultValue="alex.chen@workbridge.dev"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your inquiry..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => alert('Support message submitted! Our team will respond shortly.')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          )}

          {/* TAB: Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h3>
              <p>Last updated: November 2026</p>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">1. Information Collection</h4>
              <p>
                WorkBridge collects registration data including name, email address, telephone numbers, and uploaded PDF resumes solely for the purpose of matching job seekers with potential employers.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">2. Resume Security</h4>
              <p>
                Candidate resumes are stored securely and only accessible by recruiters of organizations to which candidates explicitly submit applications.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">3. User Rights</h4>
              <p>
                Users maintain the right to delete their profiles, withdraw submitted applications, and remove saved bookmarks at any time.
              </p>
            </div>
          )}

          {/* TAB: Terms & Conditions */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Terms and Conditions of Service
              </h3>
              <p>
                By accessing WorkBridge, users agree to adhere to transparent, lawful recruitment and application standards.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Recruiter Obligations</h4>
              <p>
                All job vacancies must represent genuine, non-discriminatory employment opportunities with accurate compensation ranges.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Candidate Obligations</h4>
              <p>
                Job seekers agree to provide accurate educational records, work experience, and genuine contact credentials.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={closeInfoModal}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
