import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Send, MessageCircle } from 'lucide-react';

interface ChatProps {
  assignmentId: string;
  messages: ChatMessage[];
  currentUserId: string;
  currentUserName: string;
  onSendMessage: (message: string) => void;
}

export function Chat({ assignmentId, messages, currentUserId, currentUserName, onSendMessage }: ChatProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const assignmentMessages = messages.filter(msg => msg.assignmentId === assignmentId);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 flex flex-col h-[500px]">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary-600" />
          Kommunikation
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {assignmentMessages.length === 0 ? (
          <div className="text-center text-neutral-500 text-sm py-8">
            Noch keine Nachrichten
          </div>
        ) : (
          assignmentMessages.map(msg => (
            <div key={msg.id} className={msg.type === 'status_event' ? 'text-center' : ''}>
              {msg.type === 'status_event' ? (
                <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                  {msg.message}
                </div>
              ) : (
                <div className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.userId === currentUserId 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-100 text-neutral-900'
                  }`}>
                    <div className="text-xs opacity-75 mb-1">{msg.userName}</div>
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nachricht eingeben..."
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
