import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import {
  SESSION_COOKIE_NAME,
  verifySignedSessionToken,
} from "@/lib/services/auth-session.service";
import { findOneUser } from "@/lib/services/user.service";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ message: "Nicht authentifiziert." }, { status: 401 });
    }

    const payload = verifySignedSessionToken(token);
    if (!payload) {
      return NextResponse.json({ message: "Sitzung ist ungültig oder abgelaufen." }, { status: 401 });
    }

    const user = await findOneUser({ email: payload.email, _id: payload.sub });
    if (!user || !user.emailVerified) {
      return NextResponse.json({ message: "Benutzer nicht gefunden." }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          zipCode: user.zipCode,
          languages: user.languages,
          skills: user.skills,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          certifications: user.certifications,
          gamification: user.gamification,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Sitzung konnte nicht geladen werden." },
      { status: 500 }
    );
  }
}