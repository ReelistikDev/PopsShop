const SECRET = process.env.ADMIN_SESSION_SECRET ?? "lbwc-admin-secret-2024";

export async function verifyCredentials(username: string, password: string) {
  const u = process.env.ADMIN_USERNAME ?? "Sawblade54";
  const p = process.env.ADMIN_PASSWORD ?? "Kbjh6559@";
  return username === u && password === p;
}

export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin:${expiry}`;
  const key = await getKey("sign");
  const sig = await crypto.subtle.sign("HMAC", key, enc(payload));
  return `${payload}:${b64(sig)}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const i = token.lastIndexOf(":");
    if (i < 0) return false;
    const payload = token.slice(0, i);
    const sigStr = token.slice(i + 1);
    const parts = payload.split(":");
    if (parts[0] !== "admin") return false;
    if (Date.now() > Number(parts[1])) return false;
    const key = await getKey("verify");
    const sigBytes = Uint8Array.from(atob(sigStr), (c) => c.charCodeAt(0));
    return crypto.subtle.verify("HMAC", key, sigBytes, enc(payload));
  } catch {
    return false;
  }
}

async function getKey(usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw", enc(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false, [usage]
  );
}
const enc = (s: string) => new TextEncoder().encode(s);
const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
