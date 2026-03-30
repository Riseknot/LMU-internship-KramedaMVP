import { useState } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, CareFinance, CostEntry, HelperEarning, SocialFundContribution, BuddyRelationship } from '../types';
import { mockUsers, mockAssignments, mockAvailabilitySlots, mockChatMessages, mockTodos, mockHelperEarnings, mockSocialFundContributions, mockBuddyRelationships } from '../services/mockData';

const AUTH_USER_STORAGE_KEY = 'mvpkrameda.auth.user';

function readCachedUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function persistCachedUser(user: User | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function useAppState() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => readCachedUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(readCachedUser()));
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(mockAvailabilitySlots);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [finances, setFinances] = useState<CareFinance[]>([]);
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);
  const [helperEarnings, setHelperEarnings] = useState<HelperEarning[]>(mockHelperEarnings);
  const [socialFundContributions, setSocialFundContributions] = useState<SocialFundContribution[]>(mockSocialFundContributions);
  const [buddyRelationships, setBuddyRelationships] = useState<BuddyRelationship[]>(mockBuddyRelationships);

  const login = (user: User) => {
    persistCachedUser(user);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const restoreSession = (user: User | null) => {
    if (!user) {
      persistCachedUser(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return;
    }

    persistCachedUser(user);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const register = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `${userData.role}-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
    login(newUser);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } finally {
      persistCachedUser(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      }
  };


  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      persistCachedUser(user);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) {
        return prev;
      }

      const nextUser = { ...prev, ...updates };
      persistCachedUser(nextUser);
      return nextUser;
    });
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => 
      prev.map(a => a.id === id ? { ...a, ...updates } : a)
    );
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const updateAvailability = (slots: AvailabilitySlot[]) => {
    // Remove old slots for this user
    const otherSlots = availabilitySlots.filter(
      slot => !slots.some(s => s.userId === slot.userId)
    );
    setAvailabilitySlots([...otherSlots, ...slots]);
  };

  const addTodo = (assignmentId: string, text: string) => {
    if (!currentUser) return;
    
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      assignmentId,
      text,
      completed: false,
      createdBy: currentUser.id,
      createdByName: `${currentUser.firstname} ${currentUser.surname}`,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (todoId: string) => {
    if (!currentUser) return;
    
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date().toISOString() : undefined,
          completedBy: !todo.completed ? currentUser.id : undefined,
        };
      }
      return todo;
    }));
  };

  const deleteTodo = (todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  const updateFinance = (finance: CareFinance) => {
    setFinances(prev => {
      const existing = prev.find(f => f.id === finance.id);
      if (existing) {
        return prev.map(f => f.id === finance.id ? finance : f);
      }
      return [...prev, finance];
    });
  };

  const addCostEntry = (entry: CostEntry) => {
    setCostEntries(prev => [...prev, entry]);
  };

  const assignHelper = (assignmentId: string, helperId: string) => {
    const helper = users.find(u => u.id === helperId);
    if (helper) {
      updateAssignment(assignmentId, {
        helperId,
        helperName: `${helper.firstname} ${helper.surname}`,
        status: 'ASSIGNED',
      });
    }
  };

  return {
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
    register,
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
  };
}