import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Role } from "@/enums/types/role";

const ACCESS_SECRET  = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES  = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";


export function signAccessToken(userId: string | number, claims: { email: string; role: Role }) {
  const options: SignOptions = { subject: String(userId), expiresIn: ACCESS_EXPIRES };
  return jwt.sign(claims, ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string) {
  const p = jwt.verify(token, ACCESS_SECRET) as JwtPayload & { email?: string; role?: Role };
  const userId = p.sub as string | undefined;
  if (!userId) throw new Error("invalid access payload");
  return { userId, email: p.email, role: p.role };
}

export function signRefreshToken(userId: string | number, tokenId: string) {
  const options: SignOptions = { subject: String(userId), jwtid: tokenId, expiresIn: REFRESH_EXPIRES };
  return jwt.sign({}, REFRESH_SECRET, options);
}
export function verifyRefreshToken(token: string) {
  const p = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  const userId = p.sub, tokenId = p.jti;
  if (!userId || !tokenId) throw new Error("invalid refresh payload");
  return { userId, tokenId };
}
