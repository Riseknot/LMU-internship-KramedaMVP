export type UserRole = 'helper' | 'coordinator';

export type AssignmentStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  zipCode?: string;
  skills?: string[];
  avatarUrl?: string;
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