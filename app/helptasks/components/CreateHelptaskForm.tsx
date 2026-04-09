import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, CheckCircle, CheckCircle2, Clock3, FileText, MapPin, Plus, Send, Wrench } from 'lucide-react';
import { AvailabilitySlot, User } from '../../src/types';
import { COMMON_LANGUAGE_SUGGESTIONS, QUALIFICATION_GROUPS, QUALIFICATION_LABELS, QualificationKey } from '../../src/utils/qualifications';
import { CreateHelptaskFormData } from '../types';

interface CreateHelptaskFormProps {
  coordinatorId: string;
  coordinatorName: string;
  helpers: User[];
  availabilitySlots: AvailabilitySlot[];
  onCreate: (data: CreateHelptaskFormData) => void;
}

type ProgressStepKey = 'address' | 'window' | 'details' | 'skills' | 'publish';
type AddressInput = Pick<CreateHelptaskFormData, 'street' | 'streetNumber' | 'zipCode' | 'city'>;
type NominatimSearchResult = { place_id: number };

const initialFormState: CreateHelptaskFormData = {
  title: '',
  description: '',
  zipCode: '',
  city: '',
  street: '',
  streetNumber: '',
  start: '',
  end: '',
  requirements: {
    skills: [],
    languages: [],
    notes: '',
  },
};

export function CreateHelptaskForm({
  coordinatorId,
  coordinatorName,
  helpers,
  availabilitySlots,
  onCreate,
}: CreateHelptaskFormProps) {
  const [formData, setFormData] = useState<CreateHelptaskFormData>(initialFormState);
  const [languageInput, setLanguageInput] = useState('');
  const [activeStep, setActiveStep] = useState<ProgressStepKey>('address');

  const requirements = formData.requirements;

  const addressSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const publishSectionRef = useRef<HTMLDivElement>(null);

  const hasValidWindow = !formData.start || !formData.end || formData.start < formData.end;
  const hasAddress = Boolean(
    formData.zipCode.trim() &&
    formData.city.trim() &&
    formData.street.trim() &&
    formData.streetNumber.trim()
  );
  const hasDetails = Boolean(formData.title.trim() && formData.description.trim());
  const hasSchedule = Boolean(formData.start && formData.end && hasValidWindow);
  const hasSkills = requirements.skills.length > 0;
  const showsQualificationNotes =
    requirements.skills.includes('spezielle_zertifikate') ||
    requirements.skills.includes('andere');

  const estimatedDurationHours = useMemo(() => {
    if (!formData.start || !formData.end) return null;
    const start = new Date(formData.start);
    const end = new Date(formData.end);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (Number.isNaN(diff) || diff <= 0) return null;
    return diff;
  }, [formData.start, formData.end]);

  async function validateAddress({
    street,
    streetNumber,
    zipCode,
    city,
  }: AddressInput): Promise<boolean> {
    const normalizedStreet = street.trim();
    const normalizedStreetNumber = streetNumber.trim();
    const normalizedZipCode = zipCode.trim();
    const normalizedCity = city.trim();

    if (!normalizedStreet || !normalizedStreetNumber || !normalizedZipCode || !normalizedCity) {
      return false;
    }

    const params = new URLSearchParams({
      street: `${normalizedStreet} ${normalizedStreetNumber}`.trim(),
      postalcode: normalizedZipCode,
      city: normalizedCity,
      country: 'Deutschland',
      format: 'jsonv2',
      limit: '1',
      addressdetails: '1',
    });

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Address validation failed:', res.status, res.statusText);
        return false;
      }

      const data = (await res.json()) as NominatimSearchResult[];
      return data.length > 0;
    } catch (error) {
      console.error('Address validation failed:', error);
      return false;
    }
  }

  const progressStops = useMemo(
    () => [
      { key: 'address' as ProgressStepKey, label: 'Ort', icon: MapPin, done: hasAddress },
      { key: 'window' as ProgressStepKey, label: 'Zeit', icon: Clock3, done: hasSchedule },
      { key: 'details' as ProgressStepKey, label: 'Beschreibung', icon: FileText, done: hasDetails },
      { key: 'skills' as ProgressStepKey, label: 'Qualifikationen', icon: Wrench, done: hasSkills },
      { key: 'publish' as ProgressStepKey, label: 'Hochladen', icon: Send, done: hasAddress && hasDetails && hasSchedule && hasSkills },
    ],
    [hasAddress, hasDetails, hasSchedule, hasSkills]
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

  const canSubmit = hasAddress && hasDetails && hasSchedule && hasSkills;

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

  const updateRequirements = (updates: Partial<CreateHelptaskFormData['requirements']>) => {
    setFormData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, ...updates },
    }));
  };

  const toggleSkill = (skill: QualificationKey) => {
    const nextSkills = requirements.skills.includes(skill)
      ? requirements.skills.filter((item) => item !== skill)
      : [...requirements.skills, skill];

    const stillNeedsNote =
      nextSkills.includes('spezielle_zertifikate') || nextSkills.includes('andere');

    updateRequirements({
      skills: nextSkills,
      notes: stillNeedsNote ? requirements.notes : '',
    });
  };

  const removeSkill = (skill: QualificationKey) => {
    toggleSkill(skill);
  };

  const clearSkills = () => {
    updateRequirements({ skills: [], languages: [], notes: '' });
    setLanguageInput('');
  };

  const addLanguages = (value: string) => {
    const nextLanguages = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (nextLanguages.length === 0) return;

    updateRequirements({
      languages: Array.from(new Set([...requirements.languages, ...nextLanguages])),
    });
    setLanguageInput('');
  };

  const removeLanguage = (language: string) => {
    updateRequirements({
      languages: requirements.languages.filter((item) => item !== language),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const isValid = await validateAddress(formData);
    if (!isValid) {
      alert("Adresse existiert nicht!");
      return;
    }

    onCreate(formData);
    setFormData(initialFormState);
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
        {['Ort & Zeit', 'Beschreibung', 'Qualifikationen & Hochladen'].map((label, index) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Schritt {index + 1}</p>
            <p className="text-sm font-medium text-neutral-800">{label}</p>
          </div>
        ))}
      </div>

      <div className="sticky top-3 z-20 mb-4 rounded-xl border border-neutral-400 bg-neutral-50/95 p-3 md:sticky md:top-3 shadow backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-900">Fortschritt</p>
          <p className="text-xs font-medium">{completedSteps}/{progressStops.length} Schritte</p>
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
                className={`btn-base inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? step.done ? 'bg-emerald-800 text-white' : 'btn-primary text-white'
                    : step.done
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                      : 'btn-ghost'
                } ${!isActive && !step.done ? 'opacity-80' : ''}`}
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
                <h3 className="text-lg font-semibold text-neutral-900">Schritt 1: Ort und Zeit</h3>
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
                    placeholder="München"
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
              <div className="mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Schritt 3: Anforderungen & Qualifikationen</h3>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-neutral-900">Wähle nur das, was wirklich benötigt wird.</p>
                  <p className="text-xs text-neutral-600">Mehrfachauswahl ist möglich. Mindestens eine Auswahl ist erforderlich.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    hasSkills ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {requirements.skills.length} ausgewählt
                  </span>
                  {hasSkills && (
                    <button
                      type="button"
                      onClick={clearSkills}
                      className="btn-base btn-ghost rounded-full px-3 py-1 text-xs"
                    >
                      Zurücksetzen
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {QUALIFICATION_GROUPS.map((group) => (
                  <fieldset key={group.id} className="rounded-xl border border-neutral-200 bg-white p-3">
                    <legend className="px-1 text-sm font-semibold text-neutral-900">{group.title}</legend>
                    <p className="mb-3 text-xs text-neutral-600">{group.description}</p>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {group.options.map((option) => {
                        const isChecked = requirements.skills.includes(option.value);

                        return (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                              isChecked
                                ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-100'
                                : 'border-neutral-200 bg-neutral-50 hover:border-primary-200 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSkill(option.value)}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
                            />
                            <span className="font-medium text-neutral-900">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

              {showsQualificationNotes && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                  <label className="space-y-1 text-sm">
                    <span className="font-medium text-neutral-900">Bitte kurz konkretisieren <span className="text-neutral-500">(optional)</span></span>
                    <textarea
                      value={requirements.notes}
                      onChange={(e) => updateRequirements({ notes: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                      rows={3}
                      placeholder="z. B. Wundversorgung, Kinaesthetics, Erfahrung mit Rollstuhltransfer"
                    />
                  </label>
                </div>
              )}

              <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <div className="mb-3">
                  <p className="text-sm font-medium text-neutral-900">Konkrete Sprachen <span className="text-neutral-500">(optional)</span></p>
                  <p className="text-xs text-neutral-600">Hilfreich für besseres Matching, wenn Kommunikation im Einsatz wichtig ist.</p>
                </div>

                <div className="mb-2 flex flex-wrap gap-2">
                  {COMMON_LANGUAGE_SUGGESTIONS.map((language) => {
                    const isSelected = requirements.languages.includes(language);

                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() => addLanguages(language)}
                        className={`btn-base rounded-full px-3 py-1 text-xs ${
                          isSelected
                            ? 'border border-primary-200 bg-primary-100 text-primary-800'
                            : 'btn-ghost'
                        }`}
                      >
                        + {language}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguages(languageInput);
                      }
                    }}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-primary-500 focus:outline-none"
                    placeholder="z. B. Italienisch, Französisch"
                  />
                  <button
                    type="button"
                    onClick={() => addLanguages(languageInput)}
                    className="btn-base btn-ghost px-4 py-2.5"
                  >
                    Hinzufügen
                  </button>
                </div>

                {requirements.languages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {requirements.languages.map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="btn-base rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800 hover:bg-primary-100"
                        aria-label={`${language} entfernen`}
                      >
                        {language} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Ausgewählte Anforderungen</p>
                {hasSkills ? (
                  <div className="flex flex-wrap gap-2">
                    {requirements.skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="btn-base rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                        aria-label={`${QUALIFICATION_LABELS[skill]} entfernen`}
                      >
                        {QUALIFICATION_LABELS[skill]} ×
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">Noch nichts ausgewählt – setze Häkchen bei den wirklich relevanten Anforderungen.</p>
                )}

                {requirements.languages.length > 0 && (
                  <p className="mt-3 text-sm text-neutral-700">
                    <span className="font-medium text-neutral-900">Sprachen:</span> {requirements.languages.join(', ')}
                  </p>
                )}

                {requirements.notes.trim() && (
                  <p className="mt-2 text-sm text-neutral-700">
                    <span className="font-medium text-neutral-900">Hinweis:</span> {requirements.notes}
                  </p>
                )}
              </div>
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
                <p><span className="font-medium text-neutral-900">Qualifikationen:</span> {requirements.skills.length}</p>
                {requirements.languages.length > 0 && (
                  <p><span className="font-medium text-neutral-900">Sprachen:</span> {requirements.languages.join(', ')}</p>
                )}
                {requirements.notes.trim() && (
                  <p><span className="font-medium text-neutral-900">Hinweis:</span> {requirements.notes}</p>
                )}
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
