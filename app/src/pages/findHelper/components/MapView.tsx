import React, { useMemo, useState } from 'react';
import { Assignment, User } from '../../../types';
import { Calendar, MapPin, Navigation } from 'lucide-react';
import { PageLoadingState } from '../../../../loadingpage/components/PageLoadingState';
import { GoogleAreaMap, MapArea, MapMarker } from '../../../../helptasks/components/GoogleAreaMap';
import { DEFAULT_CENTER, GeoSource, createCurrentUserMarker, distanceByZip, escapeHtml, formatAddress, resolveUserCenter } from '../../../../helptasks/components/utils';
import { ShortPageLoadingState } from '../../../../loadingpage/components/ShortPageLoadingState';

interface MapViewProps {
  currentUser: User;
  helpers: User[];
  assignments: Assignment[];
  loadingHelpers?: boolean;
}

const COORDINATE_AREA_RADIUS_M = 1200;

const Stat = ({ label, value, isPrimary }: { label: string; value: string | number; isPrimary?: boolean }) => (
  <div className={`rounded-lg border p-3 ${isPrimary ? 'border-primary-500/30 bg-primary-500/10' : 'border-neutral-700 bg-neutral-800'}`}>
    <p className={`text-xs uppercase tracking-wide ${isPrimary ? 'text-primary-200' : 'text-neutral-400'}`}>{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: color }}></div>
    <span className="text-neutral-300">{label}</span>
  </div>
);

const formatSource = (source: GeoSource) =>
  source === 'coordinates' ? 'Koordinaten' : source === 'address' ? 'Adresse aus DB' : 'kein Standort';

export function MapView({ currentUser, helpers, assignments, loadingHelpers }: MapViewProps) {
  const [selectedHelper, setSelectedHelper] = useState<User | null>(null);

  const activeAssignments = assignments.filter(
    (assignment) => ['ASSIGNED', 'IN_PROGRESS'].includes(assignment.status) && assignment.coordinatorId === currentUser.id
  );

  const assignmentCounts = useMemo(
    () => activeAssignments.reduce<Record<string, number>>((acc, assignment) => {
      if (assignment.helperId) acc[assignment.helperId] = (acc[assignment.helperId] || 0) + 1;
      return acc;
    }, {}),
    [activeAssignments]
  );

  const availableHelpers = helpers.filter(({ id }) => !assignmentCounts[id]);

  const helperAreas = useMemo(
    () =>
      helpers
        .map((helper) => {
          const resolved = resolveUserCenter(helper);
          return resolved.position
            ? {
                helper,
                position: resolved.position,
                source: resolved.source,
                radius: COORDINATE_AREA_RADIUS_M,
              }
            : null;
        })
        .filter(Boolean) as Array<{
        helper: User;
        position: [number, number];
        source: GeoSource;
        radius: number;
      }>,
    [helpers]
  );

  const currentUserArea = resolveUserCenter(currentUser);
  const currentUserAddress = formatAddress(currentUser.address);
  const mapCenter = currentUserArea.position || helperAreas[0]?.position || DEFAULT_CENTER;
  const userZip = currentUser.address?.zipCode;

  const mapAreas = useMemo<MapArea[]>(
    () =>
      helperAreas.map(({ helper, position, source, radius }) => ({
        id: helper.id,
        center: position,
        radius,
        strokeColor: selectedHelper?.id === helper.id ? 'var(--map-helper-area-selected-stroke)' : 'var(--map-helper-area-stroke)',
        fillColor: 'var(--map-helper-area-fill)',
        onClick: () => setSelectedHelper(helper),
        content: `
        <div class="w-48 text-sm">
          <div class="font-bold">
            ${escapeHtml(helper.firstname)} ${escapeHtml(helper.surname)}
          </div>
          <div style="margin:4px 0;font-size:12px;color:#6b7280">
            PLZ ${escapeHtml(helper.address?.zipCode || 'N/A')}
          </div>
          <div style="font-size:12px;color:#6b7280">
            Standort: ${formatSource(source)}
          </div>
        </div>`,
      })),
    [helperAreas, selectedHelper?.id]
  );

  const mapMarkers = useMemo<MapMarker[]>(
    () => createCurrentUserMarker(currentUserAddress, currentUserArea.position ?? undefined),
    [currentUserAddress, currentUserArea.position]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-100 shadow-xl">
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Verfügbar" value={availableHelpers.length} isPrimary />
          <Stat label="Im Einsatz" value={activeAssignments.length} />
          <Stat label="Standort" value={`PLZ ${userZip || 'N/A'}`} />
        </div>

        <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg border border-neutral-700">
          <GoogleAreaMap center={mapCenter} areas={mapAreas} markers={mapMarkers} className="h-full w-full" />

          {!currentUserAddress && helperAreas.length === 0 && !loadingHelpers && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-neutral-900/70">
              <div className="rounded-lg border border-neutral-700 bg-neutral-900/95 px-4 py-3 text-sm text-neutral-300">
                Keine echten Standortdaten in der Datenbank gefunden.
              </div>
            </div>
          )}

          {loadingHelpers && 
          (
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-neutral-950/70">
              <div className="flex h-full items-center justify-center px-3 py-4 scale-[0.78] origin-center md:scale-[0.88]">
                <ShortPageLoadingState fullScreen={false} status="Die Karte ist gleich bereit!" />
              </div>
            </div>
          )
          }
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Legend color="var(--map-user-area-fill)" label="Ihr Personenmarker" />
          <Legend color="var(--map-helper-area-fill)" label="Helper-Bereiche" />
          <Legend color="var(--map-assignment-marker-color)" label="Aktive Einsätze" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Helper in Ihrer Nähe</h3>
        <p className="mb-4 text-sm text-neutral-600">Ihr eigener Standort kommt direkt aus Ihrer gespeicherten DB-Adresse. Ohne echte Daten wird nichts angezeigt.</p>

        <div className="space-y-3">
          {helpers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">Keine Helper verfügbar</div>
          ) : (
            helpers.map((helper) => {
              const helperAssignments = assignmentCounts[helper.id] || 0;
              const source = resolveUserCenter(helper).source;

              return (
                <div
                  key={helper.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedHelper?.id === helper.id ? 'border-neutral-900 bg-primary-50 shadow-sm' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedHelper(helper)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-neutral-900">{helper.firstname} {helper.surname}</h4>
                      {helperAssignments > 0 && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                          Aktiv
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>PLZ {helper.address?.zipCode || 'N/A'}</span></div>
                      <div className="flex items-center gap-1"><Navigation className="w-4 h-4" /><span>~{distanceByZip(userZip, helper.address?.zipCode)} km</span></div>
                      {helperAssignments > 0 && (
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{helperAssignments} Einsatz{helperAssignments > 1 ? 'e' : ''}</span></div>
                      )}
                      <span className="text-xs text-neutral-500">{formatSource(source)}</span>
                    </div>

                    {helper.skills && helper.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {helper.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded">{skill}</span>
                        ))}
                        {helper.skills.length > 3 && <span className="px-2 py-0.5 text-neutral-600 text-xs">+{helper.skills.length - 3}</span>}
                      </div>
                    )}
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
