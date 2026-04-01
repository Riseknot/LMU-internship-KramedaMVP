import { Certification, User } from "../../types";
import { CertificationManager } from "../../components/CertificationManager";
import { BriefcaseBusiness, Languages, LucideIcon, MapPin, Phone, Quote, ShieldCheck, Star, User as UserIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import EditField from "./components/EditField";

const STAR_COUNT = 5;

const DUMMY_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" fill="none">
    <rect width="260" height="260" rx="44" fill="#F3F4F6"/>
    <rect x="18" y="18" width="224" height="224" rx="36" fill="url(#bg)"/>
    <circle cx="130" cy="102" r="44" fill="#fff"/>
    <path d="M56 228c6-52 36-80 74-80s68 28 74 80" fill="#F1F5F9"/>
    <circle cx="112" cy="101" r="5" fill="#475569"/>
    <circle cx="148" cy="101" r="5" fill="#475569"/>
    <path d="M110 126c11 11 29 11 40 0" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
    <defs>
      <linearGradient id="bg" x1="30" y1="24" x2="224" y2="234" gradientUnits="userSpaceOnUse">
        <stop stop-color="#003D99"/>
        <stop offset="1" stop-color="#FF9900"/>
      </linearGradient>
    </defs>
  </svg>`
)}`;

type StatTileProps = {
  value: string | number;
  label: string;
};

function StatTile({ value, label }: StatTileProps) {
  return (
    <div>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
      <p className="text-[11px] text-neutral-500">{label}</p>
    </div>
  );
}

type ReviewCardProps = {
  name: string;
  text: string;
  period: string;
  theme: ReviewTheme;
  score: number;
  satisfaction: number;
  isVerified: boolean;
};

type ReviewTheme = "primary" | "accent" | "mixed";

type ProfileState = {
  firstname: string;
  surname: string;
  email: string;
  phone: string;
  zipCode: string;
  city: string;
  street: string;
  streetNumber: string;
  languages: string;
  bio: string;
  avatarUrl: string;
  skills: string;
};

type AboutField = {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  field?: keyof ProfileState;
  editable?: boolean;
  underline?: boolean;
  placeholder?: string;
  displayValue?: string;
};

const REVIEW_THEMES: Record<
  ReviewTheme,
  { card: string; line: string; orb: string; glow: string; badge: string; avatarRing: string; star: string }
> = {
  primary: {
    card: "border-primary-300/70 bg-linear-to-br from-primary-50 via-white to-primary-100/80",
    line: "from-primary-700 via-primary-500 to-primary-300",
    orb: "from-primary-400/55 to-primary-100/10",
    glow: "shadow-[0_14px_30px_rgba(0,82,204,0.18)]",
    badge: "bg-primary-700 text-white",
    avatarRing: "ring-primary-300/80",
    star: "text-primary-600",
  },
  accent: {
    card: "border-primary-300/70 bg-linear-to-br from-primary-50/95 via-white to-primary-100/80",
    line: "from-primary-800 via-primary-600 to-primary-400",
    orb: "from-primary-500/45 to-primary-100/10",
    glow: "shadow-[0_14px_30px_rgba(0,82,204,0.16)]",
    badge: "bg-primary-600 text-white",
    avatarRing: "ring-primary-300/80",
    star: "text-primary-700",
  },
  mixed: {
    card: "border-primary-300/65 bg-linear-to-br from-primary-50/95 via-white to-primary-100/70",
    line: "from-primary-700 via-primary-500 to-primary-300",
    orb: "from-primary-400/50 via-primary-300/30 to-primary-100/10",
    glow: "shadow-[0_14px_32px_rgba(24,88,180,0.17)]",
    badge: "bg-primary-700 text-white",
    avatarRing: "ring-primary-300/75",
    star: "text-primary-600",
  },
};

const REVIEWS: ReviewCardProps[] = [
  {
    name: "Anna",
    period: "Maerz 2026",
    theme: "primary",
    score: 4.9,
    satisfaction: 95,
    isVerified: true,
    text: "Super verlaesslich und freundlich. Kommunikation war klar und schnell.",
  },
  {
    name: "Michael",
    period: "Februar 2026",
    theme: "accent",
    score: 4.8,
    satisfaction: 92,
    isVerified: true,
    text: "Sehr hilfreich im Alltag, puenktlich und empathisch. Klare Empfehlung.",
  },
  {
    name: "Sara",
    period: "Januar 2026",
    theme: "mixed",
    score: 5.0,
    satisfaction: 97,
    isVerified: true,
    text: "Professionell und sehr angenehm. Wuerde jederzeit wieder buchen.",
  },
];

function ReviewCard({ name, text, period, theme, score, satisfaction, isVerified }: ReviewCardProps) {
  const themeStyle = REVIEW_THEMES[theme];
  const initials = name.slice(0, 1).toUpperCase();

  return (
    <article className={`relative overflow-hidden rounded-2xl border p-5 ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${themeStyle.card} ${themeStyle.glow}`}>
      <div className={`pointer-events-none absolute -top-8 -right-9 h-28 w-28 rounded-full bg-linear-to-br ${themeStyle.orb}`} />
      <div className={`mb-4 h-1.5 w-20 rounded-full bg-linear-to-r ${themeStyle.line}`} />
      <div className="pointer-events-none absolute right-3 bottom-3 text-neutral-300/80">
        <Quote className="h-4 w-4" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-white/90 text-sm font-bold text-primary-700 ring-2 ${themeStyle.avatarRing}`}>
            {initials}
            {isVerified && (
              <span className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 rounded-full border border-white bg-primary-600 p-0.5 text-white shadow-sm">
                <ShieldCheck className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{name}</p>
            <p className="text-xs text-neutral-500">{period}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-white/70 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 shadow-sm">
            {score.toFixed(1)} / 5
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${themeStyle.badge}`}>
            verifiziert
          </span>
        </div>
      </div>

      <div className={`mt-3 flex items-center gap-1 ${themeStyle.star}`}>
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
        <span className="ml-1 text-xs font-semibold text-neutral-600">Top bewertet</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-neutral-700">{text}</p>

      <div className="mt-4 rounded-xl border border-white/80 bg-white/70 p-2.5">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Zufriedenheit</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
          <div
            className={`h-full rounded-full bg-linear-to-r ${themeStyle.line}`}
            style={{ width: `${satisfaction}%` }}
          />
        </div>
      </div>
    </article>
  );
}

function parseCsvList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProfileState(userData: Partial<User>): ProfileState {
  const address = userData.address || {};
  return {
    firstname: userData.firstname || "",
    surname: userData.surname || "",
    email: userData.email || "",
    phone: userData.phone || "",
    zipCode: address.zipCode || "",
    street: address.street || "",
    city: address.city || "",
    streetNumber: address.streetNumber || "",
    languages: (userData.languages || ["Deutsch", "Englisch"]).join(", "),
    bio: userData.bio || "",
    avatarUrl: userData.avatarUrl || "",
    skills: (userData.skills || []).join(", "),
  };
}

export default function MyProfile({
  user,
  onLogout,
  onUserUpdate,
}: {
  user: User;
  onLogout: () => void;
  onUserUpdate?: (updates: Partial<User>) => void;
}) {
  const initialAddress = user.address || {};
  const [profile, setProfile] = useState<ProfileState>({
    firstname: user.firstname || "",
    surname: user.surname || "",
    email: user.email || "",
    phone: user.phone || "",
    zipCode: initialAddress.zipCode || "",
    street: initialAddress.street || "",
    city: initialAddress.city || "",
    streetNumber: initialAddress.streetNumber || "",
    languages: (user.languages || ["Deutsch", "Englisch"]).join(", "),
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
    skills: (user.skills || []).join(", "),
  });
  const [certifications, setCertifications] = useState<Certification[]>(user.certifications || []);

  const roleLabel = user.role === "coordinator" ? "Koordinator:in" : "Helper";
  const firstName = profile.firstname || profile.surname;
  const hostingYears = user.gamification?.level ? Math.max(1, user.gamification.level) : 1;
  const reviewCount = user.gamification?.completedAssignments || 0;
  const ratingValue = user.gamification ? (4 + Math.min(0.9, user.gamification.level / 10)).toFixed(1) : "4.7";
  const locationText = `${profile.zipCode} ${profile.city}, ${profile.street} ${profile.streetNumber}`;

  const aboutFields: AboutField[] = [
    { id: "role", icon: BriefcaseBusiness, label: "Rolle", value: roleLabel, editable: false },
    {
      id: "firstname",
      icon: UserIcon,
      label: "Vorname",
      value: profile.firstname,
      field: "firstname",
      placeholder: "Vorname",
    },
    {
      id: "surname",
      icon: UserIcon,
      label: "Nachname",
      value: profile.surname,
      field: "surname",
      placeholder: "Nachname",
    },
    {
      id: "phone",
      icon: Phone,
      label: "Telefon",
      value: profile.phone,
      field: "phone",
      placeholder: "z. B. +49 151 12345678",
    },
    {
      id: "languages",
      icon: Languages,
      label: "Sprachen",
      value: profile.languages,
      field: "languages",
      placeholder: "Deutsch, Englisch",
    },
    { id: "street", icon: MapPin, label: "Straße", value: profile.street, field: "street", placeholder: "Straße" },
    { id: "streetNumber", icon: MapPin, label: "Hausnummer", value: profile.streetNumber, field: "streetNumber", placeholder: "Hausnummer" },
    { id: "zipCode", icon: MapPin, label: "PLZ", value: profile.zipCode, field: "zipCode", placeholder: "PLZ" },
      { id: "city", icon: MapPin, label: "Stadt", value: profile.city, field: "city", placeholder: "Stadt" },

    {
      id: "identity",
      icon: ShieldCheck,
      label: "Identitaet",
      value: "verifiziert",
      editable: false,
      underline: true,
    },
    {
      id: "skills",
      icon: Star,
      label: "Skills",
      value: profile.skills,
      field: "skills",
      placeholder: "Einkaufen, Haushalt",
    },
  ];

  const handleFieldUpdate = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));

    if (!onUserUpdate) return;

    if (field === "languages") {
      onUserUpdate({ languages: parseCsvList(value) });
      return;
    }

    if (field === "skills") {
      onUserUpdate({ skills: parseCsvList(value) });
      return;
    }

    onUserUpdate({ [field]: value } as Partial<User>);
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Nur Bilddateien sind erlaubt.");
      input.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const avatarUrl = String(reader.result || "");
      if (!avatarUrl) return;

      try {
        const res = await fetch(`/api/users/${encodeURIComponent(profile.email)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl }),
        });

        if (!res.ok) {
          console.error("Avatar upload failed");
          return;
        }

        setProfile((prev) => ({ ...prev, avatarUrl }));
        onUserUpdate?.({ avatarUrl });
      } catch (error) {
        console.error(error);
      } finally {
        input.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCertificationUpload = async (cert: Omit<Certification, "id" | "uploadedAt" | "verified">) => {
    const res = await fetch(`/api/users/${encodeURIComponent(profile.email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cert),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = (errorData && typeof errorData.error === "string" && errorData.error) || "Upload fehlgeschlagen.";
      throw new Error(message);
    }

    const result = await res.json();
    if (Array.isArray(result.certifications)) {
      setCertifications(result.certifications);
    } else if (result.certification) {
      setCertifications((prev) => [result.certification, ...prev]);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      if (!profile.email) return;

      try {
        const res = await fetch(`/api/users?email=${encodeURIComponent(profile.email)}`);
        if (!res.ok) return;

        const userData = await res.json();
        setProfile((prev) => ({ ...prev, ...toProfileState(userData) }));

        if (Array.isArray(userData?.certifications)) {
          setCertifications(userData.certifications);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    loadProfileData();
  }, [profile.email]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-5 sm:px-6 lg:space-y-14 lg:px-8">
      <div className="space-y-6">
        <div className="grid items-start gap-8 grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-primary-100 bg-white p-5 shadow-[0_8px_20px_rgba(0,61,153,0.08)] sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-neutral-200">
                <img
                  src={profile.avatarUrl || DUMMY_AVATAR}
                  alt={profile.avatarUrl ? `${profile.firstname} ${profile.surname}` : "Dummy Profilbild"}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-accent-500" />
              </div>

              <label className="cursor-pointer rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100">
                Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>

              <div className="flex-1 border-l border-neutral-200 pl-4">
                <div className="grid grid-rows-3 gap-2 text-center">
                  <StatTile value={reviewCount} label="Reviews" />
                  <StatTile value={ratingValue} label="Rating" />
                  <StatTile value={hostingYears} label="Jahre" />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl">{firstName}</h2>
              <p className="mt-1 text-xl font-medium text-primary-700">{roleLabel}</p>
              <p className="mt-2 text-base text-neutral-600">{profile.email}</p>

              {/* Role Switcher */}
              <div className="mt-4">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Rolle wechseln</p>
                <div className="flex gap-0.5 rounded-xl border border-primary-200 bg-primary-50/70 p-0.5">
                  {(["helper", "coordinator"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => r !== user.role && onUserUpdate?.({ role: r })}
                      className={`flex-1 rounded-lg py-1.5 px-2 text-[11px] font-semibold transition-all duration-200 ${
                        user.role === r
                          ? "bg-primary-700 text-white shadow-sm"
                          : "text-primary-600 hover:bg-primary-100"
                      }`}
                    >
                      {r === "helper" ? "Helfer:in" : "Koordinator:in"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-4 rounded-2xl border border-primary-100 bg-primary-50/40 p-4 sm:p-5">
            <div>
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">Über {firstName}</h3>
                      <div className="mt-3 h-1.5 w-36 rounded-full bg-linear-to-r from-primary-800 via-primary-600 to-primary-300" />
            </div>

            <div className="space-y-3">
              {aboutFields.map((item) => (
                <EditField
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  displayValue={item.displayValue}
                  placeholder={item.placeholder}
                  editable={item.editable ?? true}
                  underline={item.underline}
                  field={item.field}
                  email={item.field ? profile.email : undefined}
                  onUpdateState={item.field ? handleFieldUpdate : undefined}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="rounded-2xl border border-primary-100 bg-white p-4 sm:p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Bio</p>
          <EditField
            label="Bio"
            showLabel={false}
            value={profile.bio || `${firstName} unterstützt Familien mit zuverlässiger und herzlicher Hilfe im Alltag.`}
            field="bio"
            email={profile.email}
            placeholder="Kurze Beschreibung über dich"
            onUpdateState={handleFieldUpdate}
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7">
        <div className="pointer-events-none absolute -top-20 left-8 h-40 w-40 rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-52 w-52 rounded-full" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"  />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-800/80">Rezensionen</p>
          <h4 className="mt-1 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Was andere sagen über {firstName}</h4>
          <div className="mt-3 h-1.5 w-36 rounded-full bg-linear-to-r from-primary-800 via-primary-600 to-primary-300" />
          <div className="mt-7 grid gap-4 md:grid-cols-3 lg:gap-5">
            {REVIEWS.map((review) => (
              <ReviewCard
                key={review.name}
                name={review.name}
                text={review.text}
                period={review.period}
                theme={review.theme}
                score={review.score}
                satisfaction={review.satisfaction}
                isVerified={review.isVerified}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7">
        <div className="pointer-events-none absolute -top-20 left-8 h-40 w-40 rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-52 w-52 rounded-full" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"  />        <CertificationManager
          certifications={certifications}
          isOwnProfile={true}
          onUpload={handleCertificationUpload}
          firstName={firstName}
        />
      </div>

      <div className=" p-6">
        <button
          className="p-12 rounded-xl bg-primary-600  py-2.5 font-semibold text-white transition-colors hover:bg-primary-700"
          onClick={onLogout}
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}