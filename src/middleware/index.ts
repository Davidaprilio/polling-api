import { Hono } from "hono";
import JWTAuthentication from "@/middleware/JWTAuthentication";
import { poweredBy } from 'hono/powered-by'

const appMiddleware = new Hono()

appMiddleware.use(JWTAuthentication)

export default appMiddleware