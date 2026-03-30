import React from 'react';
import { GamificationData } from '../types';
import { Trophy, Star, Zap, Award, TrendingUp, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface GamificationPanelProps {
  gamification: GamificationData;
  userName: string;
}

export function GamificationPanel({ gamification, userName }: GamificationPanelProps) {
  const { level, points, badges, streak, completedAssignments } = gamification;
  
  // Berechne Punkte für nächstes Level
  const pointsForNextLevel = level * 500;
  const progressToNextLevel = (points % pointsForNextLevel) / pointsForNextLevel * 100;

  return (
    <div className="space-y-6">
      {/* Level und Fortschritt */}
      <div className="bg-linear-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-100 text-sm">Dein Level</p>
            <h3 className="text-4xl font-bold">Level {level}</h3>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
        </div>
        
        {/* Fortschrittsbalken */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-primary-100">Fortschritt</span>
            <span className="font-semibold">{points % pointsForNextLevel} / {pointsForNextLevel} XP</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-accent-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
          <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5 text-accent-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{points}</div>
          <div className="text-xs text-neutral-600">Punkte</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{streak}</div>
          <div className="text-xs text-neutral-600">Tage Streak</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
          <div className="w-10 h-10 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-success" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{completedAssignments}</div>
          <div className="text-xs text-neutral-600">Aufträge</div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-900">Errungenschaften</h3>
          <span className="ml-auto text-sm text-neutral-600">{badges.length} Badges</span>
        </div>

        {badges.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-4">
            Noch keine Badges verdient. Bleib dran!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-linear-to-br from-primary-50 to-accent-50 rounded-lg p-3 border border-primary-200 cursor-pointer"
                title={badge.description}
              >
                <div className="text-3xl mb-2 text-center">{badge.icon}</div>
                <p className="text-xs font-medium text-neutral-900 text-center line-clamp-2">
                  {badge.name}
                </p>
                <p className="text-xs text-neutral-500 text-center mt-1">
                  {new Date(badge.earnedAt).toLocaleDateString('de-DE', { 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Nächste Ziele */}
      <div className="bg-linear-to-r from-accent-50 to-primary-50 rounded-xl border border-accent-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent-600" />
          <h3 className="font-semibold text-neutral-900">Nächste Ziele</h3>
        </div>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full" />
            <span>Erreiche Level {level + 1} ({pointsForNextLevel - (points % pointsForNextLevel)} XP fehlen)</span>
          </li>
          {streak < 7 && (
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>7-Tage-Streak erreichen ({7 - streak} Tage verbleibend)</span>
            </li>
          )}
          {completedAssignments < 10 && (
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>10 Aufträge abschließen ({10 - completedAssignments} verbleibend)</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}


