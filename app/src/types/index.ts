/**
 * ============================================================
 * Domain Types – Care Platform
 * ============================================================
 *
 * Central type definitions for the care coordination system.
 * Covers users, assignments, payments, gamification, and care
 * financing logic.
 *
 * @remarks
 * - API-safe (only serializable types)
 * - Framework-agnostic
 * - Source of truth for all domain models
 *
 * ============================================================
 */

/** Role of a user within the platform */
export type UserRole = 'helper' | 'coordinator';
/** Lifecycle status of an assignment */
export type AssignmentStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE';
/** Source of payment for care services */
export type PaymentSource = 'selbstzahler' | 'entlastungsbetrag' | 'pflegesachleistung' | 'verhinderungspflege' | 'kurzzeitpflege' | 'zusatzbetreuung' | 'sozialfond';
/** Official German care grade (Pflegegrad) */
export type CareGrade = 1 | 2 | 3 | 4 | 5;


/**
 * Represents a platform user.
 *
 * @remarks
 * Can act as helper or coordinator. Coordinators may have
 * additional care-related properties.
 */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  zipCode?: string;
  languages?: string[];
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

/** Proof of qualification or trust */
//TODO: We would likely have a more robust document management system
export interface Certification {
  id: string;
  name: string;
  type: 'fuehrungszeugnis' | 'erste-hilfe' | 'pflegekurs' | 'other';
  uploadedAt: string;
  verified: boolean;
  fileUrl?: string;
}
/** Gamification progress of a helper */
export interface GamificationData {
  level: number;
  points: number;
  badges: Badge[];
  streak: number; // Consecutive days active
  completedAssignments: number;
}
/** Achievement badge */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

/**
 * Represents a care assignment between coordinator and helper.
 *
 * @remarks
 * Lifecycle: OPEN → ASSIGNED → IN_PROGRESS → DONE
 */
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
/** Rating after assignment completion */
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

/** Chat message within an assignment */
export interface ChatMessage {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  message: string;
  type: 'message' | 'status_event';
  timestamp: string;
}

/** Matching score for helper recommendation */
export interface HelperScore {
  helperId: string;
  helperName: string;
  score: number;
  distance: number;
  availabilityMatch: number;
  skillMatch: number;
}

/** Task within an assignment */
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

/** Monthly care budget overview */
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
/** Individual cost entry */
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
/** Earnings of a helper */
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
/** Definition of a care service type */
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
/** Verification process for social fund access */
export interface SocialFundVerification {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl: string;
  verifiedAt: string;
  notes?: string;
}
/** Contribution to social fund */
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

/**
 * Long-term pairing between coordinator and helper.
 *
 * @remarks
 * Enables recurring assignments and trust-based matching.
 */
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