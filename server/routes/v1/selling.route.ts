import { zValidator } from "@hono/zod-validator"
import { hono } from "../../hono"
import { z } from "zod"
import { queryParamsSchema } from "../../utils/query-params.schema"
const sellingBaseSchema = z.object({
	name: z.string().min(1).max(100),
	vehicle_no: z.string().min(1).max(100),
	weight: z.number().min(0),
	pay: z.number().min(0),
	per_kg: z.number().min(0),
	pay_type: z.enum(["cash", "transfer"]),
	startDate: z.string().optional(),
})

export const sellingRoute = new hono()
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
		return c.json({ message: "Sellings fetched successfully", data: sellings })
	})
	.post("", zValidator("json", sellingBaseSchema), async (c) => {
		const { name, vehicle_no, weight, pay, per_kg, pay_type, startDate } =
			c.req.valid("json")
		const newSelling = await c.var.db.selling.create({
			data: {
				name,
				vehicle_no,
				weight,
				pay,
				per_kg,
				pay_type,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({ message: "Selling created successfully", data: newSelling })
	})
	.put(":id", zValidator("json", sellingBaseSchema), async (c) => {
		const id = c.req.param("id")
		const { name, vehicle_no, weight, pay, per_kg, pay_type, startDate } =
			c.req.valid("json")
		const updatedSelling = await c.var.db.selling.update({
			where: { id },
			data: {
				name,
				vehicle_no,
				weight,
				pay,
				per_kg,
				pay_type,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({
			message: "Selling updated successfully",
			data: updatedSelling,
		})
	})
	.delete(":id", async (c) => {
		const id = c.req.param("id")
		await c.var.db.selling.delete({ where: { id } })
		return c.json({ message: "Selling deleted successfully" })
	})
