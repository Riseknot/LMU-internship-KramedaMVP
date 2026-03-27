
import mongoose from "mongoose";
import Helptask from "../models/Helptask";

type CreateHelptaskInput = {
  taskType: string;
  title: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: {
    zipCode?: string;
    city?: string;
    street?: string;
  };
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  status: "open" | "assigned" | "completed";
  assignedHelper?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId | null;
  firstname: string;
  surname: string;
  email: string;
};

type HelptaskFilters = Partial<{
  firstname: string;
  surname: string;
  email: string;
  status: "open" | "assigned" | "completed";
  zipCode: string;
  title: string;
}>;

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildContainsRegex(value: string) {
  return new RegExp(escapeRegex(value.trim()), "i");
}

export async function createHelptask(input: CreateHelptaskInput) {
  return Helptask.create(input);
}

export async function findHelptasks(filters: HelptaskFilters = {}) {
  const query: Record<string, unknown> = {};

  if (filters.firstname) query.firstname = buildContainsRegex(filters.firstname);
  if (filters.surname) query.surname = buildContainsRegex(filters.surname);
  if (filters.email) query.email = filters.email.trim().toLowerCase();
  if (filters.status) query.status = filters.status;
  if (filters.zipCode) query["address.zipCode"] = filters.zipCode.trim();
  if (filters.title) query.title = buildContainsRegex(filters.title);

  return Helptask.find(query).sort({ createdAt: -1 }).lean();
}

export async function updateHelptaskById(id: string, fields: Record<string, unknown>) {
  return Helptask.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true }).lean();
}