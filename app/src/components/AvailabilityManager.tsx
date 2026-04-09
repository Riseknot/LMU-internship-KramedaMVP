import React, { useEffect, useState } from 'react';
import { AvailabilitySlot } from '../types';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface AvailabilityManagerProps {
  userId: string;
  slots?: AvailabilitySlot[];
  onSave: (slots: AvailabilitySlot[]) => void;
}

const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export function AvailabilityManager({ userId, slots, onSave }: AvailabilityManagerProps) {
  const [localSlots, setLocalSlots] = useState<AvailabilitySlot[]>(slots ?? []);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    setLocalSlots(slots ?? []);
  }, [slots]);

  const addSlot = () => {
    if (startTime >= endTime) {
      alert('Endzeit muss nach Startzeit liegen');
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      userId,
      dayOfWeek: selectedDay,
      startTime,
      endTime,
    };

    setLocalSlots([...localSlots, newSlot]);
  };

  const removeSlot = (id: string) => {
    setLocalSlots(localSlots.filter(slot => slot.id !== id));
  };

  const handleSave = () => {
    onSave(localSlots);
    alert('Verfügbarkeit gespeichert!');
  };

  const slotsByDay = DAYS.map((day, index) => ({
    day,
    dayIndex: index,
    slots: localSlots.filter(slot => slot.dayOfWeek === index),
  }));

  return (
    <div className="bg-white/85 rounded-xl border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold mb-2">Verfügbarkeit verwalten</h2>

      {/* Add new slot */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Neue Verfügbarkeit hinzufügen
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {DAYS.map((day, index) => (
              <option key={index} value={index}>{day}</option>
            ))}
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            onClick={addSlot}
            className="px-4 py-2 btn-base btn-primary rounded-lg font-semibold transition-colors"
          >
            Hinzufügen
          </button>
        </div>
      </div>

      {/* Week view */}
      <div className="space-y-3 mb-6">
        {slotsByDay.map(({ day, dayIndex, slots: daySlots }) => (
          <div key={dayIndex} className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2 font-medium text-sm">
              {day}
            </div>
            
            {daySlots.length > 0 ? (
              <div className="p-3 space-y-2">
                {daySlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-2 bg-primary-50 rounded border border-primary-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary-600" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <button
                      onClick={() => removeSlot(slot.id)}
                      className="p-1 hover:bg-error/10 rounded transition-colors"
                      aria-label="Entfernen"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-neutral-500">
                Keine Verfügbarkeit
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 btn-base btn-secondary rounded-lg font-semibold transition-colors"
      >
        Verfügbarkeit speichern
      </button>
    </div>
  );
}


