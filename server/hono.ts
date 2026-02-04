import { Hono } from "hono"
import { db } from "./db"
import { middlewareAuth } from "./middleware"
import { Errors } from "./errors"

export type AppEnv = {
	Variables: {
		db: typeof db
		users: Awaited<ReturnType<typeof db.user.findMany>>
		invalidateUser: (
			x?: Awaited<ReturnType<typeof db.user.findMany>>,
		) => Promise<Awaited<ReturnType<typeof db.user.findMany>>>
		user: Awaited<ReturnType<typeof db.user.findMany>>[number]
		branch: string
		errors: typeof Errors
	}
}
export class hono extends Hono<AppEnv> {
	constructor() {
		super()
		this.use(async (c, next) => {
			c.set("db", db)

			c.set(
				"invalidateUser",
				async (x?: Awaited<ReturnType<typeof db.user.findMany>>) => {
					const users = x || (await db.user.findMany())
					c.set("users", users)
					return users
				},
			)

			if (c.var.users === undefined) {
				const users = await db.user.findMany()
				c.set("users", users)
			}

			c.set("errors", Errors)

			await next()
		})
	}

	auth() {
		this.use(middlewareAuth)
		return this
	}
}
