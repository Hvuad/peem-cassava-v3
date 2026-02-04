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
			return c.text("Unauthorized", 401)
		}

		return c.json(user)
	})
	.post("login", zValidator("json", schema), async (c) => {
		const { username, password } = c.req.valid("json")

		const user = await c.var.db.user.findUnique({ where: { username } })

		if (!user) {
			return c.text("Invalid username", 400)
		}

		if (user.password !== password) {
			return c.text("Invalid password", 400)
		}

		c.set("user", user)

		return c.json({ message: "Login successful", data: user })
	})
