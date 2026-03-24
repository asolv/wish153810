export type NoticeType =
  | 'Presolicitation'
  | 'Solicitation'
  | 'Award Notice'
  | 'Special Notice'
  | 'Sources Sought'
  | 'Combined Synopsis/Solicitation'
  | 'Modification/Amendment';

export type BidStatus = 'active' | 'closed' | 'awarded' | 'presolicitation' | 'modified';

export interface Bid {
  id: string;
  noticeId: string;
  title: string;
  type: NoticeType;
  status: BidStatus;
  postedDate: string;
  responseDeadline: string;
  agency: string;
  office: string;
  location: string;
  naicsCode: string;
  naicsDescription: string;
  setAside?: string;
  estimatedValue?: number;
  awardAmount?: number;
  awardee?: string;
  awardDate?: string;
  description: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  solicitationNumber: string;
  attachments?: { name: string; url: string }[];
  placeOfPerformance: {
    city: string;
    state: string;
    country: string;
  };
  isUsfk: boolean;
  keywords: string[];
  saved?: boolean;
}

export interface FilterConfig {
  id: string;
  name: string;
  keywords: string[];
  naicsCodes: string[];
  agencies: string[];
  noticeTypes: NoticeType[];
  setAside?: string;
  minValue?: number;
  maxValue?: number;
  isActive: boolean;
  alertEmail: boolean;
  alertSms: boolean;
  alertSlack: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalBids: number;
  newToday: number;
  closingSoon: number;
  awards: number;
  totalAwardValue: number;
  matchedFilters: number;
}

export interface AwardData {
  year: number;
  month: string;
  agency: string;
  awardee: string;
  amount: number;
  naicsCode: string;
  naicsDescription: string;
  title: string;
}

export interface CompetitorData {
  name: string;
  totalAwards: number;
  totalValue: number;
  avgValue: number;
  naicsCodes: string[];
  recentWin?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface ApiSettings {
  samApiKey: string;
  collectInterval: number;
  emailRecipients: string[];
  smsRecipients: string[];
  slackWebhook: string;
  isConnected: boolean;
}
