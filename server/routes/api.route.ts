import { hono } from "../hono"
import { healthRoute } from "./health.route"

import { v1 } from "./v1/v1.route"

export const api = new hono().route("health", healthRoute).route("v1", v1)
