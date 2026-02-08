import React from 'react';
import { User } from '../types';
import { X, User as UserIcon, Map, Euro, Calendar, Settings, LogOut, BarChart3 } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  activePage: string;
}

export function MobileSidebar({
  isOpen,
  onClose,
  currentUser,
  onNavigate,
  onLogout,
  activePage,
}: MobileSidebarProps) {
  const coordinatorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'assignments', label: 'Aufträge', icon: Calendar },
    { id: 'finance', label: 'Kostenübersicht', icon: Euro },
    { id: 'map', label: 'GPS Karte', icon: Map },
    { id: 'profile', label: 'Mein Profil', icon: UserIcon },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
  ];

  const helperMenuItems = [
    { id: 'assignments', label: 'Aufträge', icon: Calendar },
    { id: 'calendar', label: 'Mein Kalender', icon: Calendar },
    { id: 'availability', label: 'Verfügbarkeit', icon: Settings },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Mein Profil', icon: UserIcon },
  ];

  const menuItems = currentUser.role === 'coordinator' ? coordinatorMenuItems : helperMenuItems;

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden flex flex-col animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-6 bg-primary-800 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm text-primary-100">
                {currentUser.role === 'coordinator' ? 'Koordinator' : 'Helper'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Abmelden</span>
          </button>
        </div>
      </div>
    </>
  );
}
