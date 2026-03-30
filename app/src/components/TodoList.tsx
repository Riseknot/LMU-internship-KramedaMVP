import React, { useState } from 'react';
import { TodoItem, User } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, User as UserIcon } from 'lucide-react';

interface TodoListProps {
  assignmentId: string;
  todos: TodoItem[];
  currentUser: User;
  onAddTodo: (assignmentId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
}

export function TodoList({
  assignmentId,
  todos,
  currentUser,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(assignmentId, newTodoText.trim());
      setNewTodoText('');
    }
  };

  const assignmentTodos = todos.filter(t => t.assignmentId === assignmentId);
  const completedCount = assignmentTodos.filter(t => t.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Tagebuch & Aufgaben</h3>
          <p className="text-xs sm:text-sm text-neutral-600">
            {completedCount} von {assignmentTodos.length} erledigt
          </p>
        </div>
        {assignmentTodos.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-20 sm:w-32 bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{
                  width: `${assignmentTodos.length > 0 ? (completedCount / assignmentTodos.length) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Neue Aufgabe..."
            className="flex-1 px-3 sm:px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newTodoText.trim()}
            className="px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Hinzufügen</span>
          </button>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-2">
        {assignmentTodos.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p>Noch keine Einträge im Tagebuch.</p>
            <p className="text-sm mt-1">Fügen Sie Aufgaben oder Notizen hinzu.</p>
          </div>
        ) : (
          assignmentTodos.map(todo => (
            <div
              key={todo.id}
              className={`group p-4 border rounded-lg transition-all ${
                todo.completed
                  ? 'bg-neutral-50 border-neutral-200'
                  : 'bg-white border-neutral-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className="mt-0.5 shrink-0 text-neutral-400 hover:text-primary-600 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`${todo.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      <span>{todo.createdByName}</span>
                    </div>
                    <span>
                      {new Date(todo.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {todo.completed && todo.completedAt && (
                      <span className="text-primary-600">
                        ✓ {new Date(todo.completedAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-400 hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

