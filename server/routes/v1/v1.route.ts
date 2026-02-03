import { hono } from "../../hono"
import { userRoute } from "./user.route"

export const v1 = new hono().route("user", userRoute)
