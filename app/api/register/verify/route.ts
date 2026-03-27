import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { createUser, findOneUser } from "@/lib/services/user.service";
import { verifyRegistrationChallenge } from "@/lib/services/registration.service";

type VerifyRequest = {
  challengeId?: string;
  code?: string;
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = (await req.json()) as VerifyRequest;
    const challengeId = (body.challengeId ?? "").trim();
    const code = (body.code ?? "").trim();

    if (!challengeId || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          message: "Bitte geben Sie einen gültigen 6-stelligen Bestätigungscode ein.",
        },
        { status: 422 }
      );
    }

    const verificationResult = verifyRegistrationChallenge(challengeId, code);

    if (!verificationResult.ok) {
      const messageMap = {
        NOT_FOUND: "Der Bestätigungsvorgang wurde nicht gefunden. Bitte starten Sie die Registrierung erneut.",
        EXPIRED: "Der Bestätigungscode ist abgelaufen. Bitte fordern Sie einen neuen Code an.",
        INVALID_CODE: "Der eingegebene Bestätigungscode ist ungültig.",
        TOO_MANY_ATTEMPTS: "Zu viele Fehlversuche. Bitte starten Sie die Registrierung erneut.",
      };

      return NextResponse.json(
        { message: messageMap[verificationResult.reason] },
        { status: 400 }
      );
    }

    const existingUser = await findOneUser({ email: verificationResult.payload.email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Für diese E-Mail-Adresse existiert bereits ein Konto.",
        },
        { status: 409 }
      );
    }

    const createdUser = await createUser({
      ...verificationResult.payload,
      emailVerified: true,
    });

    return NextResponse.json(
      {
        message: "E-Mail erfolgreich bestätigt. Ihr Konto wurde erstellt.",
        user: {
          id: String(createdUser._id),
          firstname: createdUser.firstname,
          surname: createdUser.surname,
          email: createdUser.email,
          role: createdUser.role,
          phone: createdUser.phone,
          zipCode: createdUser.zipCode,
          skills: createdUser.skills,
          emailVerified: createdUser.emailVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      },
      { status: 500 }
    );
  }
}
