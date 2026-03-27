"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppState } from './hooks/useAppState';
import { LoginPage } from './pages/signIn & signUp/LoginPage';
import { RegisterPage } from './pages/signIn & signUp/RegisterPage';
import { UserSwitcher } from './components/UserSwitcher';
import { RootView } from './pages/RootView';
import { LoginAnimation } from './pages/signIn & signUp/LoginAnimation';
import { Assignment, User } from './types';
import { Heart } from 'lucide-react';


export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const pathname = usePathname();
  const activePage = pathname.split('/').filter(Boolean)[0] || 'dashboard';
  


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

  if (isRestoringSession && !currentUser) {
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
    <RootView
      activePage={activePage}
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
      onUpdateAvailability={updateAvailability}
      onLogout={logout}
      onUserUpdate={updateCurrentUser}
    />
  );
}