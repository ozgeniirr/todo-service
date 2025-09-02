
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export type AccessPayload  = { userId: string | number; email: string; role?: string };
export type RefreshPayload = { userId: string | number; tokenId: string };

const ACCESS_SECRET  = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;


const ACCESS_EXPIRES  = process.env.JWT_EXPIRES_IN  || '1d';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export function signAccessToken(payload: AccessPayload) {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function signRefreshToken(payload: RefreshPayload) {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES };
  return jwt.sign(payload, REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as AccessPayload & JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as RefreshPayload & JwtPayload;
}
