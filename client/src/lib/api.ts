import { hc } from "hono/client"
import type { AppType } from "../../../server"
import { toast } from "react-toastify"
export type { InferResponseType } from "hono/client"
const throwingFetcher = async (
	input: RequestInfo | URL,
	init?: RequestInit,
) => {
	const response = await fetch(input, init)

	if (!response.ok) {
		// response.ok is true for 200-299 status codes
		const errorBody = await response.text() // or response.json() if you return JSON errors
		if (response.status === 400) {
			toast.warn(errorBody)
		} else {
			toast.error(errorBody)
		}
		throw new Error(errorBody)
	}

	return response
}

// Pass the custom fetcher to the Hono client
export const api = hc<AppType>(
	import.meta.env.DEV ? "http://localhost:3001/" : "/",
	{
		fetch: throwingFetcher,
	},
)
