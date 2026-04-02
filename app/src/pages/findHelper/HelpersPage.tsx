import React, { useEffect, useMemo, useState } from 'react';
import { User, AvailabilitySlot } from '../../types';
import { HelperListView } from '../helptasks/components/HelperListView';
import { MapView } from './components/MapView';
import { Map as MapIcon, List } from 'lucide-react';
import { Assignment } from '../../types';
import { PageShell, SectionCard } from '../../components/PageShell';

interface HelpersPageProps {
  user: User;
  helpers: User[];
  availabilitySlots: AvailabilitySlot[];
  assignments: Assignment[];
}

export function HelpersPage({
  user,
  helpers,
  availabilitySlots,
  assignments,
}: HelpersPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [dbHelpers, setDbHelpers] = useState<User[]>([]);
  const [loadingHelpers, setLoadingHelpers] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadHelpers = async () => {
      setLoadingHelpers(true);
      try {
        const res = await fetch('/api/users?role=helper&emailVerified=true');
        if (!res.ok) {
          throw new Error('Failed to load helpers');
        }

        const users = await res.json();
        if (!mounted) return;

        const normalized: User[] = Array.isArray(users)
          ? users.map((u: any) => ({
              id: String(u.id || u._id || ''),
              firstname: u.firstname,
              surname: u.surname,
              role: 'helper',
              email: u.email,
              phone: u.phone,
              address: u.address,
              languages: u.languages,
              skills: u.skills,
              bio: u.bio,
              avatarUrl: u.avatarUrl,
              certifications: u.certifications,
              coordinates: u.coordinates,
            }))
          : [];

        setDbHelpers(normalized.filter(h => Boolean(h.id)));
      } catch (error) {
        if (mounted) {
          setDbHelpers([]);
        }
      } finally {
        if (mounted) {
          setLoadingHelpers(false);
        }
      }
    };

    loadHelpers();

    return () => {
      mounted = false;
    };
  }, []);

  const displayedHelpers = useMemo(() => {
    return dbHelpers.length > 0 ? dbHelpers : helpers;
  }, [dbHelpers, helpers]);

  return (
    <PageShell
      eyebrow="Matching"
      title="Helper Übersicht"
      description={`${displayedHelpers.length} Helfer:innen in Ihrer Umgebung – wahlweise in Karte oder Liste.`}
      metrics={[
        { label: 'Helper', value: displayedHelpers.length, hint: 'verfügbare Profile', tone: 'primary' },
        { label: 'Aufträge', value: assignments.length, hint: 'aktuelle Einsätze', tone: 'accent' },
      ]}
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`btn-base px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              viewMode === 'list' ? 'btn-secondary text-white' : 'btn-ghost'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn-base px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              viewMode === 'map' ? 'btn-secondary text-white' : 'btn-ghost'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Karte
          </button>
        </div>
      }
    >
      <SectionCard
        title={viewMode === 'map' ? 'Kartenansicht' : 'Listenansicht'}
        description={loadingHelpers ? 'Helper-Daten werden geladen …' : 'Vergleichen Sie Profile und entscheiden Sie gezielt.'}
        className={viewMode === 'map' ? 'overflow-hidden' : undefined}
        bodyClassName={viewMode === 'map' ? 'overflow-hidden rounded-2xl' : undefined}
      >
        {viewMode === 'list' ? (
          <HelperListView
            helpers={displayedHelpers}
            currentUser={user}
            onSendMessage={(helperId) => alert(`Nachricht an ${helperId}`)}
            onProposeAssignment={(helperId) => alert(`Auftrag an ${helperId} vorgeschlagen`)}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950">
            <MapView currentUser={user} helpers={displayedHelpers} assignments={assignments} loadingHelpers={loadingHelpers} />
          </div>
        )}
      </SectionCard>
    </PageShell>
  );
}
