import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User } from '../../types';
import { useHelptasks } from '../../hooks/useHelptasks';
import { HelptaskListView } from '../../components/HelptaskListView';
import { CreateHelptaskForm } from './components/CreateHelptaskForm';
import { HelptaskMapView } from './components/HelptaskMapView';
import { Search, Plus, List, Map as MapIcon, Settings } from 'lucide-react';
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
  const [browseViewMode, setBrowseViewMode] = useState<'list' | 'map'>(isHelper ? 'map' : 'list');
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

  const counts = useMemo(
    () =>
      helptasks.reduce(
        (acc, task) => ({ ...acc, [task.status]: acc[task.status] + 1 }),
        { open: 0, assigned: 0, completed: 0 } as Record<HelptaskStatus, number>
      ),
    [helptasks]
  );

  const tabs: Array<{ id: HelptaskTab; label: string; icon: React.ComponentType<{ className?: string }>; roles: string[] }> = [
    { id: 'browse', label: 'Durchsuchen', icon: Search, roles: ['helper', 'coordinator'] },
    { id: 'create', label: 'Erstellen', icon: Plus, roles: ['coordinator'] },
    { id: 'manage', label: 'Verwalten', icon: Settings, roles: ['helper', 'coordinator'] },
  ];

  const filteredTabs = tabs.filter(({ roles }) => roles.includes(currentUser.role));

  const managedHelptasks = useMemo(() => helptasks.filter(({ status }) => status !== 'open'), [helptasks]);
  const progressWidth = (count: number) => `${(count / Math.max(helptasks.length, 1)) * 100}%`;
  const setSearchFilter = <K extends keyof HelptaskSearchFilters>(key: K, value: HelptaskSearchFilters[K]) =>
    setSearchFilters((prev) => ({ ...prev, [key]: value }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHelptasks(searchFilters);
  };

  const handleSelectTask = ({ title }: Helptask) => alert(`Task: ${title}`);
  const handleStatusChange = (taskId: string, status: HelptaskStatus) => {
    updateHelptask(taskId, { status });
    alert(`Status updated to ${status}`);
  };

  const handleCreateHelptask = async (helptaskData: CreateHelptaskFormData) => {
    try {
      await createHelptask({
        taskType: 'help',
        title: helptaskData.title,
        description: helptaskData.description,
        address: {
          zipCode: helptaskData.zipCode,
          city: helptaskData.city,
          street: helptaskData.street,
          streetNumber: helptaskData.streetNumber,
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
            <p className="text-xl font-bold text-secondary-800">{counts.open}</p>
          </div>
          <div className="rounded-xl border border-primary-200 bg-primary-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-primary-700">Zugewiesen</p>
            <p className="text-xl font-bold text-primary-800">{counts.assigned}</p>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/10 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-700">Abgeschlossen</p>
            <p className="text-xl font-bold text-neutral-900">{counts.completed}</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200">
          <div className="flex h-full w-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progressWidth(counts.open) }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-secondary-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progressWidth(counts.assigned) }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="bg-primary-600"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progressWidth(counts.completed) }}
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
                  onChange={(e) => setSearchFilter('firstname', e.target.value)}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
                <input
                  type="text"
                  placeholder="Nachname..."
                  value={searchFilters.surname}
                  onChange={(e) => setSearchFilter('surname', e.target.value)}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilter('status', e.target.value as HelptaskStatus)}
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

            {isHelper && (
              <div className="rounded-xl border border-neutral-200 bg-white/90 p-2 shadow-sm">
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setBrowseViewMode('map')}
                    className={`btn-base rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                      browseViewMode === 'map'
                        ? 'btn-secondary text-white'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    Karte
                  </button>
                  <button
                    onClick={() => setBrowseViewMode('list')}
                    className={`btn-base rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                      browseViewMode === 'list'
                        ? 'btn-secondary text-white'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    Liste
                  </button>
                </div>
              </div>
            )}

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
              isHelper && browseViewMode === 'map' ? (
                <HelptaskMapView currentUser={currentUser} helptasks={helptasks} />
              ) : (
                <HelptaskListView
                  helptasks={helptasks}
                  loading={loading}
                  error={error}
                  onSelectTask={handleSelectTask}
                  onUpdateStatus={handleStatusChange}
                />
              )
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
            onCreate={handleCreateHelptask}
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

            {managedHelptasks.length > 0 ? (
              <HelptaskListView
                helptasks={managedHelptasks}
                loading={loading}
                error={error}
                onSelectTask={handleSelectTask}
                onUpdateStatus={handleStatusChange}
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
