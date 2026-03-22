import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongo";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ msg: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    return NextResponse.json({ msg: "Registered successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}