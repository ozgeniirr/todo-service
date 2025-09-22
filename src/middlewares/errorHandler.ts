import type { ErrorRequestHandler } from "express";
import { AppError } from "@/errors/App.error";
import { logger } from "@/lib/logger";
import { ERR_TR } from "@/i18n/errors.tr";

export const ErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const log = (status: number, code: string) => {
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    const lg: any = (logger as any).client ?? logger;
    lg[level]?.("http.error", {
      code,
      status,
      method: req.method,
      path: req.originalUrl,
      userId: (req as any)?.user?.userId,
      details: (err as any)?.details,
    });
  };

  if (err instanceof SyntaxError && "body" in (err as any)) {
    log(400, "BAD_JSON");
    return res.status(400).json({ success: false, code: "BAD_JSON",message: ERR_TR["BAD_JSON"],    });
  }

  if ((err as any)?.code === "23505") {
    log(409, "CONFLICT");
    return res.status(409).json({
      success: false,
      code: "CONFLICT",
      message: ERR_TR["CONFLICT"],
      meta: { detail: (err as any)?.detail },
    });
  }
  
  if (err instanceof AppError) {
    const status = (err as any).status;
    const code   = (err as any).code as string;
    const message = ERR_TR[code] || err.message || ERR_TR["INTERNAL_SERVER_ERROR"];
    log(status, code);
    return res.status(status).json({
      success: false,
      code,
      message,
      errors: (err as any).details,
    
    });
  }

if (typeof (err as any)?.statusCode === "number") {
  const status = (err as any).statusCode as number;

  const isValidation = status === 400 || status === 422;

  const code = isValidation
    ? "VALIDATION_ERROR"
    : (typeof (err as any).code === "string" ? (err as any).code : "ERROR");

  let message = (err as any).message;
  if (!message || typeof message !== "string" || !message.trim()) {
    message = isValidation ? "Geçersiz istek verisi" : "Hata";
  }
  log(status, code);
  return res.status(status).json({
    success: false,
    code,
    message,
    errors: (err as any).details ?? (err as any).errors,
  });
}

  if (Array.isArray(err) && err.every(e => e && typeof e === "object" && "property" in e)) {
    log(422, "VALIDATION_ERROR");
    return res.status(422).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Geçersiz istek verisi",
      errors: err.map((e: any) => ({ field: e.property, constraints: e.constraints })),
    });
  }

  log(500, "INTERNAL_SERVER_ERROR");
  return res.status(500).json({ success: false, code: "INTERNAL_SERVER_ERROR", message: "Sunucu hatası." });
};
