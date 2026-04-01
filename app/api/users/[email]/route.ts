import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { addUserCertification, updateUser } from "@/lib/services/user.service";
import { randomUUID } from "crypto";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await connectDB();

    const { email: rawEmail } = await params;
    const email = decodeURIComponent(rawEmail || "").trim().toLowerCase();
    const data = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const updatePayload: Partial<{
      firstname: string;
      surname: string;
      phone: string;
      address: {
        zipCode?: string;
        city?: string;
        street?: string;
        streetNumber?: string;
      };
      bio: string;
      avatarUrl: string;
      languages: string[];
      skills: string[];
    }> = {};

    if (typeof data.firstname === "string") updatePayload.firstname = data.firstname;
    if (typeof data.surname === "string") updatePayload.surname = data.surname;
    if (typeof data.phone === "string") updatePayload.phone = data.phone;
    if (data.address && typeof data.address === "object") {
      const address: { zipCode?: string; city?: string; street?: string; streetNumber?: string } = {};
      if (typeof data.address.zipCode === "string") address.zipCode = data.address.zipCode;
      if (typeof data.address.city === "string") address.city = data.address.city;
      if (typeof data.address.street === "string") address.street = data.address.street;
      if (typeof data.address.streetNumber === "string") address.streetNumber = data.address.streetNumber;
      updatePayload.address = address;
    }
    if (typeof data.bio === "string") updatePayload.bio = data.bio;
    if (typeof data.avatarUrl === "string") updatePayload.avatarUrl = data.avatarUrl;

    if (typeof data.languages === "string") {
      updatePayload.languages = data.languages
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean);
    } else if (Array.isArray(data.languages)) {
      updatePayload.languages = data.languages.filter((item: unknown): item is string => typeof item === "string");
    }

    if (typeof data.skills === "string") {
      updatePayload.skills = data.skills
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean);
    } else if (Array.isArray(data.skills)) {
      updatePayload.skills = data.skills.filter((item: unknown): item is string => typeof item === "string");
    }

    const result = await updateUser(email, updatePayload);

    if (!result.matchedCount) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await connectDB();

    const { email: rawEmail } = await params;
    const email = decodeURIComponent(rawEmail || "").trim().toLowerCase();
    const data = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const type = data.type;
    const fileUrl = typeof data.fileUrl === "string" ? data.fileUrl : undefined;
    const allowedTypes = ["fuehrungszeugnis", "erste-hilfe", "pflegekurs", "other"];

    if (!name) {
      return NextResponse.json({ error: "Certification name is required" }, { status: 400 });
    }

    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid certification type" }, { status: 400 });
    }

    const certification = {
      id: randomUUID(),
      name,
      type,
      uploadedAt: new Date().toISOString(),
      verified: false,
      fileUrl,
    };

    const updatedUser = await addUserCertification(email, certification);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, certification, certifications: updatedUser.certifications || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error uploading certification" }, { status: 500 });
  }
}
