import { useState, useEffect } from 'react';
import { User, Assignment, AvailabilitySlot, ChatMessage, TodoItem, CareFinance, CostEntry } from '../types';
import { mockUsers, mockAssignments, mockAvailabilitySlots, mockChatMessages, mockTodos } from '../services/mockData';

export function useAppState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(mockAvailabilitySlots);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [finances, setFinances] = useState<CareFinance[]>([]);
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);

  const login = (user: User) => {
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

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
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
      createdByName: currentUser.name,
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
        helperName: helper.name,
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
  };
}