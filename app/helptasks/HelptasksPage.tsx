import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User } from '../src/types';
import { useHelptasks } from '../src/hooks/useHelptasks';
import { HelptaskListView } from '../src/components/HelptaskListView';
import { CreateHelptaskForm } from './components/CreateHelptaskForm';
import { HelptaskMapView } from './components/HelptaskMapView';
import { Search, Plus, List, Map as MapIcon, Settings } from 'lucide-react';
import { Helptask } from '../src/services/helptaskService';
import { CreateHelptaskFormData, HelptaskSearchFilters, HelptaskStatus, HelptaskTab } from './types';
import { PageShell } from '../src/components/PageShell';

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

  const handleSelectTask = (task: Helptask) => {
    window.location.assign(`/helptasks/${task._id}`);
  };

  const handleStatusChange = async (taskId: string, status: HelptaskStatus) => {
    try {
      await updateHelptask(taskId, { status });
      alert(status === 'assigned' ? 'Auftrag erfolgreich angenommen.' : `Status aktualisiert: ${status}`);
    } catch (err) {
      console.error('Error updating helptask status:', err);
    }
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
    <PageShell
      eyebrow="Marketplace"
      title="Hilfeleistungen"
      description={isHelper ? 'Schnell finden, direkt zusagen und entspannt verwalten.' : 'Anfragen ruhig erfassen, filtern und koordinieren.'}
      actions={
        <button onClick={onNavigateBack} className="btn-base btn-ghost rounded-xl px-4 py-2 text-sm">
          ← Zurück
        </button>
      }
      metrics={[
        { label: 'Offen', value: counts.open, hint: 'verfügbare Hilfeleistungen', tone: 'accent' },
        { label: 'Zugewiesen', value: counts.assigned, hint: 'aktive Matches', tone: 'primary' },
        { label: 'Erledigt', value: counts.completed, hint: 'abgeschlossen', tone: 'success' },
      ]}
    >
      {/* Tabs */}
      <div className="surface-card p-2">
        <div className="flex gap-2 overflow-x-auto">
          {filteredTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-base rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'btn-secondary text-white' : 'btn-ghost'
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
            <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
              <form onSubmit={handleSearch} className="surface-card space-y-3 md:p-5">
                <h2 className="text-xl font-bold tracking-[-0.03em] text-neutral-950">Hilfeleistungen durchsuchen</h2>
                <p className="text-sm text-neutral-600">Filter setzen, vergleichen und direkt entscheiden.</p>
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

              <div className="surface-card space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-[-0.03em] text-neutral-950">Markt-Überblick</h3>
                    <p className="text-sm text-neutral-600">Status und Auslastung direkt auf einen Blick.</p>
                  </div>
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800">
                    {helptasks.length} gesamt
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Offen', value: counts.open },
                    { label: 'Zugewiesen', value: counts.assigned },
                    { label: 'Erledigt', value: counts.completed },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{item.label}</p>
                      <p className="mt-1 text-lg font-black text-neutral-950">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Offen', value: counts.open },
                    { label: 'Zugewiesen', value: counts.assigned },
                    { label: 'Abgeschlossen', value: counts.completed },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-neutral-600">{item.label}</span>
                        <span className="font-semibold text-neutral-950">{item.value}</span>
                      </div>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: progressWidth(item.value) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isHelper && (
              <div className="surface-card p-2">
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setBrowseViewMode('map')}
                    className={`btn-base rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                      browseViewMode === 'map' ? 'btn-secondary text-white' : 'btn-ghost'
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    Karte
                  </button>
                  <button
                    onClick={() => setBrowseViewMode('list')}
                    className={`btn-base rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                      browseViewMode === 'list' ? 'btn-secondary text-white' : 'btn-ghost'
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
            <div className="surface-card">
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
    </PageShell>
  );
}
