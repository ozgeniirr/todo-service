
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { NextFunction, Request, Response } from 'express'

export const ValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const dto = plainToInstance(type, req.body)
			await validateOrReject(dto, {
				skipMissingProperties,
				whitelist,
				forbidNonWhitelisted,
			})

			req.body = dto
			next()
		} catch (errors: any) {
            return res.status(500).json(errors);

		}
	}
}
