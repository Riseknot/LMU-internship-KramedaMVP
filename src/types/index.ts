export type UserRole = 'helper' | 'coordinator';

export type AssignmentStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE';

export type PaymentSource = 'selbstzahler' | 'entlastungsbetrag' | 'pflegesachleistung' | 'verhinderungspflege' | 'kurzzeitpflege' | 'zusatzbetreuung' | 'sozialfond';

export type CareGrade = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  zipCode?: string;
  skills?: string[];
  avatarUrl?: string;
  certifications?: Certification[];
  gamification?: GamificationData;
  bio?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  careGrade?: CareGrade; // For coordinators
  socialFundEligible?: boolean; // Can use social fund
  socialFundVerification?: SocialFundVerification; // Verification details
}

export interface Certification {
  id: string;
  name: string;
  type: 'fuehrungszeugnis' | 'erste-hilfe' | 'pflegekurs' | 'other';
  uploadedAt: string;
  verified: boolean;
  fileUrl?: string;
}

export interface GamificationData {
  level: number;
  points: number;
  badges: Badge[];
  streak: number; // Consecutive days active
  completedAssignments: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  coordinatorId: string;
  coordinatorName: string;
  helperId?: string;
  helperName?: string;
  status: AssignmentStatus;
  startTime: string;
  endTime: string;
  zipCode: string;
  requiredSkills: string[];
  createdAt: string;
  rating?: Rating;
  paymentSource?: PaymentSource; // How this assignment is paid
  hourlyRate?: number; // Rate per hour in EUR
}

export interface Rating {
  stars: number;
  comment: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface ChatMessage {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  message: string;
  type: 'message' | 'status_event';
  timestamp: string;
}

export interface HelperScore {
  helperId: string;
  helperName: string;
  score: number;
  distance: number;
  availabilityMatch: number;
  skillMatch: number;
}

export interface TodoItem {
  id: string;
  assignmentId: string;
  text: string;
  completed: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  completedAt?: string;
  completedBy?: string;
}

export interface CareFinance {
  id: string;
  coordinatorId: string;
  month: string; // YYYY-MM format
  pflegesachleistung: number;
  pflegegeld: number;
  verhinderungspflege: number;
  kurzzeitpflege: number;
  zusatzbetreuung: number;
  notes?: string;
  updatedAt: string;
}

export interface CostEntry {
  id: string;
  coordinatorId: string;
  assignmentId?: string;
  date: string;
  description: string;
  amount: number;
  category: 'pflegesachleistung' | 'pflegegeld' | 'verhinderungspflege' | 'kurzzeitpflege' | 'zusatzbetreuung' | 'sonstige';
  createdAt: string;
}

export interface HelperEarning {
  id: string;
  helperId: string;
  assignmentId: string;
  assignmentTitle: string;
  date: string; // YYYY-MM-DD
  amount: number;
  hours: number;
  paymentSource: PaymentSource;
  coordinatorName: string;
}

export interface CareService {
  id: string;
  name: string;
  paymentSource: PaymentSource;
  careGrades: CareGrade[]; // Which care grades are eligible
  maxAmount: number; // Maximum amount in EUR
  maxHours?: number; // Optional: maximum hours
  hourlyRate: number; // Default rate per hour
  priority: number; // Lower number = higher priority for allocation
  description: string;
}

export interface SocialFundVerification {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl: string;
  verifiedAt: string;
  notes?: string;
}

export interface SocialFundContribution {
  id: string;
  coordinatorId: string;
  coordinatorName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  beneficiaryId?: string; // User who benefited
  beneficiaryName?: string;
  assignmentId?: string;
  assignmentTitle?: string;
}

export interface BuddyRelationship {
  id: string;
  coordinatorId: string;
  coordinatorName: string;
  helperId: string;
  helperName: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  createdAt: string;
  acceptedAt?: string;
  totalAssignments: number;
  autoAssign: boolean; // Automatically assign new assignments to buddy
  preferredRate?: number; // Preferred hourly rate for this buddy relationship
  notes?: string;
}