import { BaseError } from "./BaseError"

export class Unauthorized extends BaseError {
	constructor(message: string = "Unauthorized") {
		super(message, 401)
	}
}
