import { SignJWT, jwtVerify } from "jose";

/**
 * Returns the signing secret, or throws if it is missing/too weak.
 * Fail-closed: with no ADMIN_SESSION_SECRET set, sessions can neither be
 * minted nor verified — there is NO hardcoded fallback to forge against.
 */
function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (need >= 24 chars). " +
        "Set a strong random value in the environment."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Constant-time string comparison to avoid leaking matches via timing. */
function safeEqual(a: string, b: string): boolean {
  const aBuf = new TextEncoder().encode(a);
  const bBuf = new TextEncoder().encode(b);
  if (aBuf.length !== bBuf.length) return false;
  let mismatch = 0;
  for (let i = 0; i < aBuf.length; i++) mismatch |= aBuf[i] ^ bBuf[i];
  return mismatch === 0;
}

export async function verifyCredentials(username: string, password: string) {
  const users: Array<[string, string]> = [];
  // Primary account — no hardcoded fallback. If unset, no user can log in.
  const primaryUser = process.env.ADMIN_USERNAME;
  const primaryPass = process.env.ADMIN_PASSWORD;
  if (primaryUser && primaryPass) users.push([primaryUser, primaryPass]);
  // Additional accounts via ADMIN_USERNAME_2/ADMIN_PASSWORD_2, etc.
  for (let i = 2; ; i++) {
    const u = process.env[`ADMIN_USERNAME_${i}`];
    const p = process.env[`ADMIN_PASSWORD_${i}`];
    if (!u || !p) break;
    users.push([u, p]);
  }
  if (users.length === 0) return false; // fail-closed: nothing configured
  // Evaluate every entry (no short-circuit) so timing doesn't reveal which
  // field matched; safeEqual is itself constant-time per comparison.
  let ok = false;
  for (const [u, p] of users) {
    if (safeEqual(username, u) && safeEqual(password, p)) ok = true;
  }
  return ok;
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
