import { serveStatic } from "hono/bun"
import { cors } from "hono/cors"
import { hono } from "./hono"
import { api } from "./routes/api.route"
import { healthRoute } from "./routes/health.route"

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

export type AppType = typeof route
export default app
