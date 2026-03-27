import React, { useState } from 'react';
import { User, Assignment, AvailabilitySlot } from '../types';
import { findBestHelpers } from '../services/matchingService';
import { Plus, MapPin, Clock, Award } from 'lucide-react';

// Props für das CreateAssignmentForm
/*
- PLZ
- Zeiten: Start- und Endzeit
- Fähigkeiten (Checkboxen oder Tags)
- Empfehlungen anzeigen und direkt anschreiben
- Titel und Beschreibung
- Image als Titelbild (optional, könnte später hinzugefügt werden)
- Nach Erstellung: Empfehlungen anzeigen mit Score, Entfernung, Skill-Match, Verfügbarkeits-Match

 */ 


interface CreateAssignmentFormProps {
  coordinatorId: string;
  coordinatorName: string;
  helpers: User[];
  availabilitySlots: AvailabilitySlot[];
  onCreate: (assignment: Assignment) => void;
}

export function CreateAssignmentForm({ 
  coordinatorId,
  coordinatorName,
  helpers,
  availabilitySlots,
  onCreate 
}: CreateAssignmentFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const allSkills = ['Körperpflege', 'Mobilität', 'Medikamentengabe', 'Haushalt', 'Begleitung', 'Kochen', 'Einkaufen'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title,
      description,
      coordinatorId,
      coordinatorName,
      status: 'OPEN',
      startTime,
      endTime,
      zipCode,
      requiredSkills,
      createdAt: new Date().toISOString(),
    };

    onCreate(newAssignment);
    setShowRecommendations(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setZipCode('');
    setStartTime('');
    setEndTime('');
    setRequiredSkills([]);
    setShowForm(false);
    setShowRecommendations(false);
  };

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Generate recommendations if form is complete
  const canShowRecommendations = zipCode && startTime && endTime;
  let recommendations: any[] = [];
  
  if (canShowRecommendations) {
    const tempAssignment: Assignment = {
      id: 'temp',
      title: '',
      description: '',
      coordinatorId,
      coordinatorName,
      status: 'OPEN',
      startTime,
      endTime,
      zipCode,
      requiredSkills,
      createdAt: new Date().toISOString(),
    };
      
    recommendations = findBestHelpers(tempAssignment, helpers, availabilitySlots);
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 m-12">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Neuen Auftrag erstellen
        </button>
      ) : (
        <div>
          <h3 className="font-semibold mb-4">Neuer Auftrag</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Beschreibung</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">PLZ</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Startzeit</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Endzeit</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Erforderliche Fähigkeiten</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      requiredSkills.includes(skill)
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="border border-accent-200 bg-accent-50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-600" />
                  Empfohlene Helfer
                </h4>
                <div className="space-y-2">
                  {recommendations.slice(0, 3).map(rec => (
                    <div key={rec.helperId} className="bg-white rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{rec.helperName}</span>
                        <span className="text-accent-600 font-bold">
                          Score: {rec.score}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-neutral-600">
                        <span>Entfernung: {rec.distance} km</span>
                        <span>Skills: {rec.skillMatch}%</span>
                        <span>Verfügbar: {rec.availabilityMatch}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Auftrag erstellen
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg font-medium transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}