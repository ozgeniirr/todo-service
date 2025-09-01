
import jwt from 'jsonwebtoken';

type AccessPayload = { userId: number; email: string; };
type RefreshPayload = { userId: number; tokenId: string };

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn:  (process.env.JWT_EXPIRES_IN as string,'15m'),
  });
}

export function signRefreshToken(payload: RefreshPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as string, '7d'),
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as AccessPayload & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as RefreshPayload & jwt.JwtPayload;
}


