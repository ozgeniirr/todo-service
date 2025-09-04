import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt"; 

//type AuthedRequest = Request & { user?: { userId: string } };

export function authenticateUser(req:Request, res: Response, next: NextFunction) {
  const auth = req.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = auth.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = verifyAccessToken(token);
    const userId = (payload as any).sub ?? (payload as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid access token payload" });
    }

    req.user = { userId: String(userId) };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
