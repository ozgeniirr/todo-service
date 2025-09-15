import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt";

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const auth = req.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = auth.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const { userId, email, role } = verifyAccessToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Invalid access token payload" });
    }

    (req as any).user = { userId: String(userId), email, role };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
