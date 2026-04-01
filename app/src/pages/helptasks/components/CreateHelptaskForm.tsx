import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, CheckCircle, CheckCircle2, Clock3, FileText, MapPin, Plus, Send, Wrench } from 'lucide-react';
import { AvailabilitySlot, User } from '../../../types';
import { CreateHelptaskFormData } from '../types';

interface CreateHelptaskFormProps {
  coordinatorId: string;
  coordinatorName: string;
  helpers: User[];
  availabilitySlots: AvailabilitySlot[];
  onCreate: (data: CreateHelptaskFormData) => void;
}

type ProgressStepKey = 'address' | 'window' | 'details' | 'skills' | 'publish';

const initialFormState: CreateHelptaskFormData = {
  title: '',
  description: '',
  zipCode: '',
  city: '',
  street: '',
  streetNumber: '',
  start: '',
  end: '',
  requiredSkills: [],
};

export function CreateHelptaskForm({
  coordinatorId,
  coordinatorName,
  helpers,
  availabilitySlots,
  onCreate,
}: CreateHelptaskFormProps) {
  const [formData, setFormData] = useState<CreateHelptaskFormData>(initialFormState);
  const [skillInput, setSkillInput] = useState('');
  const [activeStep, setActiveStep] = useState<ProgressStepKey>('address');

  const addressSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const publishSectionRef = useRef<HTMLDivElement>(null);

  const hasValidWindow = !formData.start || !formData.end || formData.start < formData.end;
  const hasAddress = Boolean(formData.zipCode.trim());
  const hasDetails = Boolean(formData.title.trim() && formData.description.trim());
  const hasSchedule = Boolean(formData.start && formData.end && hasValidWindow);

  const estimatedDurationHours = useMemo(() => {
    if (!formData.start || !formData.end) return null;
    const start = new Date(formData.start);
    const end = new Date(formData.end);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (Number.isNaN(diff) || diff <= 0) return null;
    return diff;
  }, [formData.start, formData.end]);



  const progressStops = useMemo(
    () => [
      { key: 'address' as ProgressStepKey, label: 'Adresse', icon: MapPin, done: hasAddress },
      { key: 'window' as ProgressStepKey, label: 'Zeitfenster', icon: Clock3, done: hasSchedule },
      { key: 'details' as ProgressStepKey, label: 'Leistungsdetails', icon: FileText, done: hasDetails },
      { key: 'skills' as ProgressStepKey, label: 'Skills', icon: Wrench, done: formData.requiredSkills.length > 0 },
      { key: 'publish' as ProgressStepKey, label: 'Veroeffentlichen', icon: Send, done: hasAddress && hasDetails && hasSchedule },
    ],
    [formData.requiredSkills.length, hasAddress, hasDetails, hasSchedule]
  );

  const completedSteps = progressStops.filter(({ done }) => done).length;

  const timeWindowPreview = useMemo(() => {
    if (!formData.start || !formData.end || !hasValidWindow) {
      return { offset: 0, width: 0, startHour: null as number | null, endHour: null as number | null };
    }
    const start = new Date(formData.start);
    const end = new Date(formData.end);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const offset = Math.max(0, Math.min(100, (startHour / 24) * 100));
    const width = Math.max(2, Math.min(100 - offset, ((endHour - startHour) / 24) * 100));
    return { offset, width, startHour, endHour };
  }, [formData.start, formData.end, hasValidWindow]);

  const canSubmit = hasAddress && hasDetails && hasSchedule;

  const stepRefs: Record<ProgressStepKey, React.RefObject<HTMLDivElement | null>> = {
    address: addressSectionRef,
    window: addressSectionRef,
    details: detailsSectionRef,
    skills: skillsSectionRef,
    publish: publishSectionRef,
  };

  const jumpToStep = (step: ProgressStepKey) => {
    setActiveStep(step);
    stepRefs[step].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const updateField = <K extends keyof CreateHelptaskFormData>(
    field: K,
    value: CreateHelptaskFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    const normalized = skillInput.trim();
    if (!normalized) return;
    if (formData.requiredSkills.includes(normalized)) {
      setSkillInput('');
      return;
    }
    updateField('requiredSkills', [...formData.requiredSkills, normalized]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    updateField(
      'requiredSkills',
      formData.requiredSkills.filter((item) => item !== skill),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onCreate(formData);
    setFormData(initialFormState);
    setSkillInput('');
  };

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-4 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">Hilfeleistung erstellen</h2>
          <p className="text-sm text-neutral-600">Koordinator: {coordinatorName}</p>
        </div>
      </motion.div>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {['Ort & Zeit', 'Details', 'Skills & Publish'].map((label, index) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Schritt {index + 1}</p>
            <p className="text-sm font-medium text-neutral-800">{label}</p>
          </div>
        ))}
      </div>

      <div className="z-20 mb-4 rounded-xl border border-neutral-200 bg-neutral-50/95 p-3 md:sticky md:top-3 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-900">Fortschritt</p>
          <p className="text-xs font-medium text-neutral-500">{completedSteps}/{progressStops.length} Schritte</p>
        </div>

        <div className="relative mb-3 h-1.5 rounded-full bg-neutral-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps / progressStops.length) * 100}%` }}
            transition={{ duration: 0.35 }}
            className="h-1.5 rounded-full bg-secondary-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {progressStops.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.key;

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => jumpToStep(step.key)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? 'border-primary-300 bg-primary-100 text-primary-800'
                    :
                  step.done
                    ? 'border-secondary-300 bg-secondary-50 text-secondary-800'
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
                aria-label={`Gehe zu ${step.label}`}
              >
                {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr,0.75fr]">
          <div className="space-y-4">
            <motion.div
              ref={addressSectionRef}
              onFocusCapture={() => setActiveStep('address')}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.05 }}
              className={`rounded-xl border bg-white p-4 transition-colors ${
                activeStep === 'address' || activeStep === 'window'
                  ? 'border-primary-300 ring-2 ring-primary-100'
                  : 'border-neutral-200'
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Schritt 1: Ort und Einsatzfenster</h3>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-neutral-700">PLZ</span>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    placeholder="10115"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-neutral-700">Stadt</span>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    placeholder="Berlin"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-neutral-700">Strasse</span>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => updateField('street', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    placeholder="Musterstrasse"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-neutral-700">Hausnummer</span>
                  <input
                    type="text"
                    value={formData.streetNumber}
                    onChange={(e) => updateField('streetNumber', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    placeholder="12A"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-neutral-700">Start</span>
                  <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => updateField('start', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-neutral-700">Ende</span>
                  <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => updateField('end', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    required
                  />
                </label>
              </div>

              {!hasValidWindow && (
                <p className="mt-3 text-sm font-medium text-error">Ende muss nach Start liegen.</p>
              )}
            </motion.div>

            <motion.div
              ref={detailsSectionRef}
              onFocusCapture={() => setActiveStep('details')}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.11 }}
              className={`rounded-xl border bg-white p-4 transition-colors ${
                activeStep === 'details'
                  ? 'border-primary-300 ring-2 ring-primary-100'
                  : 'border-neutral-200'
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Schritt 2: Leistungsdetails</h3>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm md:col-span-2">
                  <span className="font-medium text-neutral-700">Titel</span>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    placeholder="z. B. Unterstuetzung am Vormittag"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm md:col-span-2">
                  <span className="font-medium text-neutral-700">Beschreibung</span>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    rows={4}
                    placeholder="Was wird benoetigt?"
                    required
                  />
                </label>
              </div>
            </motion.div>

            <motion.div
              ref={skillsSectionRef}
              onFocusCapture={() => setActiveStep('skills')}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.18 }}
              className={`rounded-xl border bg-white p-4 transition-colors ${
                activeStep === 'skills'
                  ? 'border-primary-300 ring-2 ring-primary-100'
                  : 'border-neutral-200'
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Schritt 3: Fahigkeiten</h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                  placeholder="z. B. Mobilitaet"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-base btn-ghost px-4 py-2.5"
                >
                  Hinzufugen
                </button>
              </div>

              {formData.requiredSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="btn-base rounded-full border border-primary-200 bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200"
                    >
                      {skill} x
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <aside
            ref={publishSectionRef}
            onFocusCapture={() => setActiveStep('publish')}
            className="space-y-3 xl:sticky xl:top-24 xl:self-start"
          >
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <h3 className="text-lg font-semibold text-neutral-900">Dein Hilfsauftrag</h3>
              <div className="mt-3 space-y-2 text-sm text-neutral-600">
                <p><span className="font-medium text-neutral-900">Titel:</span> {formData.title || '-'}</p>
                <p><span className="font-medium text-neutral-900">Beschreibung:</span> {formData.description || '-'}</p>
                <p><span className="font-medium text-neutral-900">Ort:</span> {formData.zipCode || '-'} {formData.city || ''}</p>
                <p><span className="font-medium text-neutral-900">Skills:</span> {formData.requiredSkills.length}</p>
              </div>

              <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-3 text-sm">
                <p className="mb-1 flex items-center gap-2 font-medium text-neutral-900">
                  <Clock3 className="h-4 w-4 text-secondary-600" />
                  Einsatzdauer
                </p>
                <p className="text-neutral-600">
                  {estimatedDurationHours ? `${estimatedDurationHours.toFixed(1)} Stunden` : 'Noch nicht berechenbar'}
                </p>
              </div>

             

              <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-3 text-sm">
                <p className="mb-2 font-medium text-neutral-900">Dein Auftrag ist zwischen...</p>
                <div className="relative h-3 rounded-full bg-neutral-200">
                  <AnimatePresence>
                    {timeWindowPreview.width > 0 && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: `${timeWindowPreview.width}%` }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute top-0 h-3 rounded-full bg-primary-500"
                        style={{ left: `${timeWindowPreview.offset}%` }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-neutral-500">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>24:00</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm text-primary-800">
                <p className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  Nach dem Erstellen wird die Hilfeleistung sofort verfugbar.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-base btn-primary w-full rounded-xl px-4 py-3 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hilfeleistung veroffentlichen
            </button>

            <p className="text-xs text-neutral-500">ID: {coordinatorId}</p>
          </aside>
        </div>
      </form>
    </section>
  );
}
