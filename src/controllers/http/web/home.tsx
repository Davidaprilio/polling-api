import buildRawHTML from "@/resources/views/html";
import ForgotPasswordMailPage from "@/resources/views/mails/pages/forgot-password";
import { Hono } from "hono";
import { jsx } from "hono/jsx";

const homeRoute = new Hono()

homeRoute.get('/', (c) => {
    const data = ['a', 'b', 'c']
    const content = jsx(ForgotPasswordMailPage, { hello: 'world', data })
    return c.html(
      buildRawHTML(content)
    )
})

export default homeRoute