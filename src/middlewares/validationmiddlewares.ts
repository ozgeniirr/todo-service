import { ErrorCode } from '../enums/code/error.code.enum'
import { BadRequestError } from '../responses-errors/bad.request.error'
import { plainToInstance } from 'class-transformer'
import { ValidationError, validateOrReject } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import * as i18n from 'i18n'

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
			const translatedErrors = errors
				.map((error: ValidationError) => {
					const translatedConstraints: { [key: string]: string } = {}

					if (error.children && error.children.length > 0) {
						error.children.forEach((childError: ValidationError) => {
							for (const constraintKey in childError.constraints) {
								const translationKey = `validation.${constraintKey}`
								const translatedMessage = i18n.__(translationKey, {
									property: childError.property,
									min: '1',
									max: '256',
								})

								translatedConstraints[constraintKey] = translatedMessage
							}
						})
					} else {
						for (const constraintKey in error.constraints) {
							const translationKey = `validation.${constraintKey}`
							const translatedMessage = i18n.__(translationKey, {
								property: error.property,
								min: '1',
								max: '256',
							})

							translatedConstraints[constraintKey] = translatedMessage
						}
					}

					return translatedConstraints
				})
				.map(Object.values)
				.join(', ')

			next(
				new BadRequestError(ErrorCode.BODY_DYNAMIC_ERROR, translatedErrors, [
					{
						logCode: ErrorCode.BODY_DYNAMIC_ERROR,
						logMessage: translatedErrors,
						logData: 'oppss!! validation error',
					},
				])
			)
		}
	}
}
