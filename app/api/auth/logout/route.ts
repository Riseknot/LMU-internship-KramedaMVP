import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/services/auth-session.service";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logout erfolgreich." },
    { status: 200 }
  );

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}