import { serveStatic } from "hono/bun"
import { cors } from "hono/cors"
import { hono } from "./hono"
import { api } from "./routes/api.route"
import { healthRoute } from "./routes/health.route"
import { BaseError } from "./errors/BaseError"

const app = new hono()

const route = app
	.use("/*", serveStatic({ root: "./client/dist" }))
	.use(
		"*",
		cors({
			origin: (origin) => origin,
		}),
	)
	.route("/health", healthRoute)
	.route("api", api)
	.onError((err, c) => {
		if (err instanceof BaseError) {
			return c.text(err.message, err.statusCode)
		}
		return c.text("Internal Server Error", 500)
	})

export type AppType = typeof route
export default app
