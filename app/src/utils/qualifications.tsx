export const FORMAL_QUALIFICATION_KEYS = [
  "führerschein_b",
  "erste_hilfe_kurs",
  "führungszeugnis",
  "erweitertes_führungszeugnis",
  "pflegekurs",
  "spezielle_zertifikate",
] as const;

export const EXPERIENCE_QUALIFICATION_KEYS = [
  "grundpflege",
  "demenz_begleitung",
  "mobilitätsbegleitung",
  "haushaltshilfe",
  "kochen_und_ernährung",
  "andere",
] as const;

export const META_REQUIREMENT_KEYS = [
  "fortgeschrittenes_deutsch",
  "eigenes_auto",
  "zeitlich_flexibel",
  "kurzfristig_verfügbar",
  "dauerhafte_verfügbarkeit",
] as const;

export const QUALIFICATION_KEYS = [
  ...FORMAL_QUALIFICATION_KEYS,
  ...EXPERIENCE_QUALIFICATION_KEYS,
  ...META_REQUIREMENT_KEYS,
] as const;

export type QualificationKey = typeof QUALIFICATION_KEYS[number];
export type QualificationGroup = "formal" | "experience" | "meta";

export const COMMON_LANGUAGE_SUGGESTIONS = [
  "Deutsch",
  "Englisch",
  "Türkisch",
  "Arabisch",
  "Polnisch",
  "Ukrainisch",
] as const;

export const QUALIFICATION_LABELS: Record<QualificationKey, string> = {
  führerschein_b: "Führerschein Klasse B",
  erste_hilfe_kurs: "Erste-Hilfe-Kurs",
  führungszeugnis: "Führungszeugnis",
  erweitertes_führungszeugnis: "Erweitertes Führungszeugnis",
  pflegekurs: "Pflegekurs / Betreuungskurs",
  spezielle_zertifikate: "Spezielle Zertifikate oder Qualifikationen",
  grundpflege: "Grundpflege-Erfahrung",
  demenz_begleitung: "Erfahrung in der Demenzbegleitung",
  mobilitätsbegleitung: "Mobilitäts- und Wegbegleitung",
  haushaltshilfe: "Haushaltshilfe",
  kochen_und_ernährung: "Kochen und Ernährung",
  andere: "Andere relevante Qualifikationen",
  fortgeschrittenes_deutsch: "Höheres Deutschniveau",
  eigenes_auto: "Eigenes Auto / mobil im Einsatz",
  zeitlich_flexibel: "Zeitlich flexibel",
  kurzfristig_verfügbar: "Kurzfristig verfügbar",
  dauerhafte_verfügbarkeit: "Dauerhafte Verfügbarkeit",
};

export const QUALIFICATION_GROUP_LABELS: Record<QualificationGroup, string> = {
  formal: "Formale Qualifikationen",
  experience: "Fähigkeiten & Erfahrungen",
  meta: "Meta / Rahmenbedingungen",
};

export const QUALIFICATION_OPTIONS: Array<{ value: QualificationKey; label: string }> =
  QUALIFICATION_KEYS.map((key) => ({
    value: key,
    label: QUALIFICATION_LABELS[key],
  }));

export const QUALIFICATION_GROUPS: Array<{
  id: QualificationGroup;
  title: string;
  description: string;
  options: Array<{ value: QualificationKey; label: string }>;
}> = [
  {
    id: "formal",
    title: QUALIFICATION_GROUP_LABELS.formal,
    description: "Nachweise, Kurse und überprüfbare Voraussetzungen.",
    options: FORMAL_QUALIFICATION_KEYS.map((key) => ({ value: key, label: QUALIFICATION_LABELS[key] })),
  },
  {
    id: "experience",
    title: QUALIFICATION_GROUP_LABELS.experience,
    description: "Praktische Erfahrung und konkrete Unterstützungsfelder.",
    options: EXPERIENCE_QUALIFICATION_KEYS.map((key) => ({ value: key, label: QUALIFICATION_LABELS[key] })),
  },
  {
    id: "meta",
    title: QUALIFICATION_GROUP_LABELS.meta,
    description: "Rahmenbedingungen, die für intelligentes Matching wichtig sind.",
    options: META_REQUIREMENT_KEYS.map((key) => ({ value: key, label: QUALIFICATION_LABELS[key] })),
  },
];
