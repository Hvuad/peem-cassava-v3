import { hono } from "../../hono"
import { accountantRoute } from "./accountant.route"
import { authRoute } from "./auth.route"
import { bankRoute } from "./bank.route"
import { buyingRoute } from "./buying.route"
import { sellingRoute } from "./selling.route"
import { userRoute } from "./user.route"

export const v1 = new hono()
	.route("user", userRoute)
	.route("auth", authRoute)
	.route("selling", sellingRoute)
	.route("buying", buyingRoute)
	.route("bank", bankRoute)
	.route("accountant", accountantRoute)
