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

    const allowed = ["name", "phone", "zipCode", "bio", "avatarUrl", "languages", "skills"] as const;
    const updatePayload: Partial<Record<(typeof allowed)[number], string | string[]>> = {};

    for (const key of allowed) {
      if (data[key] !== undefined) {
        if ((key === "languages" || key === "skills") && typeof data[key] === "string") {
          updatePayload[key] = data[key]
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean);
        } else {
          updatePayload[key] = data[key];
        }
      }
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
