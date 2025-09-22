import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response, NextFunction } from "express";

export function ValidateParams(DTO: new () => any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(DTO, req.params);
    const errors = await validate(instance, { whitelist: true, forbidUnknownValues: true });
    if (errors.length) {
      return res.status(422).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Geçersiz istek verisi",
        errors: errors.map(e => ({
          field: e.property,
          constraints: e.constraints,
        })),
      });
    }
    
    (req as any).validatedParams = instance;
    next();
  };
}
