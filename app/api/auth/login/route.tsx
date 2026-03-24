import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import {
	createSignedSessionToken,
	SESSION_COOKIE_NAME,
	SESSION_TTL_SECONDS,
} from "@/lib/services/auth-session.service";
import { consumeRateLimit } from "@/lib/services/registration.service";
import { findOneUser } from "@/lib/services/user.service";

type LoginRequest = {
	email?: string;
	password?: string;
};

function getClientIp(req: NextRequest) {
	const forwardedFor = req.headers.get("x-forwarded-for");
	if (forwardedFor) {
		return forwardedFor.split(",")[0]?.trim() || "unknown";
	}

	const realIp = req.headers.get("x-real-ip");
	if (realIp) {
		return realIp.trim();
	}

	return "unknown";
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
	try {
		await connectDB();

		const body = (await req.json()) as LoginRequest;
		const email = (body.email ?? "").trim().toLowerCase();
		const password = body.password ?? "";

		if (!isValidEmail(email) || password.length < 1) {
			return NextResponse.json(
				{
					message: "Bitte geben Sie eine gültige E-Mail-Adresse und ein Passwort ein.",
				},
				{ status: 422 }
			);
		}

		const clientIp = getClientIp(req);

		const ipRateLimit = consumeRateLimit(`login:ip:${clientIp}`, {
			maxRequests: 30,
			windowMs: 15 * 60 * 1000,
		});

		if (!ipRateLimit.ok) {
			return NextResponse.json(
				{
					message: `Zu viele Login-Versuche. Bitte warten Sie ${ipRateLimit.retryAfterSeconds} Sekunden.`,
				},
				{
					status: 429,
					headers: {
						"Retry-After": String(ipRateLimit.retryAfterSeconds),
					},
				}
			);
		}

		const accountRateLimit = consumeRateLimit(`login:account:${email}:${clientIp}`, {
			maxRequests: 8,
			windowMs: 15 * 60 * 1000,
		});

		if (!accountRateLimit.ok) {
			return NextResponse.json(
				{
					message: `Zu viele Login-Versuche für dieses Konto. Bitte warten Sie ${accountRateLimit.retryAfterSeconds} Sekunden.`,
				},
				{
					status: 429,
					headers: {
						"Retry-After": String(accountRateLimit.retryAfterSeconds),
					},
				}
			);
		}

		const user = await findOneUser({ email });
		const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

		if (!user || !isPasswordValid) {
			await sleep(300);
			return NextResponse.json(
				{
					message: "E-Mail oder Passwort ist nicht korrekt.",
				},
				{ status: 401 }
			);
		}

		if (!user.emailVerified) {
			return NextResponse.json(
				{
					message: "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.",
				},
				{ status: 403 }
			);
		}

		const now = Math.floor(Date.now() / 1000);
		const token = createSignedSessionToken({
			sub: String(user._id),
			email: user.email,
			role: user.role,
			iat: now,
			exp: now + SESSION_TTL_SECONDS,
			jti: crypto.randomUUID(),
		});

		const response = NextResponse.json(
			{
				message: "Login erfolgreich.",
				user: {
					id: String(user._id),
					name: user.name,
					email: user.email,
					role: user.role,
					phone: user.phone,
					zipCode: user.zipCode,
					skills: user.skills,
					emailVerified: user.emailVerified,
				},
			},
			{ status: 200 }
		);

		response.cookies.set({
			name: SESSION_COOKIE_NAME,
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: SESSION_TTL_SECONDS,
		});

		return response;
	} catch (error) {
		console.error("Backend Error in /api/auth/login:", error);

		return NextResponse.json(
			{
				message: "Login fehlgeschlagen. Bitte versuchen Sie es erneut.",
			},
			{ status: 500 }
		);
	}
}
