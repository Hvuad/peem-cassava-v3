import { zValidator } from "@hono/zod-validator"
import { hono } from "../../hono"
import { z } from "zod"
import { queryParamsSchema } from "../../utils/query-params.schema"
const buyingBaseSchema = z.object({
	name: z.string().min(1).max(100),
	weight: z.number().min(0),
	pay: z.number().min(0),
	extra: z.number().min(0).optional(),
	per_kg: z.number().min(0),
	percent: z.number().min(0).optional(),
	is_paid: z.boolean().optional(),
	is_extra_paid: z.boolean().optional(),
	startDate: z.string().optional(),
})

export const buyingRoute = new hono()
	.auth()
	.get("", zValidator("query", queryParamsSchema), async (c) => {
		const query = c.req.valid("query")
		const sellings = await c.var.db.selling.findMany({
			where: {
				name: query.search ? { contains: query.search } : undefined,
			},
			orderBy: query.sort
				? { [query.sort]: query.order }
				: { createdAt: "desc" },
			skip: (query.page - 1) * query.limit,
			take: query.limit,
		})
		return c.json({ message: "Buyings fetched successfully", data: sellings })
	})
	.post("", zValidator("json", buyingBaseSchema), async (c) => {
		const { name, weight, pay, per_kg, startDate } = c.req.valid("json")
		const newBuying = await c.var.db.buying.create({
			data: {
				name,
				weight,
				pay,
				per_kg,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({ message: "Buying created successfully", data: newBuying })
	})
	.put(":id", zValidator("json", buyingBaseSchema), async (c) => {
		const id = c.req.param("id")
		const { name, weight, pay, per_kg, startDate } = c.req.valid("json")
		const updatedBuying = await c.var.db.buying.update({
			where: { id },
			data: {
				name,
				weight,
				pay,
				per_kg,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({
			message: "Buying updated successfully",
			data: updatedBuying,
		})
	})
	.delete(":id", async (c) => {
		const id = c.req.param("id")
		await c.var.db.buying.delete({ where: { id } })
		return c.json({ message: "Buying deleted successfully" })
	})
