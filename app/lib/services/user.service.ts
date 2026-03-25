import User from "../models/User";
import bcrypt from "bcryptjs";

export async function createUser({ name, email, password, role, phone, zipCode, languages, skills, emailVerified = false }: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  zipCode?: string;
  languages?: string[];
  skills?: string[];
  emailVerified?: boolean;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("USER_ALREADY_EXISTS");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    phone,
    zipCode,
    languages,
    skills,
    emailVerified,
  });
}

export async function findOneUser(query: Partial<{ email: string; name: string; _id: string }>) {
  return await User.findOne(query);
}

export async function updateUser(
  email: string,
  fields: Partial<{
    name: string;
    phone: string;
    zipCode: string;
    bio: string;
    avatarUrl: string;
    languages: string[];
    skills: string[];
  }>
) {
  if (!email) throw new Error("EMAIL_REQUIRED");

  // nur vorhandene Felder setzen
  const updateData: Partial<typeof fields> = {};
  if (fields.name !== undefined) updateData.name = fields.name;
  if (fields.phone !== undefined) updateData.phone = fields.phone;
  if (fields.zipCode !== undefined) updateData.zipCode = fields.zipCode;
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