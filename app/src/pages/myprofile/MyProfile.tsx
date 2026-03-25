import { Certification, User } from "../../types";
import { CertificationManager } from "../../components/CertificationManager";
import { BriefcaseBusiness, Languages, LucideIcon, MapPin, Phone, Quote, ShieldCheck, Star, User as UserIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import EditField from "@/src/utils/EditField";

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
  name: string;
  email: string;
  phone: string;
  zipCode: string;
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

const REVIEW_THEMES: Record<ReviewTheme, { card: string; line: string; orb: string; glow: string }> = {
  primary: {
    card: "border-primary-200 bg-linear-to-br from-primary-50 via-white to-primary-100/70",
    line: "from-primary-500 to-primary-300",
    orb: "from-primary-300/65 to-primary-100/20",
    glow: "shadow-[0_12px_25px_rgba(0,82,204,0.15)]",
  },
  accent: {
    card: "border-accent-200 bg-linear-to-br from-accent-50 via-white to-accent-100/75",
    line: "from-accent-500 to-accent-300",
    orb: "from-accent-300/70 to-accent-100/25",
    glow: "shadow-[0_12px_25px_rgba(255,153,0,0.16)]",
  },
  mixed: {
    card: "border-primary-100 bg-linear-to-br from-primary-50/80 via-white to-accent-100/65",
    line: "from-primary-500 via-accent-500 to-accent-300",
    orb: "from-primary-300/55 via-accent-300/45 to-accent-100/25",
    glow: "shadow-[0_12px_28px_rgba(20,75,170,0.14)]",
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
    <article className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${themeStyle.card} ${themeStyle.glow}`}>
      <div className={`pointer-events-none absolute -top-7 -right-8 h-24 w-24 rounded-full bg-linear-to-br ${themeStyle.orb}`} />
      <div className="pointer-events-none absolute right-3 bottom-3 text-neutral-300/70">
        <Quote className="h-4 w-4" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/80 text-sm font-bold text-primary-700">
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
      </div>

      <div className="mt-3 flex items-center gap-1 text-accent-500">
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
        <span className="ml-1 text-xs font-semibold text-neutral-600">{score.toFixed(1)}</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-neutral-700">{text}</p>

      <div className="mt-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Zufriedenheit</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
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
  return {
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    zipCode: userData.zipCode || "",
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
  const [profile, setProfile] = useState<ProfileState>({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    zipCode: user.zipCode || "",
    languages: (user.languages || ["Deutsch", "Englisch"]).join(", "),
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
    skills: (user.skills || []).join(", "),
  });
  const [certifications, setCertifications] = useState<Certification[]>(user.certifications || []);

  const roleLabel = user.role === "coordinator" ? "Koordinator:in" : "Helper";
  const firstName = profile.name.split(" ")[0] || profile.name;
  const hostingYears = user.gamification?.level ? Math.max(1, user.gamification.level) : 1;
  const reviewCount = user.gamification?.completedAssignments || 0;
  const ratingValue = user.gamification ? (4 + Math.min(0.9, user.gamification.level / 10)).toFixed(1) : "4.7";
  const locationText = profile.zipCode ? `PLZ ${profile.zipCode}` : "Nicht angegeben";

  const aboutFields: AboutField[] = [
    { id: "role", icon: BriefcaseBusiness, label: "Rolle", value: roleLabel, editable: false },
    {
      id: "name",
      icon: UserIcon,
      label: "Name",
      value: profile.name,
      field: "name",
      placeholder: "Vor- und Nachname",
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
    {
      id: "zipCode",
      icon: MapPin,
      label: "Standort / PLZ",
      value: profile.zipCode,
      displayValue: locationText,
      field: "zipCode",
      placeholder: "z. B. 81543",
    },
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
                  alt={profile.avatarUrl ? profile.name : "Dummy Profilbild"}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-accent-500" />
              </div>

              <label className="cursor-pointer rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100">
                Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>

              <div className="flex-1 border-l border-neutral-200 pl-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <StatTile value={reviewCount} label="Reviews" />
                  <StatTile value={ratingValue} label="Rating" />
                  <StatTile value={hostingYears} label="Jahre" />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl">{firstName}</h2>
              <p className="mt-1 text-sm font-medium text-primary-700">{roleLabel}</p>
              <p className="mt-2 text-sm text-neutral-600">{profile.email}</p>
            </div>
          </aside>

          <section className="space-y-4 rounded-2xl border border-primary-100 bg-primary-50/40 p-4 sm:p-5">
            <div>
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">Über {firstName}</h3>
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

      <div className="relative overflow-hidden border-primary-100 bg-linear-to-br from-primary-50/50 via-white to-accent-50/65 p-6 sm:p-7">
        <div className="pointer-events-none absolute -top-20 left-8 h-40 w-40 rounded-full bg-primary-200/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-52 w-52 rounded-full bg-accent-200/35 blur-3xl" />

        <div className="relative">
          <h4 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Was andere sagen ueber {firstName}</h4>
          <div className="mt-2 h-1.5 w-28 rounded-full bg-linear-to-r from-primary-600 to-accent-500" />
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

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <CertificationManager
          certifications={certifications}
          isOwnProfile={true}
          onUpload={handleCertificationUpload}
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