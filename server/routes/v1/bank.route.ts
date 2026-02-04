import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { hono } from "../../hono"
import { getOneBankQuerySchema } from "../../utils/query-params.schema"
const bankBaseSchema = z.object({
	one: z.number().default(0),
	two: z.number().default(0),
	five: z.number().default(0),
	ten: z.number().default(0),
	twenty: z.number().default(0),
	fifty: z.number().default(0),
	one_hundred: z.number().default(0),
	five_hundred: z.number().default(0),
	one_thousand: z.number().default(0),
	startDate: z.string(),
})

export const bankRoute = new hono()
	.auth()
	.get("", zValidator("query", getOneBankQuerySchema), async (c) => {
		const query = c.req.valid("query")
		const banks = await c.var.db.bank.findMany({
			where: {
				branch: c.var.branch,
				createdAt: {
					gte: new Date(query.startDate),
				},
			},
			orderBy: query.sort
				? { [query.sort]: query.order }
				: { createdAt: "desc" },
			skip: (query.page - 1) * query.limit,
			take: query.limit,
		})
		return c.json({ message: "Banks fetched successfully", data: banks })
	})
	.post("", zValidator("json", bankBaseSchema), async (c) => {
		const { startDate, ...data } = c.req.valid("json")
		const newBank = await c.var.db.bank.create({
			data: {
				...data,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({ message: "Bank created successfully", data: newBank })
	})
	.put(":id", zValidator("json", bankBaseSchema), async (c) => {
		const id = c.req.param("id")
		const { startDate, ...data } = c.req.valid("json")
		const updatedBank = await c.var.db.bank.update({
			where: { id },
			data: {
				...data,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({
			message: "Bank updated successfully",
			data: updatedBank,
		})
	})
	.delete(":id", async (c) => {
		const id = c.req.param("id")
		await c.var.db.bank.delete({ where: { id } })
		return c.json({ message: "Bank deleted successfully" })
	})
