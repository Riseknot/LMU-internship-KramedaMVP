import User from "../models/User";
import bcrypt from "bcryptjs";

export async function createUser({ name, email, password, role, phone, zipCode, skills, emailVerified = false }: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  zipCode?: string;
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
    skills,
    emailVerified,
  });
}

export async function findOneUser(query: Partial<{ email: string; name: string; _id: string }>) {
  return await User.findOne(query);
}