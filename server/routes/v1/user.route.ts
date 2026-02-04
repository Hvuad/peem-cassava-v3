import { hono } from "../../hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
const schema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password must be at least 6 characters"),
	country: z.enum(["thai", "laos"]).default("thai"),
})
export const userRoute = new hono()
	.auth()
	.get(":id", async (c) => {
		const id = c.req.param("id")
		const user = await c.var.db.user.findUnique({ where: { id } })
		return c.json({ message: "User fetched successfully", data: user })
	})
	.post("/", zValidator("json", schema), async (c) => {
		const { username, password } = c.req.valid("json")
		const existingUser = await c.var.db.user.findUnique({ where: { username } })
		if (existingUser) {
			return c.text("Username already exists", 400)
		}
		const newUser = await c.var.db.user.create({
			data: {
				username,
				password,
			},
		})
		return c.json({ message: "User created successfully", data: newUser })
	})
	.put(":id", zValidator("json", schema.partial()), async (c) => {
		const id = c.req.param("id")
		const { username, password } = c.req.valid("json")
		const updatedUser = await c.var.db.user.update({
			where: { id },
			data: {
				username,
				password,
			},
		})
		return c.json({ message: "User updated successfully", data: updatedUser })
	})
	.delete(":id", async (c) => {
		const id = c.req.param("id")
		await c.var.db.user.delete({ where: { id } })
		return c.json({ message: "User deleted successfully" })
	})
