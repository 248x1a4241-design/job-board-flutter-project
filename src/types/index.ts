export type UserRole = 'job_seeker' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  title?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experienceYears?: number;
  education?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  companyId?: string; // for recruiters
  companyName?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Remote' | 'Contract';
export type JobCategory =
  | 'Software Development'
  | 'Design & Creative'
  | 'Data Science & AI'
  | 'Product Management'
  | 'Marketing & Sales'
  | 'DevOps & Cloud'
  | 'Customer Support';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  recruiterId: string;
  recruiterName: string;
  location: string;
  jobType: JobType;
  category: JobCategory;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead / Director';
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  deadline: string;
  postedDate: string;
  status: 'approved' | 'pending' | 'rejected' | 'closed';
  viewsCount: number;
  applicantCount: number;
  isFeatured?: boolean;
}

export type ApplicationStatus = 'applied' | 'in_review' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAvatar?: string;
  resumeFileName: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedDate: string;
  updatedDate: string;
  notes?: string;
  interviewDate?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  jobId?: string;
  jobTitle?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application_status' | 'new_job' | 'interview' | 'message' | 'system';
  isRead: boolean;
  timestamp: string;
  relatedJobId?: string;
  relatedApplicationId?: string;
}

export interface ReportedJob {
  id: string;
  jobId: string;
  jobTitle: string;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  details: string;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  recruiterId: string;
}
