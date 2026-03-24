import crypto from "crypto";

export const SESSION_COOKIE_NAME = "mvpkrameda_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionTokenPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  jti: string;
};

function base64UrlEncode(input: Buffer | string) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined");
  }
  return secret;
}

export function createSignedSessionToken(payload: SessionTokenPayload) {
  const secret = getAuthSecret();

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(unsignedToken).digest()
  );

  return `${unsignedToken}.${signature}`;
}

export function verifySignedSessionToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, providedSignature] = parts;
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const secret = getAuthSecret();
    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", secret).update(unsignedToken).digest()
    );

    const providedBuffer = Buffer.from(providedSignature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (
      providedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
      return null;
    }

    const parsedHeader = JSON.parse(base64UrlDecode(encodedHeader));
    if (parsedHeader.alg !== "HS256" || parsedHeader.typ !== "JWT") {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionTokenPayload;
    if (!payload.sub || !payload.email || !payload.exp) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}