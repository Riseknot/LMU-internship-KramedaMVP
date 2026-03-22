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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">GPS Karte</h3>
            <p className="text-sm text-neutral-600">Helper in Ihrer Nähe</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative w-full h-96 bg-neutral-100 rounded-lg overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 font-medium">Interaktive Karte</p>
              <p className="text-sm text-neutral-500 mt-1">
                In der Vollversion mit echter GPS-Integration
              </p>
            </div>
          </div>

          {/* Mock Map Elements */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
              <span className="font-medium">Ihr Standort</span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">PLZ {currentUser.zipCode || 'N/A'}</p>
          </div>

          {/* Mock Helper Markers */}
          {helpers.slice(0, 3).map((helper, index) => (
            <div
              key={helper.id}
              className="absolute cursor-pointer hover:scale-110 transition-transform"
              style={{
                top: `${30 + index * 20}%`,
                left: `${30 + index * 15}%`,
              }}
              onClick={() => setSelectedHelper(helper)}
            >
              <div className="w-8 h-8 bg-accent-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <span className="text-neutral-700">Ihr Standort</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-600 rounded-full"></div>
            <span className="text-neutral-700">Verfügbare Helper</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-neutral-700">Aktive Einsätze</span>
          </div>
        </div>
      </div>

      {/* Helper List */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Helper in Ihrer Nähe</h3>
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
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedHelper(helper)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-neutral-900">{helper.name}</h4>
                        {helperAssignments.length > 0 && (
                          <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
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
