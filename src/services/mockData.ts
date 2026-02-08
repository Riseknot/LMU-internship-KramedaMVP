import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'coord-1',
    name: 'Anna Schmidt',
    role: 'coordinator',
    email: 'anna.schmidt@care.de',
    phone: '+49 30 12345678',
    zipCode: '10115',
  },
  {
    id: 'helper-1',
    name: 'Max Müller',
    role: 'helper',
    email: 'max.mueller@care.de',
    zipCode: '10115',
    skills: ['Körperpflege', 'Mobilität', 'Medikamentengabe'],
  },
  {
    id: 'helper-2',
    name: 'Sophie Weber',
    role: 'helper',
    email: 'sophie.weber@care.de',
    zipCode: '10117',
    skills: ['Körperpflege', 'Haushalt', 'Begleitung'],
  },
  {
    id: 'helper-3',
    name: 'Tom Fischer',
    role: 'helper',
    email: 'tom.fischer@care.de',
    zipCode: '10119',
    skills: ['Mobilität', 'Begleitung', 'Haushalt'],
  },
];

// Mock assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Morgenroutine Unterstützung',
    description: 'Hilfe bei der Morgenroutine, Körperpflege und Frühstückszubereitung',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    helperId: 'helper-1',
    helperName: 'Max Müller',
    status: 'ASSIGNED',
    startTime: '2026-02-10T08:00:00',
    endTime: '2026-02-10T10:00:00',
    zipCode: '10115',
    requiredSkills: ['Körperpflege', 'Mobilität'],
    createdAt: '2026-02-05T10:00:00',
  },
  {
    id: 'assign-2',
    title: 'Arztbesuch Begleitung',
    description: 'Begleitung zum Facharzt und zurück',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    status: 'OPEN',
    startTime: '2026-02-12T14:00:00',
    endTime: '2026-02-12T17:00:00',
    zipCode: '10115',
    requiredSkills: ['Begleitung', 'Mobilität'],
    createdAt: '2026-02-08T09:00:00',
  },
  {
    id: 'assign-3',
    title: 'Nachmittagsbetreuung',
    description: 'Gesellschaft, leichte Haushaltsarbeiten',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    helperId: 'helper-2',
    helperName: 'Sophie Weber',
    status: 'IN_PROGRESS',
    startTime: '2026-02-08T14:00:00',
    endTime: '2026-02-08T17:00:00',
    zipCode: '10178',
    requiredSkills: ['Haushalt', 'Begleitung'],
    createdAt: '2026-02-01T10:00:00',
  },
  {
    id: 'assign-4',
    title: 'Medikamentengabe',
    description: 'Tägliche Medikamentengabe am Abend',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    helperId: 'helper-1',
    helperName: 'Max Müller',
    status: 'DONE',
    startTime: '2026-01-15T18:00:00',
    endTime: '2026-01-15T19:00:00',
    zipCode: '10115',
    requiredSkills: ['Medikamentengabe', 'Körperpflege'],
    createdAt: '2026-01-10T10:00:00',
    rating: {
      stars: 5,
      comment: 'Max war sehr zuverlässig und freundlich. Danke!',
      createdAt: '2026-01-15T19:30:00',
    },
  },
];

// Mock availability slots
export const mockAvailabilitySlots: AvailabilitySlot[] = [
  // Max Müller - Monday to Friday mornings
  { id: 'slot-1', userId: 'helper-1', dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
  { id: 'slot-2', userId: 'helper-1', dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
  { id: 'slot-3', userId: 'helper-1', dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
  { id: 'slot-4', userId: 'helper-1', dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
  { id: 'slot-5', userId: 'helper-1', dayOfWeek: 5, startTime: '08:00', endTime: '12:00' },
  
  // Sophie Weber - Afternoons and weekends
  { id: 'slot-6', userId: 'helper-2', dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
  { id: 'slot-7', userId: 'helper-2', dayOfWeek: 2, startTime: '14:00', endTime: '18:00' },
  { id: 'slot-8', userId: 'helper-2', dayOfWeek: 3, startTime: '14:00', endTime: '18:00' },
  { id: 'slot-9', userId: 'helper-2', dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
  { id: 'slot-10', userId: 'helper-2', dayOfWeek: 0, startTime: '10:00', endTime: '16:00' },
  
  // Tom Fischer - Flexible hours
  { id: 'slot-11', userId: 'helper-3', dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
  { id: 'slot-12', userId: 'helper-3', dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
  { id: 'slot-13', userId: 'helper-3', dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    assignmentId: 'assign-1',
    userId: 'coord-1',
    userName: 'Anna Schmidt',
    message: 'Hallo Max, kannst du diesen Einsatz übernehmen?',
    type: 'message',
    timestamp: '2026-02-05T10:05:00',
  },
  {
    id: 'msg-2',
    assignmentId: 'assign-1',
    userId: 'system',
    userName: 'System',
    message: 'Max Müller hat den Auftrag angenommen',
    type: 'status_event',
    timestamp: '2026-02-05T10:30:00',
  },
  {
    id: 'msg-3',
    assignmentId: 'assign-1',
    userId: 'helper-1',
    userName: 'Max Müller',
    message: 'Ja gerne! Ich bin um 8 Uhr da.',
    type: 'message',
    timestamp: '2026-02-05T10:31:00',
  },
];

// Mock todos
export const mockTodos: TodoItem[] = [
  {
    id: 'todo-1',
    assignmentId: 'assign-1',
    text: 'Morgenmedikamente vorbereiten',
    completed: true,
    createdBy: 'coord-1',
    createdByName: 'Anna Schmidt',
    createdAt: '2026-02-05T11:00:00',
    completedAt: '2026-02-06T08:15:00',
    completedBy: 'helper-1',
  },
  {
    id: 'todo-2',
    assignmentId: 'assign-1',
    text: 'Frühstück zubereitet: Brötchen mit Marmelade, Kaffee',
    completed: true,
    createdBy: 'helper-1',
    createdByName: 'Max Müller',
    createdAt: '2026-02-06T08:30:00',
    completedAt: '2026-02-06T09:00:00',
    completedBy: 'helper-1',
  },
  {
    id: 'todo-3',
    assignmentId: 'assign-1',
    text: 'Blutdruck messen und dokumentieren',
    completed: false,
    createdBy: 'coord-1',
    createdByName: 'Anna Schmidt',
    createdAt: '2026-02-07T10:00:00',
  },
  {
    id: 'todo-4',
    assignmentId: 'assign-3',
    text: 'Wohnzimmer staubsaugen',
    completed: true,
    createdBy: 'helper-2',
    createdByName: 'Sophie Weber',
    createdAt: '2026-02-08T14:30:00',
    completedAt: '2026-02-08T15:00:00',
    completedBy: 'helper-2',
  },
  {
    id: 'todo-5',
    assignmentId: 'assign-3',
    text: 'Einkaufsliste für morgen besprochen',
    completed: true,
    createdBy: 'helper-2',
    createdByName: 'Sophie Weber',
    createdAt: '2026-02-08T16:00:00',
    completedAt: '2026-02-08T16:15:00',
    completedBy: 'helper-2',
  },
];