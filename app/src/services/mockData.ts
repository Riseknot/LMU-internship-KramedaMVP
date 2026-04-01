import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, HelperEarning, SocialFundContribution, BuddyRelationship } from '../types';

const makeAddress = (zipCode: string, city = 'Berlin', street = '', streetNumber = '') => ({
  zipCode,
  city,
  street,
  streetNumber,
});

// Mock users
export const mockUsers: User[] = [
  {
    id: 'coord-1',
    firstname: 'Anna',
    surname: 'Schmidt',
    role: 'coordinator',
    email: 'anna.schmidt@care.de',
    phone: '+49 30 12345678',
    address: makeAddress('10115'),
    bio: 'Pflegekoordinatorin mit 10 Jahren Erfahrung in der häuslichen Pflege.',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    careGrade: 3,
    gamification: {
      level: 3,
      points: 1250,
      badges: [
        {
          id: 'badge-1',
          name: 'Erste Schritte',
          description: 'Ersten Auftrag erstellt',
          icon: '🎯',
          earnedAt: '2026-01-10T10:00:00'
        },
        {
          id: 'badge-2',
          name: 'Teamplayer',
          description: '5 Helper erfolgreich koordiniert',
          icon: '🤝',
          earnedAt: '2026-01-20T15:00:00'
        }
      ],
      streak: 14,
      completedAssignments: 8
    }
  },
  {
    id: 'helper-1',
    firstname: 'Max',
    surname: 'Müller',
    role: 'helper',
    email: 'max.mueller@care.de',
    phone: '+49 30 98765432',
    address: makeAddress('10115'),
    skills: ['Körperpflege', 'Mobilität', 'Medikamentengabe'],
    bio: 'Examinierter Pflegehelfer mit Schwerpunkt auf ganzheitliche Betreuung.',
    coordinates: { lat: 52.5230, lng: 13.4090 },
    certifications: [
      {
        id: 'cert-1',
        name: 'Polizeiliches Führungszeugnis',
        type: 'fuehrungszeugnis',
        uploadedAt: '2026-01-05T10:00:00',
        verified: true,
        fileUrl: 'mock-file-1.pdf'
      },
      {
        id: 'cert-2',
        name: 'Erste-Hilfe-Kurs (aktuell)',
        type: 'erste-hilfe',
        uploadedAt: '2026-01-10T14:00:00',
        verified: true,
        fileUrl: 'mock-file-2.pdf'
      },
      {
        id: 'cert-3',
        name: 'Basispflegekurs',
        type: 'pflegekurs',
        uploadedAt: '2026-01-15T09:00:00',
        verified: true,
        fileUrl: 'mock-file-3.pdf'
      }
    ],
    gamification: {
      level: 7,
      points: 3450,
      badges: [
        {
          id: 'badge-3',
          name: 'Zuverlässig',
          description: '10 Aufträge ohne Absage',
          icon: '⭐',
          earnedAt: '2026-01-15T10:00:00'
        },
        {
          id: 'badge-4',
          name: 'Top-Bewertet',
          description: '5x 5-Sterne Bewertung',
          icon: '🌟',
          earnedAt: '2026-01-25T15:00:00'
        },
        {
          id: 'badge-5',
          name: 'Verifizierter Profi',
          description: 'Alle Zertifikate verifiziert',
          icon: '✅',
          earnedAt: '2026-01-16T12:00:00'
        },
        {
          id: 'badge-6',
          name: 'Früher Vogel',
          description: '30 Tage Streak',
          icon: '🐦',
          earnedAt: '2026-02-01T08:00:00'
        }
      ],
      streak: 35,
      completedAssignments: 24
    }
  },
  {
    id: 'helper-2',
    firstname: 'Sophie',
    surname: 'Weber',
    role: 'helper',
    email: 'sophie.weber@care.de',
    phone: '+49 30 55555555',
    address: makeAddress('10117'),
    skills: ['Körperpflege', 'Haushalt', 'Begleitung'],
    bio: 'Erfahrene Betreuungskraft mit Herz und Geduld für Senioren.',
    coordinates: { lat: 52.5190, lng: 13.3980 },
    certifications: [
      {
        id: 'cert-4',
        name: 'Polizeiliches Führungszeugnis',
        type: 'fuehrungszeugnis',
        uploadedAt: '2026-01-08T11:00:00',
        verified: true,
        fileUrl: 'mock-file-4.pdf'
      },
      {
        id: 'cert-5',
        name: 'Betreuungsassistent §43b',
        type: 'pflegekurs',
        uploadedAt: '2026-01-12T10:00:00',
        verified: false,
        fileUrl: 'mock-file-5.pdf'
      }
    ],
    gamification: {
      level: 5,
      points: 2100,
      badges: [
        {
          id: 'badge-7',
          name: 'Hilfsbereit',
          description: 'Erste 5 Aufträge erfolgreich',
          icon: '💚',
          earnedAt: '2026-01-18T16:00:00'
        },
        {
          id: 'badge-8',
          name: 'Wochenend-Held',
          description: '10 Wochenend-Einsätze',
          icon: '🦸‍♀️',
          earnedAt: '2026-01-30T17:00:00'
        }
      ],
      streak: 21,
      completedAssignments: 15
    }
  },
  {
    id: 'helper-3',
    firstname: 'Tom',
    surname: 'Fischer',
    role: 'helper',
    email: 'tom.fischer@care.de',
    phone: '+49 30 44444444',
    address: makeAddress('10119'),
    skills: ['Mobilität', 'Begleitung', 'Haushalt'],
    bio: 'Flexibler Helper für spontane Einsätze und Begleitdienste.',
    coordinates: { lat: 52.5280, lng: 13.4120 },
    certifications: [
      {
        id: 'cert-6',
        name: 'Erste-Hilfe-Kurs',
        type: 'erste-hilfe',
        uploadedAt: '2026-02-01T09:00:00',
        verified: false,
        fileUrl: 'mock-file-6.pdf'
      }
    ],
    gamification: {
      level: 3,
      points: 950,
      badges: [
        {
          id: 'badge-9',
          name: 'Neustart',
          description: 'Erste Anmeldung',
          icon: '🚀',
          earnedAt: '2026-01-28T10:00:00'
        }
      ],
      streak: 8,
      completedAssignments: 6
    }
  },
  {
    id: 'helper-4',
    firstname: 'Lisa',
    surname: 'Hoffmann',
    role: 'helper',
    email: 'lisa.hoffmann@care.de',
    phone: '+49 30 77777777',
    address: makeAddress('10115'),
    skills: ['Körperpflege', 'Haushalt', 'Begleitung'],
    bio: 'Alleinerziehende Mutter, die durch Pflegehilfe ihre Familie unterstützt.',
    coordinates: { lat: 52.5210, lng: 13.4030 },
    socialFundEligible: true,
    socialFundVerification: {
      id: 'sf-verif-1',
      userId: 'helper-4',
      status: 'approved',
      documentUrl: 'mock-sf-document-1.pdf',
      verifiedAt: '2026-01-05T10:00:00',
      notes: 'Einkommensnachweis und Bedürftigkeitsbescheinigung geprüft und genehmigt.'
    },
    certifications: [
      {
        id: 'cert-7',
        name: 'Polizeiliches Führungszeugnis',
        type: 'fuehrungszeugnis',
        uploadedAt: '2026-01-03T10:00:00',
        verified: true,
        fileUrl: 'mock-file-7.pdf'
      },
      {
        id: 'cert-8',
        name: 'Erste-Hilfe-Kurs',
        type: 'erste-hilfe',
        uploadedAt: '2026-01-04T11:00:00',
        verified: true,
        fileUrl: 'mock-file-8.pdf'
      }
    ],
    gamification: {
      level: 4,
      points: 1520,
      badges: [
        {
          id: 'badge-10',
          name: 'Gemeinschaftsheld',
          description: 'Sozialfond-Nutzer mit 10+ erledigten Aufträgen',
          icon: '💖',
          earnedAt: '2026-01-20T10:00:00'
        }
      ],
      streak: 18,
      completedAssignments: 12
    }
  },
  {
    id: 'helper-5',
    firstname: 'Michael',
    surname: 'Klein',
    role: 'helper',
    email: 'michael.klein@care.de',
    phone: '+49 30 88888888',
    address: makeAddress('10117'),
    skills: ['Mobilität', 'Medikamentengabe', 'Begleitung'],
    bio: 'Student der Pflegewissenschaft, nutzt Sozialfond zur Finanzierung des Studiums.',
    coordinates: { lat: 52.5180, lng: 13.4000 },
    socialFundEligible: true,
    socialFundVerification: {
      id: 'sf-verif-2',
      userId: 'helper-5',
      status: 'approved',
      documentUrl: 'mock-sf-document-2.pdf',
      verifiedAt: '2026-01-08T14:00:00',
      notes: 'Studentenausweis und Einkommensbescheinigung geprüft.'
    },
    certifications: [
      {
        id: 'cert-9',
        name: 'Polizeiliches Führungszeugnis',
        type: 'fuehrungszeugnis',
        uploadedAt: '2026-01-06T09:00:00',
        verified: true,
        fileUrl: 'mock-file-9.pdf'
      },
      {
        id: 'cert-10',
        name: 'Basispflegekurs',
        type: 'pflegekurs',
        uploadedAt: '2026-01-07T10:00:00',
        verified: true,
        fileUrl: 'mock-file-10.pdf'
      }
    ],
    gamification: {
      level: 3,
      points: 1100,
      badges: [
        {
          id: 'badge-11',
          name: 'Fleißig',
          description: '5 Aufträge in einer Woche',
          icon: '⚡',
          earnedAt: '2026-01-25T18:00:00'
        }
      ],
      streak: 12,
      completedAssignments: 8
    }
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
    start: '2026-02-10T08:00:00',
    end: '2026-02-10T10:00:00',
    address: {
      zipCode: '10115',
      city: 'Berlin',
      street: 'Prenzlauer Berg',
      streetNumber: '42'
    },
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
    start: '2026-02-12T14:00:00',
    end: '2026-02-12T17:00:00',
    address: {
      zipCode: '10115',
      city: 'Berlin',
      street: 'Friedrichshain',
      streetNumber: '15'
    },
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
    start: '2026-02-08T14:00:00',
    end: '2026-02-08T17:00:00',
    address: {
      zipCode: '10178',
      city: 'Berlin',
      street: 'Kreuzberg',
      streetNumber: '88'
    },
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
    start: '2026-01-15T18:00:00',
    end: '2026-01-15T19:00:00',
    address: {
      zipCode: '10115',
      city: 'Berlin',
      street: 'Charlottenburg',
      streetNumber: '33'
    },
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

// Mock helper earnings
export const mockHelperEarnings: HelperEarning[] = [
  // Januar - helper-1 (Max Müller)
  {
    id: 'earning-1',
    helperId: 'helper-1',
    assignmentId: 'assign-4',
    assignmentTitle: 'Medikamentengabe',
    date: '2026-01-15',
    amount: 30,
    hours: 1,
    paymentSource: 'pflegesachleistung',
    coordinatorName: 'Anna Schmidt',
  },
  {
    id: 'earning-2',
    helperId: 'helper-1',
    assignmentId: 'completed-1',
    assignmentTitle: 'Morgenroutine',
    date: '2026-01-20',
    amount: 60,
    hours: 2,
    paymentSource: 'entlastungsbetrag',
    coordinatorName: 'Anna Schmidt',
  },
  {
    id: 'earning-3',
    helperId: 'helper-1',
    assignmentId: 'completed-2',
    assignmentTitle: 'Arztbegleitung',
    date: '2026-01-25',
    amount: 90,
    hours: 3,
    paymentSource: 'selbstzahler',
    coordinatorName: 'Anna Schmidt',
  },
  // Februar - helper-1
  {
    id: 'earning-4',
    helperId: 'helper-1',
    assignmentId: 'completed-3',
    assignmentTitle: 'Wocheneinkauf + Begleitung',
    date: '2026-02-01',
    amount: 75,
    hours: 2.5,
    paymentSource: 'entlastungsbetrag',
    coordinatorName: 'Anna Schmidt',
  },
  {
    id: 'earning-5',
    helperId: 'helper-1',
    assignmentId: 'completed-4',
    assignmentTitle: 'Körperpflege',
    date: '2026-02-05',
    amount: 105,
    hours: 3,
    paymentSource: 'pflegesachleistung',
    coordinatorName: 'Anna Schmidt',
  },
  // Januar - helper-2 (Sophie Weber)
  {
    id: 'earning-6',
    helperId: 'helper-2',
    assignmentId: 'completed-5',
    assignmentTitle: 'Haushaltshilfe',
    date: '2026-01-10',
    amount: 80,
    hours: 4,
    paymentSource: 'entlastungsbetrag',
    coordinatorName: 'Anna Schmidt',
  },
  {
    id: 'earning-7',
    helperId: 'helper-2',
    assignmentId: 'completed-6',
    assignmentTitle: 'Nachmittagsbetreuung',
    date: '2026-01-18',
    amount: 60,
    hours: 3,
    paymentSource: 'zusatzbetreuung',
    coordinatorName: 'Anna Schmidt',
  },
  // Februar - helper-2
  {
    id: 'earning-8',
    helperId: 'helper-2',
    assignmentId: 'assign-3',
    assignmentTitle: 'Nachmittagsbetreuung',
    date: '2026-02-08',
    amount: 60,
    hours: 3,
    paymentSource: 'entlastungsbetrag',
    coordinatorName: 'Anna Schmidt',
  },
  // Dezember - helper-1 (ältere Daten für Statistik)
  {
    id: 'earning-9',
    helperId: 'helper-1',
    assignmentId: 'completed-7',
    assignmentTitle: 'Weihnachtsbetreuung',
    date: '2025-12-24',
    amount: 120,
    hours: 4,
    paymentSource: 'verhinderungspflege',
    coordinatorName: 'Anna Schmidt',
  },
  {
    id: 'earning-10',
    helperId: 'helper-1',
    assignmentId: 'completed-8',
    assignmentTitle: 'Silvesterbegleitung',
    date: '2025-12-31',
    amount: 150,
    hours: 5,
    paymentSource: 'selbstzahler',
    coordinatorName: 'Anna Schmidt',
  },
];

// Mock social fund contributions
export const mockSocialFundContributions: SocialFundContribution[] = [
  // Anna Schmidt (coord-1) Beiträge - Helper-4 profitiert davon
  {
    id: 'sf-contrib-1',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 3.5,
    date: '2026-01-15',
    beneficiaryId: 'helper-4',
    beneficiaryName: 'Lisa Hoffmann',
    assignmentId: 'sf-assign-1',
    assignmentTitle: 'Morgenroutine Begleitung',
  },
  {
    id: 'sf-contrib-2',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 4.2,
    date: '2026-01-20',
    beneficiaryId: 'helper-4',
    beneficiaryName: 'Lisa Hoffmann',
    assignmentId: 'sf-assign-2',
    assignmentTitle: 'Einkaufshilfe',
  },
  {
    id: 'sf-contrib-3',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 5.8,
    date: '2026-01-25',
    beneficiaryId: 'helper-4',
    beneficiaryName: 'Lisa Hoffmann',
    assignmentId: 'sf-assign-3',
    assignmentTitle: 'Arztbesuch Begleitung',
  },
  {
    id: 'sf-contrib-4',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 3.1,
    date: '2026-02-01',
    beneficiaryId: 'helper-4',
    beneficiaryName: 'Lisa Hoffmann',
    assignmentId: 'sf-assign-4',
    assignmentTitle: 'Haushaltsführung',
  },
  {
    id: 'sf-contrib-5',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 4.5,
    date: '2026-02-05',
    beneficiaryId: 'helper-5',
    beneficiaryName: 'Michael Klein',
    assignmentId: 'sf-assign-5',
    assignmentTitle: 'Nachmittagsbetreuung',
  },
  {
    id: 'sf-contrib-6',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 2.8,
    date: '2026-02-08',
    beneficiaryId: 'helper-5',
    beneficiaryName: 'Michael Klein',
    assignmentId: 'sf-assign-6',
    assignmentTitle: 'Medikamentengabe',
  },
  {
    id: 'sf-contrib-7',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 6.2,
    date: '2025-12-24',
    beneficiaryId: 'helper-4',
    beneficiaryName: 'Lisa Hoffmann',
    assignmentId: 'sf-assign-7',
    assignmentTitle: 'Weihnachtsbetreuung',
  },
  {
    id: 'sf-contrib-8',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 7.5,
    date: '2025-12-31',
    beneficiaryId: 'helper-4',
    beneficiaryName: 'Lisa Hoffmann',
    assignmentId: 'sf-assign-8',
    assignmentTitle: 'Silvesterbegleitung',
  },
  {
    id: 'sf-contrib-9',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 3.9,
    date: '2026-01-10',
    beneficiaryId: 'helper-5',
    beneficiaryName: 'Michael Klein',
    assignmentId: 'sf-assign-9',
    assignmentTitle: 'Haushaltshilfe',
  },
  {
    id: 'sf-contrib-10',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    amount: 4.3,
    date: '2026-01-18',
    beneficiaryId: 'helper-5',
    beneficiaryName: 'Michael Klein',
    assignmentId: 'sf-assign-10',
    assignmentTitle: 'Spaziergang',
  },
];

// Mock buddy relationships
export const mockBuddyRelationships: BuddyRelationship[] = [
  {
    id: 'buddy-1',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    helperId: 'helper-1',
    helperName: 'Max Müller',
    status: 'active',
    createdAt: '2025-12-01T10:00:00',
    acceptedAt: '2025-12-01T14:30:00',
    totalAssignments: 18,
    autoAssign: true,
    preferredRate: 32,
    notes: 'Langjährige Zusammenarbeit, besonders für morgendliche Routinen',
  },
  {
    id: 'buddy-2',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    helperId: 'helper-2',
    helperName: 'Sophie Weber',
    status: 'active',
    createdAt: '2026-01-10T09:00:00',
    acceptedAt: '2026-01-10T11:15:00',
    totalAssignments: 8,
    autoAssign: true,
    preferredRate: 28,
    notes: 'Sehr gut für Wochenenden und Nachmittage, empathisch im Umgang',
  },
  {
    id: 'buddy-3',
    coordinatorId: 'coord-1',
    coordinatorName: 'Anna Schmidt',
    helperId: 'helper-4',
    helperName: 'Lisa Hoffmann',
    status: 'pending',
    createdAt: '2026-02-05T15:00:00',
    totalAssignments: 0,
    autoAssign: false,
    preferredRate: 30,
    notes: 'Neu vorgeschlagen, wartet auf Lisas Bestätigung',
  },
];