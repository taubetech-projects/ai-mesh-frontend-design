import { importSPKI, jwtVerify } from "jose";

let keyPromise: Promise<CryptoKey> | null = null;

async function getPublicKey() {
  if (!keyPromise) {
    const pem = process.env.JWT_PUBLIC_KEY;
    if (!pem) throw new Error("Missing JWT_PUBLIC_KEY");
    keyPromise = importSPKI(pem, "RS256");
  }
  return keyPromise;
}

export async function verifyAccessToken(token: string) {
  try {
    const key = await getPublicKey();
    const { payload } = await jwtVerify(token, key, {
      issuer: process.env.JWT_ISSUER ?? "aimesh.secure",
    });
    return payload as any; // payload.roles is available (from your JWT)
  } catch {
    return null;
  }
}
