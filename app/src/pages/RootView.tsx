import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, CareFinance, CostEntry, SocialFundContribution, BuddyRelationship } from '../types';
import { Sidebar } from '../components/Sidebar';

// Import all page components
import { AssignmentsPage } from './AssignmentsPage';
import { HelptasksPage } from './helptasks/HelptasksPage';
import { BuddiesPage } from './BuddiesPage';
import { MapPage } from './MapPage';
import { FinancePage } from './FinancePage';
import { ProfilePage } from './ProfilePage';
import { SocialFundPage } from './SocialFundPage';
import { CareGradePage } from './CareGradePage';
import { NeedsCalculatorPage } from './NeedsCalculatorPage';
import { GamificationPage } from './GamificationPage';
import { HelpersPage } from './HelpersPage';
import { AvailabilityPage } from './AvailabilityPage';
import { DashboardHome } from './DashboardHome';

interface RootViewProps {
  activePage: string;
  user: User;
  assignments: Assignment[];
  users: User[];
  availabilitySlots: AvailabilitySlot[];
  chatMessages: ChatMessage[];
  todos: TodoItem[];
  finances: CareFinance[];
  costEntries: CostEntry[];
  socialFundContributions: SocialFundContribution[];
  buddyRelationships: BuddyRelationship[];
  onCreateAssignment: (assignment: Assignment) => void;
  onSendMessage: (assignmentId: string, message: string) => void;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateFinance: (finance: CareFinance) => void;
  onAddCostEntry: (entry: CostEntry) => void;
  onAssignHelper: (assignmentId: string, helperId: string) => void;
  onUpdateAvailability: (slots: AvailabilitySlot[]) => void;
  onLogout: () => void;
  onUserUpdate?: (updates: Partial<User>) => void;
}

export function RootView({
  activePage,
  user,
  assignments,
  users,
  availabilitySlots,
  chatMessages,
  todos,
  finances,
  costEntries,
  socialFundContributions,
  buddyRelationships,
  onCreateAssignment,
  onSendMessage,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateFinance,
  onAddCostEntry,
  onAssignHelper,
  onUpdateAvailability,
  onLogout,
  onUserUpdate,
}: RootViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const helpers = users.filter(u => u.role === 'helper');

  const renderContent = () => {
    switch (activePage) {
      case 'assignments':
        return (
          <AssignmentsPage
            user={user}
            assignments={assignments}
            users={users}
            availabilitySlots={availabilitySlots}
            chatMessages={chatMessages}
            todos={todos}
            onCreateAssignment={onCreateAssignment}
            onSendMessage={onSendMessage}
            onAddTodo={onAddTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
            onAssignHelper={onAssignHelper}
          />
        );

      case 'helptasks':
        return <HelptasksPage currentUser={user} onNavigateBack={() => router.push('/dashboard')} />;

      case 'buddies':
        return <BuddiesPage user={user} users={users} buddyRelationships={buddyRelationships} />;

      case 'map':
        return <MapPage user={user} users={users} assignments={assignments} />;

      case 'finance':
        return (
          <FinancePage
            user={user}
            finances={finances}
            costEntries={costEntries}
            onUpdateFinance={onUpdateFinance}
            onAddCostEntry={onAddCostEntry}
          />
        );

      case 'profile':
        return <ProfilePage user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />;

      case 'sozialfond':
        return <SocialFundPage user={user} contributions={socialFundContributions} />;

      case 'pflegegrad':
        return <CareGradePage user={user} />;

      case 'bedarfsermittlung':
        return <NeedsCalculatorPage user={user} />;

      case 'gamification':
        return <GamificationPage user={user} />;

      case 'helpers':
        return (
          <HelpersPage user={user} helpers={helpers} availabilitySlots={availabilitySlots} assignments={assignments} />
        );

      case 'availability':
        return (
          <AvailabilityPage user={user} availabilitySlots={availabilitySlots} onUpdateAvailability={onUpdateAvailability} />
        );

      case 'calendar':
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kalender</h1>
              <p className="text-neutral-600">Ihre anstehenden Termine</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
              <p className="text-neutral-500">Kalender wird hier angezeigt</p>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <DashboardHome
            currentUser={user}
            assignments={assignments}
            helpers={helpers}
            onNavigate={(page) => router.push(`/${page}`)}
          />
        );

      default:
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-neutral-600">Ihre Statistiken und Übersicht</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar
        user={user}
        activePage={activePage}
        onLogout={onLogout}
        onRoleChange={(role) => {
          onUserUpdate?.({ role });
          router.push('/dashboard');
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
