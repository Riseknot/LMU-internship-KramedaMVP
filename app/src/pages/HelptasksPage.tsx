import React, { useState } from 'react';
import { User } from '../types';
import { useHelptasks } from '../hooks/useHelptasks';
import { HelptaskListView } from '../components/HelptaskListView.tsx';
import { CreateAssignmentForm } from '../components/CreateAssignmentForm';
import { Search, Plus, List, Settings } from 'lucide-react';
import { Helptask } from '../services/helptaskService';

interface HelptasksPageProps {
  currentUser: User;
  onNavigateBack: () => void;
}

type TabType = 'browse' | 'create' | 'manage';

export function HelptasksPage({ currentUser, onNavigateBack }: HelptasksPageProps) {
  const isHelper = currentUser.role === 'helper';
  const defaultTab: TabType = isHelper ? 'browse' : 'create';
  
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [searchFilters, setSearchFilters] = useState({
    firstname: '',
    surname: '',
    status: 'open' as const,
  });

  const {
    helptasks,
    loading,
    error,
    fetchHelptasks,
    createHelptask,
    updateHelptask,
  } = useHelptasks({ autoFetch: true });

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; roles: string[] }> = [
    { id: 'browse', label: 'Durchsuchen', icon: Search, roles: ['helper', 'coordinator'] },
    { id: 'create', label: 'Erstellen', icon: Plus, roles: ['coordinator'] },
    { id: 'manage', label: 'Verwalten', icon: Settings, roles: ['helper', 'coordinator'] },
  ];

  const filterredTabs = tabs.filter(tab => tab.roles.includes(currentUser.role));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHelptasks(searchFilters);
  };

  const handleCreateHelptask = async (helptaskData: any) => {
    try {
      await createHelptask({
        taskType: 'help',
        title: helptaskData.title,
        description: helptaskData.description,
        address: {
          zipCode: helptaskData.zipCode,
          city: '',
          street: '',
        },
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
        startTime: new Date(helptaskData.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(helptaskData.endTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        firstname: currentUser.firstname,
        surname: currentUser.surname,
        email: currentUser.email,
      });
      alert('Hilfeleistung erfolgreich erstellt!');
      setActiveTab('manage');
    } catch (err) {
      console.error('Error creating helptask:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hilfeleistungen</h1>
          <p className="text-neutral-600">
            {isHelper ? 'Finden Sie Hilfeleistungsangebote' : 'Erstellen und verwalten Sie Hilfeleistungen'}
          </p>
        </div>
        <button
          onClick={onNavigateBack}
          className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          ← Zurück
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-2 overflow-x-auto">
          {filterredTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold">Hilfeleistungen durchsuchen</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Vorname..."
                  value={searchFilters.firstname}
                  onChange={(e) => setSearchFilters({ ...searchFilters, firstname: e.target.value })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Nachname..."
                  value={searchFilters.surname}
                  onChange={(e) => setSearchFilters({ ...searchFilters, surname: e.target.value })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value as any })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="open">Offen</option>
                  <option value="assigned">Zugewiesen</option>
                  <option value="completed">Abgeschlossen</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Suchen
              </button>
            </form>

            {loading && (
              <div className="text-center py-8">
                <p className="text-neutral-600">Lädt...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            {helptasks.length > 0 ? (
              <HelptaskListView
                helptasks={helptasks}
                loading={loading}
                error={error}
                onSelectTask={(task: Helptask) => alert(`Task: ${task.title}`)}
                onUpdateStatus={(taskId: string, status: 'open' | 'assigned' | 'completed') => {
                  updateHelptask(taskId, { status });
                  alert(`Status updated to ${status}`);
                }}
              />
            ) : (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <List className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">Keine Hilfeleistungen gefunden</p>
              </div>
            )}
          </div>
        )}

        {/* Create Tab (Coordinator only) */}
        {activeTab === 'create' && !isHelper && (
          <CreateAssignmentForm
            coordinatorId={currentUser.id}
            coordinatorName={currentUser.firstname}
            helpers={[]}
            availabilitySlots={[]}
            onCreate={(assignment) => handleCreateHelptask(assignment)}
          />
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">
              {isHelper ? 'Meine angenommenen Hilfeleistungen' : 'Meine Hilfeleistungen'}
            </h2>

            {loading && (
              <div className="text-center py-8">
                <p className="text-neutral-600">Lädt...</p>
              </div>
            )}

            {helptasks.filter(t => t.status !== 'open').length > 0 ? (
              <HelptaskListView
                helptasks={helptasks.filter(t => t.status !== 'open')}
                loading={loading}
                error={error}
                onSelectTask={(task: Helptask) => alert(`Task: ${task.title}`)}
                onUpdateStatus={(taskId: string, status: 'open' | 'assigned' | 'completed') => {
                  updateHelptask(taskId, { status });
                  alert(`Status updated to ${status}`);
                }}
              />
            ) : (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <Settings className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  {isHelper ? 'Keine angenommenen Hilfeleistungen' : 'Keine Hilfeleistungen zu verwalten'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
