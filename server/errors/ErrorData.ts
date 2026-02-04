import { BaseError } from "./BaseError"

export class ErrorData extends BaseError {
	constructor(message: string = "Data Error") {
		super(message, 400)
	}
}
