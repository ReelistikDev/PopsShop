import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET ?? "lbwc-admin-secret-2024"
);

export async function verifyCredentials(username: string, password: string) {
  const users: Array<[string, string]> = [
    [process.env.ADMIN_USERNAME ?? "Sawblade54", process.env.ADMIN_PASSWORD ?? "Kbjh6559@"],
  ];
  // Additional accounts via ADMIN_USERNAME_2/ADMIN_PASSWORD_2, etc.
  for (let i = 2; ; i++) {
    const u = process.env[`ADMIN_USERNAME_${i}`];
    const p = process.env[`ADMIN_PASSWORD_${i}`];
    if (!u || !p) break;
    users.push([u, p]);
  }
  return users.some(([u, p]) => username === u && password === p);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
