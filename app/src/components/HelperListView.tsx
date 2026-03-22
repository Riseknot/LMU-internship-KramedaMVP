import React, { useState } from 'react';
import { User, Assignment } from '../types';
import { MapPin, Star, CheckCircle, MessageCircle, Send, Shield, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelperListViewProps {
  helpers: User[];
  currentUser: User;
  onSendMessage?: (helperId: string) => void;
  onProposeAssignment?: (helperId: string) => void;
}

export function HelperListView({ 
  helpers, 
  currentUser,
  onSendMessage,
  onProposeAssignment 
}: HelperListViewProps) {
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const getDistanceLabel = (helperZip?: string) => {
    if (!helperZip || !currentUser.zipCode) return 'Unbekannt';
    const distance = Math.abs(parseInt(helperZip) - parseInt(currentUser.zipCode));
    if (distance < 10) return '< 5 km';
    if (distance < 50) return '5-10 km';
    if (distance < 100) return '10-20 km';
    return '> 20 km';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">
          Verfügbare Helper ({helpers.length})
        </h2>
      </div>

      {helpers.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-neutral-500">Keine Helper verfügbar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {helpers.map((helper) => {
            const verifiedCerts = helper.certifications?.filter(c => c.verified).length || 0;
            const gamification = helper.gamification;

            return (
              <motion.div
                key={helper.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-neutral-200 hover:border-primary-300 transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold relative">
                        {helper.avatarUrl ? (
                          <img 
                            src={helper.avatarUrl} 
                            alt={helper.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          helper.name.split(' ').map(n => n[0]).join('')
                        )}
                        {verifiedCerts > 0 && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 flex items-center gap-2">
                            {helper.name}
                            {gamification && gamification.level >= 5 && (
                              <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Level {gamification.level}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {helper.bio || 'Erfahrener Pflege-Helper'}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {helper.zipCode && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                            <MapPin className="w-3 h-3" />
                            {helper.zipCode} · {getDistanceLabel(helper.zipCode)}
                          </span>
                        )}
                        {verifiedCerts > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <Shield className="w-3 h-3" />
                            {verifiedCerts} {verifiedCerts === 1 ? 'Zertifikat' : 'Zertifikate'}
                          </span>
                        )}
                        {gamification && gamification.completedAssignments > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <Star className="w-3 h-3" />
                            {gamification.completedAssignments} Aufträge
                          </span>
                        )}
                      </div>

                      {/* Skills */}
                      {helper.skills && helper.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {helper.skills.slice(0, 4).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {helper.skills.length > 4 && (
                            <span className="px-2 py-0.5 text-neutral-500 text-xs">
                              +{helper.skills.length - 4} weitere
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {currentUser.role === 'coordinator' && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => onSendMessage?.(helper.id)}
                            className="flex-1 sm:flex-none px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Nachricht
                          </button>
                          <button
                            onClick={() => onProposeAssignment?.(helper.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Auftrag vorschlagen
                          </button>
                        </div>
                      )}

                      {/* Expand for more details */}
                      <button
                        onClick={() => setSelectedHelper(
                          selectedHelper === helper.id ? null : helper.id
                        )}
                        className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {selectedHelper === helper.id ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedHelper === helper.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-neutral-200 space-y-3"
                      >
                        {/* Contact */}
                        <div>
                          <h4 className="font-medium text-sm text-neutral-900 mb-2">Kontakt</h4>
                          <div className="space-y-1 text-sm text-neutral-600">
                            <p>📧 {helper.email}</p>
                            {helper.phone && <p>📱 {helper.phone}</p>}
                          </div>
                        </div>

                        {/* Certifications */}
                        {helper.certifications && helper.certifications.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm text-neutral-900 mb-2">Zertifizierungen</h4>
                            <div className="space-y-1">
                              {helper.certifications.map((cert) => (
                                <div 
                                  key={cert.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  {cert.verified ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                                  )}
                                  <span className={cert.verified ? 'text-neutral-900' : 'text-neutral-500'}>
                                    {cert.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* All Skills */}
                        {helper.skills && helper.skills.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm text-neutral-900 mb-2">Alle Fähigkeiten</h4>
                            <div className="flex flex-wrap gap-1">
                              {helper.skills.map((skill, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
