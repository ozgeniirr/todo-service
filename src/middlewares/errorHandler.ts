import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors/App.error";
import { logger } from "@/lib/logger";

export function ErrorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const cvErrors = Array.isArray(err?.errors)
    ? err.errors.map((e: any) => ({ field: e.property, constraints: e.constraints }))
    : undefined;


  const logError = (status: number, code: string) => {
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    const lg: any = (logger as any).client ?? logger; 
    lg[level]?.("http.error", {
      code,
      status,
      method: req.method,
      path: req.originalUrl,
      userId: (req as any)?.user?.userId,
      details: err?.details,
    });
  };

  if (err instanceof SyntaxError && "body" in err) {
    logError(400, "BAD_JSON");
    return res.status(400).json({ success: false, code: "BAD_JSON", message: "Geçersiz JSON." });
  }

  if (err?.code === "23505") {
    logError(409, "CONFLICT");
    return res.status(409).json({
      success: false,
      code: "CONFLICT",
      message: "Kayıt benzersiz kısıtına takıldı",
      meta: { detail: err?.detail },
    });
  }

  if (err instanceof AppError) {
    logError(err.status, err.code);
    return res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
      errors: err.details || cvErrors,
    });
  }

  if (Array.isArray(err)) {
    logError(422, "VALIDATION_ERROR");
    return res.status(422).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Geçersiz istek verisi",
      errors: err.map((e: any) => ({ field: e.property, constraints: e.constraints })),
    });
  }

  logError(500, "INTERNAL_SERVER_ERROR");
  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Sunucu hatası.",
  });
}
