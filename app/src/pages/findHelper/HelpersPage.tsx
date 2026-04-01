import React, { useEffect, useMemo, useState } from 'react';
import { User, AvailabilitySlot } from '../../types';
import { HelperListView } from '../helptasks/components/HelperListView';
import { MapView } from './components/MapView';
import { Map as MapIcon, List } from 'lucide-react';
import { Assignment } from '../../types';

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
    <div className="p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold mb-2">Helper Übersicht</h1>
          <p className="text-neutral-600">{displayedHelpers.length} Helfer*innen in deiner Umgebung!</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`btn-base px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              viewMode === 'list'
                ? 'btn-secondary text-white'
                : 'btn-ghost'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn-base px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
              viewMode === 'map'
                ? 'btn-secondary text-white'
                : 'btn-ghost'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Karte
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <HelperListView
          helpers={displayedHelpers}
          currentUser={user}
          onSendMessage={(helperId) => alert(`Nachricht an ${helperId}`)}
          onProposeAssignment={(helperId) => alert(`Auftrag an ${helperId} vorgeschlagen`)}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950" >
          <MapView currentUser={user} helpers={displayedHelpers} assignments={assignments} loadingHelpers={loadingHelpers} />
        </div>
      )}
    </div>
  );
}
