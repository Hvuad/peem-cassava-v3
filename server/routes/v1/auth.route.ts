import { hono } from "../../hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
const schema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password must be at least 6 characters"),
})
export const authRoute = new hono()
	.get("me", async (c) => {
		const user = c.get("user")

		if (!user) {
			throw new c.var.errors.Unauthorized("Unauthorized")
		}

		return c.json(user)
	})
	.post("login", zValidator("json", schema), async (c) => {
		const { username, password } = c.req.valid("json")

		const user = await c.var.db.user.findUnique({ where: { username } })

		if (!user) {
			throw new c.var.errors.ErrorData("Invalid username")
		}

		if (user.password !== password) {
			throw new c.var.errors.ErrorData("Invalid password")
		}

		c.set("user", user)

		return c.json(user)
	})
