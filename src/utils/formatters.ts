export const formatSalary = (min: number, max: number, currency: string = 'USD'): string => {
  const formatNum = (num: number) => {
    if (num >= 1000) {
      return `$${Math.round(num / 1000)}k`;
    }
    return `$${num}`;
  };
  return `${formatNum(min)} - ${formatNum(max)}/yr`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getDaysRemaining = (deadline: string): { text: string; isUrgent: boolean } => {
  try {
    const target = new Date(deadline).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { text: 'Closed', isUrgent: true };
    if (diffDays === 1) return { text: '1 day left', isUrgent: true };
    if (diffDays <= 5) return { text: `${diffDays} days left`, isUrgent: true };
    return { text: `${diffDays} days left`, isUrgent: false };
  } catch {
    return { text: 'Active', isUrgent: false };
  }
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    case 'in_review':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    case 'interview':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
    case 'accepted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
  }
};

export const calculateProfileCompletion = (user: {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  education?: string;
  resumeFileName?: string;
}): { percentage: number; missing: string[] } => {
  const missing: string[] = [];
  let score = 0;

  if (user.name) score += 15; else missing.push('Full Name');
  if (user.email) score += 15; else missing.push('Email Address');
  if (user.phone && user.phone !== '+1 (555) 000-0000') score += 10; else missing.push('Phone Number');
  if (user.title) score += 15; else missing.push('Professional Headline / Title');
  if (user.bio) score += 10; else missing.push('Professional Bio');
  if (user.location) score += 10; else missing.push('Location');
  if (user.skills && user.skills.length >= 3) score += 10; else missing.push('At least 3 skills');
  if (user.education) score += 5; else missing.push('Education credentials');
  if (user.resumeFileName) score += 10; else missing.push('Uploaded Resume');

  return { percentage: Math.min(100, score), missing };
};
