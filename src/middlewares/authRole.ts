import { Request, Response, NextFunction } from "express";
import { Role } from "@/types/role"; 

export function authorizeRole(required: Role | Role[]) {
  const allowed = Array.isArray(required) ? required : [required];

  return (req: Request, res: Response, next: NextFunction) => {
    const current = (req as any)?.user?.role as Role | undefined;

    if (!current) {
      return res.status(401).json({ message: "Yetkilendirme gerekli." });
    }
    if (!allowed.includes(current)) {
      return res.status(403).json({ message: "Yetkiniz yok." });
    }

    next();
  };
}
