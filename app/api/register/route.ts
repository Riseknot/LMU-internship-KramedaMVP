import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { findOneUser } from "@/lib/services/user.service";
import { createRegistrationChallenge, consumeRateLimit } from "@/lib/services/registration.service";
import { sendVerificationCodeEmail } from "@/lib/services/email.service";

type RegisterRequest = {
  firstname?: string;
  surname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: "helper" | "coordinator";
  phone?: string;
  zipCode?: string;
  skills?: string[];
  acceptTerms?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string) {
  const hasMinLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function validateRegistrationInput(body: RegisterRequest) {
  const fieldErrors: Record<string, string> = {};

  const firstname = (body.firstname ?? "").trim();
  const surname = (body.surname ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";
  const role = body.role;
  const phone = (body.phone ?? "").trim();
  const zipCode = (body.zipCode ?? "").trim();
  const skills = Array.isArray(body.skills) ? body.skills.filter(Boolean) : [];
  const acceptTerms = Boolean(body.acceptTerms);

  if (firstname.length < 2) {
    fieldErrors.firstname = "Bitte geben Sie Ihren Vornamen an.";
  }

  if (surname.length < 2) {
    fieldErrors.surname = "Bitte geben Sie Ihren Nachnamen an.";
  }

  if (!isValidEmail(email)) {
    fieldErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  if (!isStrongPassword(password)) {
    fieldErrors.password = "Passwort muss min. 10 Zeichen inkl. Groß-/Kleinbuchstaben, Zahl und Sonderzeichen enthalten.";
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwörter stimmen nicht überein.";
  }

  if (role !== "helper" && role !== "coordinator") {
    fieldErrors.role = "Bitte wählen Sie eine gültige Rolle aus.";
  }

  if (phone && !/^[+0-9()\-\s]{7,20}$/.test(phone)) {
    fieldErrors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
  }

  if (role === "helper") {
    if (!/^\d{5}$/.test(zipCode)) {
      fieldErrors.zipCode = "Bitte geben Sie eine 5-stellige Postleitzahl ein.";
    }

    if (!skills.length) {
      fieldErrors.skills = "Bitte wählen Sie mindestens eine Fähigkeit aus.";
    }
  }

  if (!acceptTerms) {
    fieldErrors.acceptTerms = "Bitte akzeptieren Sie die Nutzungsbedingungen und Datenschutzrichtlinie.";
  }

  return {
    fieldErrors,
    data: {
      firstname,
      surname,
      email,
      password,
      role,
      phone: phone || undefined,
      zipCode: zipCode || undefined,
      skills,
      acceptTerms,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = (await req.json()) as RegisterRequest;

    const { fieldErrors, data } = validateRegistrationInput(body);

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          message: "Bitte prüfen Sie Ihre Eingaben.",
          fieldErrors,
        },
        { status: 422 }
      );
    }

    const clientIp = getClientIp(req);
    const ipRateLimit = consumeRateLimit(`register:ip:${clientIp}`, {
      maxRequests: 15,
      windowMs: 15 * 60 * 1000,
    });

    if (!ipRateLimit.ok) {
      return NextResponse.json(
        {
          message: `Zu viele Anfragen. Bitte warten Sie ${ipRateLimit.retryAfterSeconds} Sekunden und versuchen Sie es erneut.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(ipRateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const emailRateLimit = consumeRateLimit(`register:email:${data.email}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!emailRateLimit.ok) {
      return NextResponse.json(
        {
          message: `Es wurden bereits mehrere Codes angefordert. Bitte warten Sie ${emailRateLimit.retryAfterSeconds} Sekunden.`,
          fieldErrors: { email: "Zu viele Code-Anfragen. Bitte kurz warten." },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(emailRateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const existingUser = await findOneUser({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Für diese E-Mail-Adresse existiert bereits ein Konto.",
          fieldErrors: { email: "Diese E-Mail ist bereits registriert." },
        },
        { status: 409 }
      );
    }

    const challenge = createRegistrationChallenge({
      firstname: data.firstname,
      surname: data.surname,
      email: data.email,
      password: data.password,
      role: data.role as "helper" | "coordinator",
      phone: data.phone,
      zipCode: data.zipCode,
      skills: data.skills,
    });

    await sendVerificationCodeEmail({
      to: data.email,
      firstname: data.firstname,
      code: challenge.code,
      expiresAt: challenge.expiresAt,
    });

    return NextResponse.json(
      {
        message: "Wir haben Ihnen einen 6-stelligen Bestätigungscode per E-Mail gesendet.",
        challengeId: challenge.challengeId,
        expiresAt: challenge.expiresAt,
        ...(process.env.NODE_ENV !== "production" ? { developmentCode: challenge.code } : {}),
      },
      { status: 201 }
    );
  } catch (error) {
        console.error("Backend Error in /api/register:", error);
        return NextResponse.json(
            {
            message: "Registrierung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.",
            },
            { status: 500 }
        );
    }
}


//TODO: Registration: RESEND_SEND_FAILED:You can only send testing emails to your own email address (mr.shockwave@live.de). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain. Evtl. https://sendwolf.de/impressum