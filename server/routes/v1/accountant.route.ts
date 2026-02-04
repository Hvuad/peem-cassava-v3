import { zValidator } from "@hono/zod-validator"
import { hono } from "../../hono"
import { z } from "zod"
import { queryParamsSchema } from "../../utils/query-params.schema"

const accountantBaseSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional().nullable(),
	startDate: z.string().optional(),
})

const accountantPriceSchema = z.union([
	z.object({
		buying: z.number().min(0),
		selling: z.number().min(0).default(0),
	}),
	z.object({
		buying: z.number().min(0).default(0),
		selling: z.number().min(0),
	}),
])

const accountantCreateSchema = accountantBaseSchema.and(accountantPriceSchema)

export const accountantRoute = new hono()
	.auth()
	.get("", zValidator("query", queryParamsSchema), async (c) => {
		const query = c.req.valid("query")
		const accountants = await c.var.db.accountant.findMany({
			where: {
				name: query.search ? { contains: query.search } : undefined,
			},
			orderBy: query.sort
				? { [query.sort]: query.order }
				: { createdAt: "desc" },
			skip: (query.page - 1) * query.limit,
			take: query.limit,
		})
		return c.json({
			message: "Accountants fetched successfully",
			data: accountants,
		})
	})
	.post("", zValidator("json", accountantCreateSchema), async (c) => {
		const { startDate, ...data } = c.req.valid("json")
		const newAccountant = await c.var.db.accountant.create({
			data: {
				...data,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({
			message: "Accountant created successfully",
			data: newAccountant,
		})
	})
	.put(":id", zValidator("json", accountantCreateSchema), async (c) => {
		const id = c.req.param("id")
		const { startDate, ...data } = c.req.valid("json")
		const updatedAccountant = await c.var.db.accountant.update({
			where: { id },
			data: {
				...data,
				createdAt: startDate ? new Date(startDate) : undefined,
				branch: c.var.branch,
			},
		})
		return c.json({
			message: "Accountant updated successfully",
			data: updatedAccountant,
		})
	})
	.delete(":id", async (c) => {
		const id = c.req.param("id")
		await c.var.db.accountant.delete({ where: { id } })
		return c.json({ message: "Accountant deleted successfully" })
	})
