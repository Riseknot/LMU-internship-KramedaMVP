import React from 'react';
import { Assignment, TodoItem, User } from '../types';
import { X, ClipboardList } from 'lucide-react';
import { TodoList } from './TodoList';

interface TodoModalProps {
  isOpen?: boolean;
  onClose: () => void;
  assignment: Assignment;
  todos: TodoItem[];
  currentUser: User;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
}

export function TodoModal({
  isOpen = true,
  onClose,
  assignment,
  todos,
  currentUser,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: TodoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full sm:max-w-lg sm:max-h-[80vh] h-[90vh] sm:h-auto bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white sm:rounded-t-2xl rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-accent-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-neutral-900">Tagebuch</h2>
              <p className="text-sm text-neutral-600 truncate">{assignment.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <TodoList
            assignmentId={assignment.id}
            todos={todos}
            currentUser={currentUser}
            onAddTodo={onAddTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        </div>
      </div>
    </div>
  );
}