import { connectDB } from "@/lib/connectDB";
import {
  createHelptask,
  findHelptasks,
  updateHelptaskById,
} from "@/lib/services/helptasks.service";
import { NextRequest, NextResponse } from "next/server";

type HelptaskStatus = "open" | "assigned" | "completed";
type GeoPoint = { type: "Point"; coordinates: [number, number] };
type AddressInput = {
  zipCode?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
};

const ZERO_POINT: GeoPoint = { type: "Point", coordinates: [0, 0] };
const VALID_STATUSES = new Set<HelptaskStatus>(["open", "assigned", "completed"]);

const jsonError = (error: string, status: number) => NextResponse.json({ error }, { status });

const parseIsoDate = (value: unknown): Date | null => {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeAddress = (value: Partial<AddressInput> = {}): AddressInput => ({
  zipCode: value.zipCode?.trim() || "",
  city: value.city?.trim() || "",
  street: value.street?.trim() || "",
  streetNumber: value.streetNumber?.trim() || "",
});

const isPoint = (value: unknown): value is GeoPoint =>
  Boolean(
    value &&
      typeof value === "object" &&
      (value as { type?: unknown }).type === "Point" &&
      Array.isArray((value as { coordinates?: unknown }).coordinates) &&
      (value as { coordinates: unknown[] }).coordinates.length >= 2
  );

const pickStatus = (value: string | null | undefined): HelptaskStatus | undefined =>
  value && VALID_STATUSES.has(value as HelptaskStatus) ? (value as HelptaskStatus) : undefined;

const redactAddress = (task: any) => ({
  ...task,
  address: task.address ? { zipCode: task.address.zipCode, city: task.address.city } : undefined,
});

async function geocodeAddress(address: AddressInput) {
  const query = [address.street, address.streetNumber, address.zipCode, address.city].filter(Boolean).join(" ").trim();
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

const createPublicLoc = (lat: number, lng: number): GeoPoint => {
  const radiusM = Math.max(300, Number(process.env.RADIUS_PUBLIC_LOC || 1400));
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.sqrt(Math.random()) * radiusM;
  const latOffset = (distance * Math.cos(angle)) / 111320;
  const lngOffset = (distance * Math.sin(angle)) / ((111320 * Math.cos((lat * Math.PI) / 180)) || 1);

  return { type: "Point", coordinates: [lng + lngOffset, lat + latOffset] };
};

const resolvePublicLoc = async (value: unknown, address: AddressInput): Promise<GeoPoint> => {
  if (isPoint(value)) return value;
  const geocoded = await geocodeAddress(address);
  return geocoded ? createPublicLoc(geocoded.lat, geocoded.lng) : ZERO_POINT;
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

    const address = normalizeAddress(data.address);
    const helptask = await createHelptask({
      taskType: data.taskType || "help",
      title: data.title,
      description: data.description,
      public_loc: await resolvePublicLoc(data.public_loc ?? data.public_log, address),
      address,
      start,
      end,
      status: pickStatus(data.status) ?? "open",
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