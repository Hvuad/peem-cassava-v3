import { hono } from "../hono"

export const healthRoute = new hono().get("/", async (c) => {
	return c.json({
		status: "ok",
	})
})
