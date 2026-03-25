import React, { useEffect, useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { LoginPage } from './pages/signIn & signUp/LoginPage';
import { RegisterPage } from './pages/signIn & signUp/RegisterPage';
import { UserSwitcher } from './components/UserSwitcher';
import { HelperView } from './pages/HelperView';
import { CoordinatorView } from './pages/CoordinatorView';
import { LoginAnimation } from './pages/signIn & signUp/LoginAnimation';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileSidebar } from './components/MobileSidebar';
import { Assignment, User } from './types';
import { Heart, Menu, X } from 'lucide-react';


export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [activePage, setActivePage] = useState('assignments');
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  


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
    helperEarnings,
    socialFundContributions,
    buddyRelationships,
    login,
    restoreSession,
    logout,
    switchUser,
    updateCurrentUser,
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

  useEffect(() => {
    let isMounted = true;

    const restoreAuthSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          if (isMounted) {
            restoreSession(null);
          }
          return;
        }

        const data = (await res.json()) as { user?: User };
        if (isMounted) {
          restoreSession(data.user ?? null);
        }
      } catch {
        if (isMounted) {
          restoreSession(null);
        }
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    };

    restoreAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = (user: any) => {
    setShowLoginAnimation(true);
    // Wait for animation, then actually login
    setTimeout(() => {
      login(user);
    }, 3500);
  };

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

  if (isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Sitzung wird geladen...</p>
        </div>
      </div>
    );
  }

  // Show register page
  if (!isAuthenticated && showRegister) {
    return (
      <RegisterPage
        onRegister={(user) => {
          login(user);
          setShowRegister(false);
        }}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {showLoginAnimation && (
          <LoginAnimation onComplete={() => setShowLoginAnimation(false)} />
        )}
        {!showLoginAnimation && (
          <LoginPage
            onLogin={handleLogin}
            onShowRegister={() => setShowRegister(true)}
          />
        )}
      </>
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
      {/* Desktop Sidebar */}
      {currentUser && (
        <DesktopSidebar
          currentUser={currentUser}
          onNavigate={setActivePage}
          onLogout={logout}
          activePage={activePage}
          isOpen={desktopSidebarOpen}
          onToggle={setDesktopSidebarOpen}
        />
      )}

      {/* Mobile Sidebar */}
      {currentUser && (
        <MobileSidebar
          currentUser={currentUser}
          onNavigate={setActivePage}
          onLogout={logout}
          activePage={activePage}
          isOpen={mobileSidebarOpen}
          onToggle={setMobileSidebarOpen}
        />
      )}

      {/* Main Layout with Sidebar Offset */}
      <div className={`transition-all duration-300 ${desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Header */}
        <header className="bg-linear-to-r from-primary-700 via-primary-800 to-primary-900 text-white sticky top-0 z-40 shadow-xl border-b border-primary-900/20">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
                <div className="p-2 sm:p-2.5 bg-linear-to-br from-accent-400 to-accent-500 rounded-xl shadow-lg">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight">CareConnect</h1>
                  <p className="text-xs sm:text-sm text-primary-100 font-medium hidden sm:block">Pflege koordiniert. Einfach.</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                {/* Desktop Sidebar Toggle Button */}
                <button
                  onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 hover:shadow-lg"
                  title={desktopSidebarOpen ? "Sidebar schließen" : "Sidebar öffnen"}
                >
                  {desktopSidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <UserSwitcher 
                  currentUser={currentUser}
                  users={users}
                  onSwitchUser={switchUser}
                />
                {/* Mobile Sidebar Toggle Button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 lg:hidden active:scale-95"
                  title="Menu öffnen"
                >
                  <Menu className="w-5 h-5" />
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
              helperEarnings={helperEarnings}
              buddyRelationships={buddyRelationships}
              users={users}
              onAcceptAssignment={handleAcceptAssignment}
              onRejectAssignment={handleRejectAssignment}
              onUpdateAvailability={updateAvailability}
              onSendMessage={handleSendMessage}
              onAddTodo={addTodo}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onUserUpdate={updateCurrentUser}
              onLogout={logout}
              activePage={activePage}
              onNavigate={setActivePage}
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
              socialFundContributions={socialFundContributions}
              buddyRelationships={buddyRelationships}
              onCreateAssignment={handleCreateAssignment}
              onSendMessage={handleSendMessage}
              onAddTodo={addTodo}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onUpdateFinance={updateFinance}
              onAddCostEntry={addCostEntry}
              onAssignHelper={assignHelper}
              onLogout={logout}
              activePage={activePage}
              onNavigate={setActivePage}
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
    </div>
  );
}