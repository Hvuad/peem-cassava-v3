import { ContentfulStatusCode } from "hono/utils/http-status"

export class BaseError extends Error {
	constructor(
		message: string,
		public statusCode: ContentfulStatusCode,
	) {
		super(message)
	}
}
