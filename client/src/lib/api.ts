import type { AppType } from "../../../server"
import { hc } from "hono/client"


export const api = hc<AppType>(import.meta.env.DEV ? "http://localhost:3001/" : "/")
