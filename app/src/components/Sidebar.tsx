import React from 'react';
import Link from 'next/link';
import { User, UserRole } from '../types';
import {
  ClipboardList, Briefcase, Users, Heart, Euro, Map, Trophy,
  BarChart3, UserIcon, UserCheck, Calculator, Shield,
  LogOut, Menu, X,
  Calendar,
  Home,
  ChevronsLeft,
  ChevronsRight
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
    // { id: 'map', label: 'Karte', icon: Map },
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
      {onToggle && (
        <div className="fixed left-4 top-4 z-50 md:hidden">
          <button onClick={onToggle} className="btn-base btn-ghost p-2.5 shadow-sm">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
          isOpen ? 'translate-x-0 w-72 p-3 md:w-72 md:p-4' : '-translate-x-full w-72 p-3 md:w-24 md:translate-x-0 md:p-4'
        } md:sticky md:top-0`}
      >
        <div className="flex h-full flex-col rounded-[28px] border border-neutral-200 bg-white/96 shadow-[0_18px_46px_rgba(12,13,12,0.08)] backdrop-blur-xl">
          <div className={`bg-primary-900 border-b border-neutral-200 ${isOpen ? 'p-4' : 'p-3'}`}>
            <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
              {isOpen && (
                <div className="w-32">
                  <AppLogo />
                </div>
              )}

              {onToggle ? (
                <button
                  onClick={onToggle}
                  className="hidden rounded-xl border border-neutral-200 bg-white p-2 text-neutral-700 shadow-sm md:inline-flex"
                  aria-label={isOpen ? 'Sidebar einklappen' : 'Sidebar ausklappen'}
                >
                  {isOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                </button>
              ) : null}
            </div>

            {isOpen ? (
              <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50/90 p-2.5">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstname} ${user.surname}`}
                      className="h-11 w-11 rounded-full border border-neutral-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-800">
                      {(user.firstname?.[0] || '').toUpperCase()}
                      {(user.surname?.[0] || '').toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">{user.firstname} {user.surname}</p>
                    <p className="truncate text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Rolle</p>
                  <div className="flex gap-1 rounded-xl bg-white p-1 shadow-inner">
                    {(["helper", "coordinator"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => r !== user.role && onRoleChange?.(r)}
                        className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition-all ${
                          user.role === r ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {r === 'helper' ? 'Helfer:in' : 'Koordinator:in'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex justify-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstname} ${user.surname}`}
                    className="h-10 w-10 rounded-full border border-neutral-200 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-800">
                    {(user.firstname?.[0] || '').toUpperCase()}
                    {(user.surname?.[0] || '').toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className={`flex-1 overflow-y-auto ${isOpen ? 'p-2.5 space-y-1' : 'p-2 space-y-1.5'}`}>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={getHref(item.id)}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    onToggle?.();
                  }
                }}
                className={`flex w-full items-center rounded-xl text-sm font-medium transition-all ${
                  isOpen ? 'gap-3 px-3.5 py-2.5' : 'justify-center px-2 py-3'
                } ${
                  activePage === item.id
                    ? 'border border-secondary-200 bg-secondary-50 text-secondary-800 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                title={item.label}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen ? <span className="truncate">{item.label}</span> : null}
                {isOpen && item.badge ? (
                  <span className="ml-auto rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-bold text-neutral-900">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="border-t border-neutral-200 p-3">
            <button
              onClick={onLogout}
              className={`btn-base btn-ghost flex w-full items-center justify-center gap-3 py-3 text-sm ${isOpen ? 'px-4' : 'px-0'}`}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              {isOpen ? <span>Logout</span> : null}
            </button>
          </div>
        </div>
      </aside>

      {isOpen && onToggle && (
        <div className="fixed inset-0 z-30 bg-black/35 backdrop-blur-[1px] md:hidden" onClick={onToggle} />
      )}
    </>
  );
}
