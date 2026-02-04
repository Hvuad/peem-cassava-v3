import { z } from "zod"

/**
 * Reusable query params schema for list/search endpoints
 */

const baseQueryParamsSchema = z.object({
	limit: z.coerce.number().int().positive().max(100).default(10),
	page: z.coerce.number().int().positive().default(1),
	sort: z.string().optional(),
	order: z.enum(["asc", "desc"]).default("desc"),
	branch: z.string().max(100).optional(),
})
export const queryParamsSchema = z
	.object({
		search: z.string().optional(),
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),
	})
	.and(baseQueryParamsSchema)

export const getOneBankQuerySchema = queryParamsSchema.and(
	z.object({
		startDate: z.string(),
	}),
)

export type QueryParams = z.infer<typeof queryParamsSchema>
