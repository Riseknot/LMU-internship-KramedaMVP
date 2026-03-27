import React from 'react';
import Link from 'next/link';
import { User, UserRole } from '../types';
import {
  ClipboardList, Briefcase, Users, Heart, Euro, Map, Trophy,
  BarChart3, UserIcon, UserCheck, Calculator, Shield,
  LogOut, Menu, X,
  Calendar,
  Home
} from 'lucide-react';
import { AppLogo } from './AppLogo';


interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  user: User;
  activePage: string;
  onLogout: () => void;
  onRoleChange?: (role: UserRole) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ user, activePage, onLogout, onRoleChange, isOpen = true, onToggle }: SidebarProps) {
  // Helper menu
  const helperItems: MenuItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'helptasks', label: 'Hilfeleistungen finden', icon: Briefcase },
    { id: 'assignments', label: 'Meine Aufträge', icon: ClipboardList, badge: 5 },
    { id: 'calendar', label: 'Mein Kalender', icon: Calendar },
    { id: 'availability', label: 'Meine Verfügbarkeit', icon: Calendar },
    { id: 'gamification', label: 'Erfolge', icon: BarChart3 },
    { id: 'buddies', label: 'Buddies', icon: UserCheck },
    { id: 'profile', label: 'Mein Profil', icon: UserIcon },
  ];

  // Coordinator menu
  const coordinatorItems: MenuItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home},
    { id: 'helptasks', label: 'Meine Hilfeleistungen', icon: Briefcase },
    { id: 'helpers', label: 'Helper finden', icon: Users },
    { id: 'map', label: 'Karte', icon: Map },
    { id: 'finance', label: 'Finanzen', icon: Euro },
    { id: 'bedarfsermittlung', label: 'Bedarfsermittlung', icon: Calculator },
    { id: 'pflegegrad', label: 'Pflegegrad', icon: Shield },
    { id: 'sozialfond', label: 'Sozialfond', icon: Heart },
    { id: 'gamification', label: 'Erfolge', icon: Trophy },
    { id: 'buddies', label: 'Buddies', icon: UserCheck },
    { id: 'profile', label: 'Mein Profil', icon: UserIcon },
  ];

  const menuItems = user.role === 'helper' ? helperItems : coordinatorItems;

  const getHref = (page: string) => `/${page}`;

  return (
    <>
      {/* Mobile Toggle */}
      {onToggle && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={onToggle}
            className="p-2 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static left-0 top-0 w-64 h-screen bg-linear-to-br from-primary-600 to-primary-700 border-r border-neutral-200 flex flex-col transition-transform duration-300 z-40`}
      >
        {/* Header */}
            <div className="p-6 border-b border-neutral-200 bg-linear-to-br from-primary-800 to-primary-900">
            <div className="w-3/4 mx-auto">
                <AppLogo />
            </div>
            </div>

        {/* User Info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.firstname} ${user.surname}`}
                className="h-11 w-11 rounded-full border border-primary-200 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-primary-800 text-xs font-semibold text-white">
                {(user.firstname?.[0] || '').toUpperCase()}
                {(user.surname?.[0] || '').toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-100">{user.firstname} {user.surname}</p>
              <p className="truncate text-xs text-neutral-200">{user.email}</p>
            </div>
          </div>

          <div className="py-2">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-100">Rolle wechseln</p>
            <div className="flex gap-0.5 rounded-xl border border-primary-200 bg-primary-50/70 p-0.5">
              {(["helper", "coordinator"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => r !== user.role && onRoleChange?.(r)}
                  className={`flex-1 rounded-lg py-1.5 px-2 text-[11px] font-semibold transition-all duration-200 ${
                    user.role === r
                      ? "bg-primary-700 text-white shadow-sm"
                      : "text-primary-600 hover:bg-primary-100"
                  }`}
                >
                  {r === "helper" ? "Helfer:in" : "Koordinator:in"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-1 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={getHref(item.id)}
              onClick={() => onToggle?.()}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-neutral-100 text-neutral-800'
                  : 'text-neutral-200 hover:bg-neutral-100 hover:text-neutral-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-neutral-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-100 hover:bg-red-50 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && onToggle && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
