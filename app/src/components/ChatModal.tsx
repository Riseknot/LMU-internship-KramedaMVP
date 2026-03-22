import React from 'react';
import { Assignment, ChatMessage } from '../types';
import { X, MessageSquare } from 'lucide-react';
import { Chat } from './Chat';

interface ChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  assignment: Assignment;
  messages: ChatMessage[];
  currentUserId: string;
  currentUserName: string;
  onSendMessage: (message: string) => void;
}

export function ChatModal({
  isOpen = true,
  onClose,
  assignment,
  messages,
  currentUserId,
  currentUserName,
  onSendMessage,
}: ChatModalProps) {
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
            <div className="p-2 bg-primary-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-neutral-900">Kommunikation</h2>
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
        <div className="flex-1 overflow-hidden">
          <Chat
            assignmentId={assignment.id}
            messages={messages}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  );
}