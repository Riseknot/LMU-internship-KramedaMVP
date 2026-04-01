import mongoose from "mongoose";
import Helptask from "../models/Helptask";

type HelptaskStatus = "open" | "assigned" | "completed";
type GeoPoint = { type: "Point"; coordinates: [number, number] };
type AddressInput = {
  zipCode?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
};

type CreateHelptaskInput = {
  taskType: string;
  title: string;
  description: string;
  public_loc: GeoPoint;
  address: AddressInput;
  start: Date;
  end: Date;
  status: HelptaskStatus;
  assignedHelper?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId | null;
  firstname: string;
  surname: string;
  email: string;
};

export type HelptaskFilters = Partial<{
  firstname: string;
  surname: string;
  email: string;
  status: HelptaskStatus;
  zipCode: string;
  title: string;
}>;

let helptaskIndexSyncPromise: Promise<unknown> | null = null;

const ensureHelptaskIndexes = () =>
  (helptaskIndexSyncPromise ??= Helptask.syncIndexes().catch((error) => {
    helptaskIndexSyncPromise = null;
    throw error;
  }));

const escapeRegex = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const contains = (value: string) => new RegExp(escapeRegex(value.trim()), "i");

export async function createHelptask(input: CreateHelptaskInput) {
  await ensureHelptaskIndexes();
  return Helptask.create(input);
}

export async function findHelptasks(filters: HelptaskFilters = {}) {
  const query: Record<string, unknown> = {
    ...(filters.firstname ? { firstname: contains(filters.firstname) } : {}),
    ...(filters.surname ? { surname: contains(filters.surname) } : {}),
    ...(filters.email ? { email: filters.email.trim().toLowerCase() } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.zipCode ? { "address.zipCode": filters.zipCode.trim() } : {}),
    ...(filters.title ? { title: contains(filters.title) } : {}),
  };

  return Helptask.find(query).sort({ createdAt: -1 }).lean();
}

export const updateHelptaskById = (id: string, fields: Record<string, unknown>) =>
  Helptask.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true }).lean();