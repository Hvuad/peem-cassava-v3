import { createMiddleware } from "hono/factory"
import type { AppEnv } from "./hono"

export const middlewareAuth = createMiddleware<AppEnv>(async (c, next) => {
	const token = c.req.header("token")
	const user = c.var.users
	if (!token) {
		return c.text("Token not found", 400)
	}

	const foundUser = user.find((u) => u.id === token)

	if (!foundUser) {
		return c.text("Unauthorized", 401)
	}

	c.set("user", foundUser)

	await next()
})
