import React from 'react';
import { User } from '../types';
import { Calendar, Trophy, Map, LogOut, Euro, Users, UserIcon, CheckCircle, List, Shield, Calculator, Heart, UserCheck, Phone } from 'lucide-react';

interface DesktopSidebarProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  activePage: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function DesktopSidebar({
  currentUser,
  onNavigate,
  onLogout,
  activePage,
  isOpen,
  onToggle,
}: DesktopSidebarProps) {
  const coordinatorMenuItems = [
    { id: 'assignments', label: 'Aufträge', icon: Calendar },
    { id: 'helpers', label: 'Helper finden', icon: Users },
    { id: 'buddies', label: 'Meine Buddies', icon: UserCheck },
    { id: 'pflegegrad', label: 'Pflegegrad', icon: Shield },
    { id: 'bedarfsermittlung', label: 'Bedarfsermittlung', icon: Calculator },
    { id: 'sozialfond', label: 'Sozialfond', icon: Heart },
    { id: 'finance', label: 'Kostenübersicht', icon: Euro },
    { id: 'map', label: 'GPS Karte', icon: Map },
    { id: 'gamification', label: 'Erfolge', icon: Trophy },
    { id: 'profile', label: 'Mein Profil', icon: UserIcon },
  ];

  const helperMenuItems = [
    { id: 'assignments', label: 'Aufträge', icon: List },
    { id: 'buddies', label: 'Meine Buddies', icon: UserCheck },
    { id: 'calendar', label: 'Mein Kalender', icon: Calendar },
    { id: 'availability', label: 'Verfügbarkeit', icon: CheckCircle },
    { id: 'gamification', label: 'Erfolge', icon: Trophy },
    { id: 'dashboard', label: 'Dashboard', icon: Euro },
    { id: 'profile', label: 'Mein Profil', icon: UserIcon },
  ];

  const menuItems = currentUser.role === 'coordinator' ? coordinatorMenuItems : helperMenuItems;

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-neutral-200 fixed left-0 top-0 h-screen z-30 shadow-xl animate-in slide-in-from-left duration-300">
      {/* Logo & Brand */}
      <div className="p-6 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-accent-400 to-accent-500 rounded-xl shadow-lg">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CareConnect</h1>
              <p className="text-xs text-primary-100 font-medium">Pflege koordiniert. Einfach.</p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="flex items-center gap-3 p-3.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-200">
            <div className="w-11 h-11 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-primary-100">
                {currentUser.role === 'coordinator' ? 'Koordinator' : 'Helper'}
              </p>
              {currentUser.gamification && (
                <p className="text-xs text-accent-300 mt-0.5 font-medium">
                  Level {currentUser.gamification.level} · {currentUser.gamification.points} XP
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-neutral-50/50 to-white">
        {/* Emergency Hotline Button */}
        <div className="mb-4">
          <a
            href="tel:+498001234567"
            className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-error to-red-600 text-white rounded-xl font-medium shadow-lg shadow-error/30 hover:shadow-xl hover:shadow-error/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="p-2 rounded-lg bg-white/20 animate-pulse">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold block">Notfall-Hotline</span>
              <span className="text-xs text-white/90">+49 800 123 4567</span>
            </div>
          </a>
        </div>

        <ul className="space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${ 
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-200 scale-[1.02]'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-neutral-100 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-pulse"></div>
                      <div className="w-1 h-1 rounded-full bg-accent-400/60"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 bg-gradient-to-br from-neutral-50 to-white">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-error hover:bg-error/10 rounded-xl font-medium transition-all duration-200 group hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="p-1.5 rounded-lg bg-error/10 group-hover:bg-error/20 transition-all duration-200">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Abmelden</span>
        </button>
      </div>
    </aside>
  );
}