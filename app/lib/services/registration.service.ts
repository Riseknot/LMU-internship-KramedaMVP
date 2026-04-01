import { randomInt, randomUUID } from "crypto";

type PendingRegistration = {
  challengeId: string;
  code: string;
  attempts: number;
  expiresAt: number;
  payload: {
    firstname: string;
    surname: string;
    email: string;
    password: string;
    role: "helper" | "coordinator";
    phone?: string;
    address?: {
      zipCode?: string;
      city?: string;
      street?: string;
      streetNumber?: string;
    };
    skills?: string[];
  };
};

const verificationStore = new Map<string, PendingRegistration>();
const challengeByEmail = new Map<string, string>();
const throttleStore = new Map<string, number[]>();
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

function cleanupExpiredChallenges() {
  const now = Date.now();
  for (const [challengeId, entry] of verificationStore.entries()) {
    if (entry.expiresAt <= now) {
      verificationStore.delete(challengeId);
      challengeByEmail.delete(entry.payload.email);
    }
  }
}

function cleanupThrottleStore(windowMs: number) {
  const now = Date.now();

  for (const [key, timestamps] of throttleStore.entries()) {
    const valid = timestamps.filter((value) => now - value < windowMs);
    if (valid.length === 0) {
      throttleStore.delete(key);
    } else {
      throttleStore.set(key, valid);
    }
  }
}

export function consumeRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  cleanupThrottleStore(config.windowMs);

  const now = Date.now();
  const history = throttleStore.get(key) ?? [];
  const validHistory = history.filter((value) => now - value < config.windowMs);

  if (validHistory.length >= config.maxRequests) {
    const firstInWindow = validHistory[0] ?? now;
    const retryAfterMs = Math.max(config.windowMs - (now - firstInWindow), 1000);
    return {
      ok: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  validHistory.push(now);
  throttleStore.set(key, validHistory);

  return {
    ok: true,
    retryAfterSeconds: 0,
  };
}

export function createRegistrationChallenge(payload: PendingRegistration["payload"]) {
  cleanupExpiredChallenges();

  const existingChallengeId = challengeByEmail.get(payload.email);
  if (existingChallengeId) {
    verificationStore.delete(existingChallengeId);
  }

  const challengeId = randomUUID();
  const code = String(randomInt(100000, 1000000));
  const expiresAt = Date.now() + CODE_TTL_MS;

  verificationStore.set(challengeId, {
    challengeId,
    code,
    expiresAt,
    attempts: 0,
    payload,
  });
  challengeByEmail.set(payload.email, challengeId);

  return {
    challengeId,
    code,
    expiresAt,
  };
}

export function verifyRegistrationChallenge(challengeId: string, code: string) {
  cleanupExpiredChallenges();

  const entry = verificationStore.get(challengeId);
  if (!entry) {
    return { ok: false as const, reason: "NOT_FOUND" as const };
  }

  if (entry.expiresAt <= Date.now()) {
    verificationStore.delete(challengeId);
    challengeByEmail.delete(entry.payload.email);
    return { ok: false as const, reason: "EXPIRED" as const };
  }

  entry.attempts += 1;

  if (entry.attempts > MAX_ATTEMPTS) {
    verificationStore.delete(challengeId);
    challengeByEmail.delete(entry.payload.email);
    return { ok: false as const, reason: "TOO_MANY_ATTEMPTS" as const };
  }

  if (entry.code !== code) {
    return { ok: false as const, reason: "INVALID_CODE" as const };
  }

  verificationStore.delete(challengeId);
  challengeByEmail.delete(entry.payload.email);

  return {
    ok: true as const,
    payload: entry.payload,
  };
}
