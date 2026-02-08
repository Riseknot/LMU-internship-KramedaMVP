import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { UserSwitcher } from './components/UserSwitcher';
import { HelperView } from './pages/HelperView';
import { CoordinatorView } from './pages/CoordinatorView';
import { Assignment } from './types';
import { Heart, LogOut } from 'lucide-react';

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  
  const {
    currentUser,
    isAuthenticated,
    users,
    assignments,
    availabilitySlots,
    chatMessages,
    todos,
    finances,
    costEntries,
    login,
    register,
    logout,
    switchUser,
    updateAssignment,
    addChatMessage,
    updateAvailability,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateFinance,
    addCostEntry,
    assignHelper,
  } = useAppState();

  const handleAcceptAssignment = (id: string) => {
    if (!currentUser) return;
    
    updateAssignment(id, {
      helperId: currentUser.id,
      helperName: currentUser.name,
      status: 'ASSIGNED',
    });

    // Add status event to chat
    addChatMessage({
      assignmentId: id,
      userId: 'system',
      userName: 'System',
      message: `${currentUser.name} hat den Auftrag angenommen`,
      type: 'status_event',
    });
  };

  const handleRejectAssignment = (id: string) => {
    if (!currentUser) return;
    
    addChatMessage({
      assignmentId: id,
      userId: 'system',
      userName: 'System',
      message: `${currentUser.name} hat den Auftrag abgelehnt`,
      type: 'status_event',
    });

    alert('Auftrag wurde abgelehnt');
  };

  const handleCreateAssignment = (assignment: Assignment) => {
    // In a real app, this would be persisted
    alert(`Auftrag "${assignment.title}" wurde erstellt!`);
  };

  const handleSendMessage = (assignmentId: string, message: string) => {
    if (!currentUser) return;
    
    addChatMessage({
      assignmentId,
      userId: currentUser.id,
      userName: currentUser.name,
      message,
      type: 'message',
    });
  };

  // Show register page
  if (!isAuthenticated && showRegister) {
    return (
      <RegisterPage
        onRegister={(userData) => {
          register(userData);
          setShowRegister(false);
        }}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        users={users}
        onLogin={login}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Lädt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-primary-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">CareConnect</h1>
                <p className="text-xs sm:text-sm text-primary-100 hidden sm:block">Pflege koordiniert. Einfach.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <UserSwitcher 
                currentUser={currentUser}
                users={users}
                onSwitchUser={switchUser}
              />
              <button
                onClick={logout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentUser.role === 'helper' && (
          <HelperView
            user={currentUser}
            assignments={assignments}
            availabilitySlots={availabilitySlots}
            chatMessages={chatMessages}
            todos={todos}
            onAcceptAssignment={handleAcceptAssignment}
            onRejectAssignment={handleRejectAssignment}
            onUpdateAvailability={updateAvailability}
            onSendMessage={handleSendMessage}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onLogout={logout}
          />
        )}

        {currentUser.role === 'coordinator' && (
          <CoordinatorView
            user={currentUser}
            assignments={assignments}
            users={users}
            availabilitySlots={availabilitySlots}
            chatMessages={chatMessages}
            todos={todos}
            finances={finances}
            costEntries={costEntries}
            onCreateAssignment={handleCreateAssignment}
            onSendMessage={handleSendMessage}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onUpdateFinance={updateFinance}
            onAddCostEntry={addCostEntry}
            onAssignHelper={assignHelper}
            onLogout={logout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-neutral-600">
          <p>CareConnect MVP · Entwickelt mit React & TypeScript</p>
          <p className="mt-1 text-xs text-neutral-500">
            Dies ist eine Demo-Anwendung mit Beispieldaten
          </p>
        </div>
      </footer>
    </div>
  );
}