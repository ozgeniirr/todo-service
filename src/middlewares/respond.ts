import type { Request, Response, NextFunction } from "express";

export function respond(_req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next();
  const { status = 200, data, message } = res.locals as {
    status?: number; data?: unknown; message?: string;
  };
  if (data === undefined) return next(); 
  return res.status(status).json({ message: message ?? "OK", data });
}
