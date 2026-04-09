import React from 'react';
import { User, Assignment, AvailabilitySlot, HelperScore } from '../types';
import { findBestHelpers } from '../services/matchingService';
import { MapPin, Star, Calendar, Award, TrendingUp } from 'lucide-react';

interface HelperRecommendationsProps {
  assignment: Assignment;
  helpers: User[];
  availabilitySlots: AvailabilitySlot[];
  onAssignHelper: (assignmentId: string, helperId: string) => void;
}

export function HelperRecommendations({
  assignment,
  helpers,
  availabilitySlots,
  onAssignHelper,
}: HelperRecommendationsProps) {
  const recommendations = findBestHelpers(assignment, helpers, availabilitySlots);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-neutral-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-neutral-100';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Empfohlene Helper</h3>
          <p className="text-sm text-neutral-600">
            Basierend auf Verfügbarkeit, Skills und Nähe
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-500">Keine passenden Helper gefunden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const helper = helpers.find(h => h.id === rec.helperId);
            if (!helper) return null;

            return (
              <div
                key={rec.helperId}
                className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Helper Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">{rec.helperName}</h4>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <MapPin className="w-4 h-4" />
                          <span>{helper.address?.zipCode || 'Keine PLZ'}</span>
                          <span className="text-neutral-400">•</span>
                          <span>~{rec.distance} km entfernt</span>
                        </div>
                      </div>
                      
                      {/* Overall Score */}
                      <div className={`px-3 py-1.5 rounded-lg ${getScoreBgColor(rec.score)}`}>
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${getScoreColor(rec.score)}`} />
                          <span className={`font-semibold ${getScoreColor(rec.score)}`}>
                            {rec.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-600" />
                        <div className="flex-1">
                          <p className="text-xs text-neutral-600">Verfügbarkeit</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${rec.availabilityMatch}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-neutral-700">
                              {rec.availabilityMatch}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent-600" />
                        <div className="flex-1">
                          <p className="text-xs text-neutral-600">Skills</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-600 rounded-full"
                                style={{ width: `${rec.skillMatch}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-neutral-700">
                              {rec.skillMatch}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    {helper.skills && helper.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {helper.skills.map(skill => {
                            const isRequired = assignment.requiredSkills.includes(skill);
                            return (
                              <span
                                key={skill}
                                className={`px-2 py-1 rounded text-xs ${
                                  isRequired
                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Assign Button */}
                    <button
                      onClick={() => onAssignHelper(assignment.id, rec.helperId)}
                      className="w-full px-4 py-2.5 btn-base btn-secondary rounded-lg font-medium transition-colors"
                    >
                      Helper zuweisen
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matching Info */}
      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
        <h4 className="font-semibold text-neutral-900 mb-2 text-sm">Wie funktioniert das Matching?</h4>
        <ul className="space-y-1 text-xs text-neutral-600">
          <li>• <strong>Verfügbarkeit:</strong> Übereinstimmung mit Wochentag und Uhrzeit</li>
          <li>• <strong>Skills:</strong> Prozentsatz der erforderlichen Fähigkeiten</li>
          <li>• <strong>Entfernung:</strong> Basierend auf PLZ-Differenz (ca. 10 km pro Ziffer)</li>
          <li>• <strong>Gesamtscore:</strong> Gewichtete Kombination aller Faktoren</li>
        </ul>
      </div>
    </div>
  );
}


