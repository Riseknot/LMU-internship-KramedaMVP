import React, { useState } from 'react';
import { User, Assignment } from '../types';
import { MapPin, Navigation, Users, Calendar } from 'lucide-react';

interface MapViewProps {
  currentUser: User;
  helpers: User[];
  assignments: Assignment[];
}

export function MapView({ currentUser, helpers, assignments }: MapViewProps) {
  const [selectedHelper, setSelectedHelper] = useState<User | null>(null);

  // Mock coordinates based on ZIP code (in real app, use geocoding API)
  const getCoordinates = (zipCode: string | undefined) => {
    if (!zipCode) return { lat: 52.52, lng: 13.405 }; // Berlin default
    const code = parseInt(zipCode);
    // Simple mock: spread around Berlin
    const lat = 52.52 + ((code % 100) - 50) * 0.01;
    const lng = 13.405 + ((Math.floor(code / 100) % 100) - 50) * 0.01;
    return { lat, lng };
  };

  const userCoords = getCoordinates(currentUser.zipCode);
  const activeAssignments = assignments.filter(
    a => (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS') && a.coordinatorId === currentUser.id
  );
  const availableHelpers = helpers.filter(h => !activeAssignments.some(a => a.helperId === h.id));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-primary-500/20 p-2">
            <MapPin className="w-5 h-5 text-primary-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Live-Karte</h3>
            <p className="text-sm text-neutral-300">Orte, Zeiten und Status in einem klaren Dispatch-Flow</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-primary-500/30 bg-primary-500/10 p-3">
            <p className="text-xs uppercase tracking-wide text-primary-200">Verfügbar</p>
            <p className="text-xl font-bold text-white">{availableHelpers.length}</p>
          </div>
          <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Im Einsatz</p>
            <p className="text-xl font-bold text-white">{activeAssignments.length}</p>
          </div>
          <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Standort</p>
            <p className="text-xl font-bold text-white">PLZ {currentUser.zipCode || 'N/A'}</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg border border-neutral-700 bg-linear-to-br from-neutral-900 via-neutral-800 to-primary-950">
          <div className="absolute -left-10 top-12 h-40 w-40 rounded-full bg-primary-500/15 blur-2xl" />
          <div className="absolute -right-16 bottom-4 h-48 w-48 rounded-full bg-primary-400/10 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="mx-auto mb-3 w-12 h-12 text-primary-300" />
              <p className="font-medium text-white">Interaktive Karte</p>
              <p className="mt-1 text-sm text-neutral-300">
                Fokus auf schnelle Orientierung und klare Entscheidungen
              </p>
            </div>
          </div>

          {/* Mock Map Elements */}
          <div className="absolute left-4 top-4 rounded-lg border border-neutral-700 bg-neutral-900/90 p-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-neutral-200">
              <div className="h-3 w-3 rounded-full bg-primary-400 pulse-soft"></div>
              <span className="font-medium">Ihr Standort</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">PLZ {currentUser.zipCode || 'N/A'}</p>
          </div>

          {/* Mock Helper Markers */}
          {helpers.slice(0, 3).map((helper, index) => (
            <div
              key={helper.id}
              className="absolute cursor-pointer transition-transform hover:scale-110"
              style={{
                top: `${30 + index * 20}%`,
                left: `${30 + index * 15}%`,
              }}
              onClick={() => setSelectedHelper(helper)}
            >
              <div className="relative grid h-9 w-9 place-items-center rounded-full border-2 border-neutral-900 bg-primary-500 shadow-lg shadow-primary-900/60">
                <span className="absolute h-9 w-9 rounded-full bg-primary-400/30 pulse-soft" />
                <Users className="relative z-10 h-4 w-4 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary-400"></div>
            <span className="text-neutral-300">Ihr Standort</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary-500"></div>
            <span className="text-neutral-300">Verfügbare Helper</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-neutral-300"></div>
            <span className="text-neutral-300">Aktive Einsätze</span>
          </div>
        </div>
      </div>

      {/* Helper List */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Helper in Ihrer Nähe</h3>
        <p className="mb-4 text-sm text-neutral-600">Sortiert für schnelle Auswahl wie im Dispatch-Flow</p>
        <div className="space-y-3">
          {helpers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Keine Helper verfügbar
            </div>
          ) : (
            helpers.map(helper => {
              const distance = Math.abs(parseInt(currentUser.zipCode || '0') - parseInt(helper.zipCode || '0')) * 10;
              const helperAssignments = activeAssignments.filter(a => a.helperId === helper.id);
              
              return (
                <div
                  key={helper.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedHelper?.id === helper.id
                      ? 'border-neutral-900 bg-primary-50 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedHelper(helper)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-neutral-900">{helper.firstname} {helper.surname}</h4>
                        {helperAssignments.length > 0 && (
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                            Aktiv
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>PLZ {helper.zipCode || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Navigation className="w-4 h-4" />
                          <span>~{distance} km</span>
                        </div>
                        {helperAssignments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{helperAssignments.length} Einsatz{helperAssignments.length > 1 ? 'e' : ''}</span>
                          </div>
                        )}
                      </div>

                      {helper.skills && helper.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {helper.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {helper.skills.length > 3 && (
                            <span className="px-2 py-0.5 text-neutral-600 text-xs">
                              +{helper.skills.length - 3} mehr
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
