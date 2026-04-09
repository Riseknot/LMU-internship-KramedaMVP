import { connectDB } from "@/lib/connectDB";
import {
  createHelptask,
  findHelptasks,
  updateHelptaskById,
} from "@/lib/services/helptasks.service";
import { NextRequest, NextResponse } from "next/server";

type HelptaskStatus = "open" | "assigned" | "completed";
type AddressInput = {
  zipCode?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
};
type PublicLocation = {
  lat: number;
  lng: number;
  radiusM: number;
};

const VALID_STATUSES = new Set<HelptaskStatus>(["open", "assigned", "completed"]);
const MAX_OFFSET_SHARE = 0.35;

const jsonError = (error: string, status: number) => NextResponse.json({ error }, { status });

const parseIsoDate = (value: unknown): Date | null => {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pickString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const pickStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined;

const pickStatus = (value: string | null | undefined): HelptaskStatus | undefined =>
  value && VALID_STATUSES.has(value as HelptaskStatus) ? (value as HelptaskStatus) : undefined;

const redactAddress = (task: any) => ({
  ...task,
  requirements: {
    skills: task.requirements?.skills ?? task.requiredSkills ?? [],
    languages: task.requirements?.languages ?? task.requiredLanguages ?? [],
    notes: task.requirements?.notes ?? task.qualificationNotes ?? "",
  },
  address: task.address ? { zipCode: task.address.zipCode, city: task.address.city } : undefined,
});

async function googleGeocodeAddress(address: AddressInput = {}): Promise<{ lat: number; lng: number } | null> {
  const query = [address.street, address.streetNumber, address.zipCode, address.city]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!query || !apiKey) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
    );
    const data = await res.json();
    const location = data?.results?.[0]?.geometry?.location;
    return typeof location?.lat === "number" && typeof location?.lng === "number" ? location : null;
  } catch {
    return null;
  }
}

const createPublicLoc = async (address: AddressInput = {}): Promise<PublicLocation> => {
  const radiusM = Number(process.env.RADIUS_PUBLIC_LOC);
  const original = await googleGeocodeAddress(address);

  if (!original) return { lat: 0, lng: 0, radiusM };

  const angle = Math.random() * Math.PI * 2;
  const offsetM = Math.sqrt(Math.random()) * radiusM * MAX_OFFSET_SHARE;
  const latOffset = (offsetM * Math.cos(angle)) / 111320;
  const lngOffset = (offsetM * Math.sin(angle)) / (111320 * Math.cos((original.lat * Math.PI) / 180) || 1);

  return {
    lat: original.lat + latOffset,
    lng: original.lng + lngOffset,
    radiusM,
  };
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const start = parseIsoDate(data.start);
    const end = parseIsoDate(data.end);

    if (!start || !end) {
      return jsonError("start and end must be valid ISO datetime values", 400);
    }

    const requirements = {
      skills: pickStringArray(data.requirements?.skills ?? data.requiredSkills) ?? [],
      languages: pickStringArray(data.requirements?.languages ?? data.requiredLanguages) ?? [],
      notes: pickString(data.requirements?.notes ?? data.qualificationNotes) ?? "",
    };

    const helptask = await createHelptask({
      taskType: data.taskType || "help",
      title: data.title,
      description: data.description,
      public_loc: await createPublicLoc(data.address),
      address: data.address,
      start,
      end,
      status: pickStatus(data.status) ?? "open",
      requirements,
      firstname: data.firstname?.trim(),
      surname: data.surname?.trim(),
      email: data.email?.trim()?.toLowerCase(),
      createdBy: null,
    } as any);

    return NextResponse.json(helptask, { status: 201 });
  } catch (error) {
    console.error("POST /api/helptasks error:", error);
    return jsonError(error instanceof Error ? error.message : "Unknown error", 400);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = new URL(req.url).searchParams;

    return NextResponse.json(
      (await findHelptasks({
        id: searchParams.get("id")?.trim() || undefined,
        firstname: searchParams.get("firstname")?.trim() || undefined,
        surname: searchParams.get("surname")?.trim() || undefined,
        email: searchParams.get("email")?.trim()?.toLowerCase() || undefined,
        status: pickStatus(searchParams.get("status")),
        zipCode: searchParams.get("zipCode")?.trim() || undefined,
        title: searchParams.get("title")?.trim() || undefined,
      })).map(redactAddress)
    );
  } catch (error) {
    console.error("Error fetching helptasks:", error);
    return jsonError("Error fetching helptasks", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = new URL(req.url).searchParams;
    const body = await req.json();
    const id = (searchParams.get("id") || body?.id || body?._id || "").trim();

    if (!id) return jsonError("Helptask id is required", 400);

    const updateData: Record<string, unknown> = { ...body };
    ["id", "_id", "createdBy", "firstname", "surname", "email", "createdAt", "updatedAt"].forEach(
      (key) => delete updateData[key]
    );

    if (!Object.keys(updateData).length) {
      return jsonError("No update fields provided", 400);
    }

    const updatedHelptask = await updateHelptaskById(id, updateData);
    return updatedHelptask ? NextResponse.json(updatedHelptask) : jsonError("Helptask not found", 404);
  } catch (error) {
    console.error("Error updating helptask:", error);
    return jsonError("Error updating helptask", 500);
  }
}