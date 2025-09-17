import { ErrorLogField } from '../../interfaces/error.log.field'

export abstract class CustomError extends Error {
	abstract statusCode: number

	constructor(message: string) {
		super(message)
		Object.setPrototypeOf(this, CustomError.prototype)
	}

	abstract serializeErrors(): {
		code: string
		message: string
		data: null
		log: ErrorLogField[]
	}
}
