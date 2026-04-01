import User from "../models/User";
import bcrypt from "bcryptjs";

type AddressPayload = {
  zipCode?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
};

export async function createUser({ firstname, surname, email, password, role, phone, address, languages, skills, emailVerified = false }: {
  firstname: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: AddressPayload;
  languages?: string[];
  skills?: string[];
  emailVerified?: boolean;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("USER_ALREADY_EXISTS");

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    firstname: firstname.trim(),
    surname: surname.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    phone,
    address,
    languages,
    skills,
    emailVerified,
  });
}

export async function findOneUser(query: Partial<{ email: string; firstname: string; _id: string }>) {
  return await User.findOne(query);
}

export async function findUsers(query: Partial<{ role: string; emailVerified: boolean }> = {}) {
  return await User.find(query).select("firstname surname email role phone address skills languages bio avatarUrl coordinates certifications emailVerified");
}

export async function updateUser(
  email: string,
  fields: Partial<{
    firstname: string;
    surname: string;
    phone: string;
    address: AddressPayload;
    coordinates: {
      lat: number;
      lng: number;
    };
    bio: string;
    avatarUrl: string;
    languages: string[];
    skills: string[];
  }>
) {
  if (!email) throw new Error("EMAIL_REQUIRED");

  // nur vorhandene Felder setzen
  const updateData: Partial<typeof fields> = {};
  if (fields.firstname !== undefined) updateData.firstname = fields.firstname;
  if (fields.surname !== undefined) updateData.surname = fields.surname;
  if (fields.phone !== undefined) updateData.phone = fields.phone;
  if (fields.address !== undefined) updateData.address = fields.address;
  if (fields.coordinates !== undefined) updateData.coordinates = fields.coordinates;
  if (fields.bio !== undefined) updateData.bio = fields.bio;
  if (fields.avatarUrl !== undefined) updateData.avatarUrl = fields.avatarUrl;
  if (fields.languages !== undefined) updateData.languages = fields.languages;
  if (fields.skills !== undefined) updateData.skills = fields.skills;

  const result = await User.updateOne({ email }, { $set: updateData });
  return result;
}

export async function addUserCertification(
  email: string,
  certification: {
    id: string;
    name: string;
    type: "fuehrungszeugnis" | "erste-hilfe" | "pflegekurs" | "other";
    uploadedAt: string;
    verified: boolean;
    fileUrl?: string;
  }
) {
  if (!email) throw new Error("EMAIL_REQUIRED");

  return await User.findOneAndUpdate(
    { email },
    { $push: { certifications: certification } },
    { new: true }
  );
}