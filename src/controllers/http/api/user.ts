import JWTAuthentication from "@/middleware/JWTAuthentication"
import Schema from "@/validations/schema"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

const userRoute = new Hono().basePath("/api/v1/users")


userRoute.post('/signin', zValidator('json', Schema.User.SignIn), async (c) => {
    const req = c.req.valid('json')
    const { userService } = c.var.diContainer.reg

    const res = await userService.signIn({
        username: req.username,
        password: req.password,
    })

    return c.json({ 
        message: 'OK',
        data: {
            token: res.token,
            exp: res.payload.exp,
            exp_str: res.exp.format('YYYY-MM-DD HH:mm:ss')
        }
    })
})

userRoute.post('/forgot-password', zValidator('json', Schema.User.ForgotPassword), async (c) => {
    const req = c.req.valid('json')
    const userService = c.get('diContainer').get('userService')

    await userService.forgotPassword(req.email)

    return c.json({ 
        message: 'Check your email',
        data: {
            email: req.email,            
        }
    })
})

userRoute.get('/current', JWTAuthentication, async (c) => {
    const authUser = c.var.user

    return c.json({
        message: 'OK',
        data: authUser
    })
})

export default userRoute 