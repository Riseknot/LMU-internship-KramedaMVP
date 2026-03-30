import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User } from '../../types';
import { useHelptasks } from '../../hooks/useHelptasks';
import { HelptaskListView } from '../../components/HelptaskListView';
import { CreateHelptaskForm } from './components/CreateHelptaskForm';
import { Search, Plus, List, Settings } from 'lucide-react';
import { Helptask } from '../../services/helptaskService';
import { CreateHelptaskFormData, HelptaskSearchFilters, HelptaskStatus, HelptaskTab } from './types';

interface HelptasksPageProps {
  currentUser: User;
  onNavigateBack: () => void;
}

export function HelptasksPage({ currentUser, onNavigateBack }: HelptasksPageProps) {
  const isHelper = currentUser.role === 'helper';
  const defaultTab: HelptaskTab = isHelper ? 'browse' : 'create';
  
  const [activeTab, setActiveTab] = useState<HelptaskTab>(defaultTab);
  const [searchFilters, setSearchFilters] = useState<HelptaskSearchFilters>({
    firstname: '',
    surname: '',
    status: 'open',
  });

  const {
    helptasks,
    loading,
    error,
    fetchHelptasks,
    createHelptask,
    updateHelptask,
  } = useHelptasks({ autoFetch: true });

  const openCount = helptasks.filter(task => task.status === 'open').length;
  const activeCount = helptasks.filter(task => task.status === 'assigned').length;
  const doneCount = helptasks.filter(task => task.status === 'completed').length;

  const tabs: Array<{ id: HelptaskTab; label: string; icon: React.ComponentType<{ className?: string }>; roles: string[] }> = [
    { id: 'browse', label: 'Durchsuchen', icon: Search, roles: ['helper', 'coordinator'] },
    { id: 'create', label: 'Erstellen', icon: Plus, roles: ['coordinator'] },
    { id: 'manage', label: 'Verwalten', icon: Settings, roles: ['helper', 'coordinator'] },
  ];

  const filteredTabs = tabs.filter(tab => tab.roles.includes(currentUser.role));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHelptasks(searchFilters);
  };


  const handleCreateHelptask = async (helptaskData: CreateHelptaskFormData) => {
    const normalizedStreet = [helptaskData.street, helptaskData.streetNumber].filter(Boolean).join(' ').trim();

    try {
      await createHelptask({
        taskType: 'help',
        title: helptaskData.title,
        description: helptaskData.description,
        address: {
          zipCode: helptaskData.zipCode,
          city: helptaskData.city.trim(),
          street: normalizedStreet,
        },
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
        start: new Date(helptaskData.start),
        end: new Date(helptaskData.end),
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
    <div className="space-y-4 p-4 md:space-y-5 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-neutral-200 bg-linear-to-br from-white via-neutral-50/90 to-primary-50/50 p-4 shadow-sm md:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold text-neutral-900 md:text-3xl">Hilfeleistungen</h1>
          <p className="text-sm text-neutral-600 md:text-base">
            {isHelper ? 'Schnell finden, direkt zusagen, sauber abschließen.' : 'Ruhig erfassen, gezielt vermitteln, transparent steuern.'}
          </p>
        </div>
        <button
          onClick={onNavigateBack}
          className="btn-base btn-ghost rounded-lg px-4 py-2 text-sm"
        >
          ← Zurück
        </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-secondary-200 bg-secondary-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-secondary-700">Offen</p>
            <p className="text-xl font-bold text-secondary-800">{openCount}</p>
          </div>
          <div className="rounded-xl border border-primary-200 bg-primary-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-primary-700">Zugewiesen</p>
            <p className="text-xl font-bold text-primary-800">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/10 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-700">Abgeschlossen</p>
            <p className="text-xl font-bold text-neutral-900">{doneCount}</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200">
          <div className="flex h-full w-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(openCount / Math.max(helptasks.length, 1)) * 100}%` }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-secondary-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(activeCount / Math.max(helptasks.length, 1)) * 100}%` }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="bg-primary-600"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / Math.max(helptasks.length, 1)) * 100}%` }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="bg-success"
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="rounded-xl border border-neutral-200 bg-white/90 p-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          {filteredTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-base rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'btn-secondary text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22 }}
      >
        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-3 rounded-xl border border-neutral-200 bg-linear-to-br from-white to-neutral-50 p-4 shadow-sm md:p-5">
              <h2 className="text-lg font-semibold text-neutral-900">Hilfeleistungen durchsuchen</h2>
              <p className="text-sm text-neutral-600">Filter setzen, vergleichen, dann direkt entscheiden.</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Vorname..."
                  value={searchFilters.firstname}
                  onChange={(e) => setSearchFilters({ ...searchFilters, firstname: e.target.value })}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
                <input
                  type="text"
                  placeholder="Nachname..."
                  value={searchFilters.surname}
                  onChange={(e) => setSearchFilters({ ...searchFilters, surname: e.target.value })}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value as HelptaskStatus })}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="open">Offen</option>
                  <option value="assigned">Zugewiesen</option>
                  <option value="completed">Abgeschlossen</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-base btn-primary w-full px-4 py-2.5 text-sm sm:w-auto"
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
              <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-error">
                {error}
              </div>
            )}

            {helptasks.length > 0 ? (
              <HelptaskListView
                helptasks={helptasks}
                loading={loading}
                error={error}
                onSelectTask={(task: Helptask) => alert(`Task: ${task.title}`)}
                onUpdateStatus={(taskId: string, status: HelptaskStatus) => {
                  updateHelptask(taskId, { status });
                  alert(`Status updated to ${status}`);
                }}
              />
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-8 text-center">
                <List className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">Keine Hilfeleistungen gefunden</p>
              </div>
            )}
          </div>
        )}

        {/* Create Tab (Coordinator only) */}
        {activeTab === 'create' && !isHelper && (
          <CreateHelptaskForm
            coordinatorId={currentUser.id}
            coordinatorName={currentUser.firstname}
            helpers={[]}
            availabilitySlots={[]}
            onCreate={(assignment) => handleCreateHelptask(assignment)}
          />
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-white/90 p-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {isHelper ? 'Meine angenommenen Hilfeleistungen' : 'Meine Hilfeleistungen'}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Fokus auf laufende und abgeschlossene Einsätze.
            </p>
            </div>

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
                onUpdateStatus={(taskId: string, status: HelptaskStatus) => {
                  updateHelptask(taskId, { status });
                  alert(`Status updated to ${status}`);
                }}
              />
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-8 text-center">
                <Settings className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  {isHelper ? 'Keine angenommenen Hilfeleistungen' : 'Keine Hilfeleistungen zu verwalten'}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
      </AnimatePresence>
    </div>
  );
}
