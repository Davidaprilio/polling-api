import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { createTransport } from 'nodemailer'
import HttpStatusCodes from '@/misc/HttpStatusCodes'
import { JwtTokenExpired, JwtTokenInvalid, JwtTokenIssuedAt, JwtTokenNotBefore, JwtTokenSignatureMismatched } from 'hono/utils/jwt/types'
import { HTTPException } from 'hono/http-exception'
import ClientError from '@/misc/errors/ClientError'
import { DIContainer } from '@/misc/di-container'
import { UserRepository } from '@/repositories/UserRepo'
import { AppDS } from '@/repositories/database'
import UserService from '@/services/user'
import EmailService from '@/services/mail'
import userRoute from '@/controllers/http/api/user'
import homeRoute from '@/controllers/http/web/home'
// import { showRoutes } from 'hono/dev'

const app = new Hono()

// Register Routes
const registerRoutes: Hono[] = [userRoute, homeRoute]

export interface DependencyTypes {
    userRepo: UserRepository
    userService: UserService
    mailService: EmailService
}

const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "57e3169338d50f",
        pass: "ecdf1e790a0c38",
    }
}) 

// prepare dependency injection
const userRepo = new UserRepository(AppDS.manager)
const mailService = new EmailService(transporter)
const userService = new UserService(userRepo, mailService)

const dic = new DIContainer<DependencyTypes>({
    userRepo,
    userService,
    mailService,
});
// dic.register('userRepo', UserRepository, AppDS.manager)
// dic.register('userService', UserService, dic.get('userRepo'))


// add di container to app context
app.use(async (c, next) => {
    c.set('diContainer', dic)

    // [START] log request
    const req = `[${c.req.method}] ${c.req.url}`
    console.time(req);
    await next()
    console.timeEnd(req);
    console.log('\r', c.res.status, c.res.ok);
    // [END] log request
})

// add registered routes
for (const honoRoute of registerRoutes) {
    app.route('/', honoRoute)
}
// print routes
// console.log(app.routes.map(r => `[${r.method}] ${r.path}`).join('\n'));

app.get('/*', serveStatic({ root: './public' }))

// Error Handling
app.notFound((c) => c.json({ 
    error: 'Not Found',
    message: 'Sorry, the requested resource was not found',
}, HttpStatusCodes.NOT_FOUND))

app.onError((err, ctx) => {
    if (err instanceof JwtTokenExpired) {
        return ctx.json({
            error: 'TokenExpired',
            message: 'Sorry, the token has expired',
        }, HttpStatusCodes.UNAUTHORIZED)
    } else if (err instanceof JwtTokenInvalid) {
        return ctx.json({
            error: 'TokenInvalid',
            message: 'Sorry, the token is invalid',
        }, HttpStatusCodes.UNAUTHORIZED)
    } else if (err instanceof JwtTokenNotBefore) {
        return ctx.json({
            error: 'TokenNotBefore',
            message: 'Sorry, the token is not valid yet, please try again later',
        }, HttpStatusCodes.UNAUTHORIZED)
    } else if (err instanceof JwtTokenSignatureMismatched) {
        return ctx.json({
            error: 'TokenSignatureMismatched',
            message: 'Sorry, it seems this token has been corrupted',
        })
    } else if (err instanceof JwtTokenIssuedAt) {
        return ctx.json({
            error: 'TokenIssued',
            message: 'Sorry, this token issued at is invalid',
        })
    } else if (err instanceof ClientError) {
        return ctx.json({
            error: err.name,
            code: err.data?.errorCodeRef,
            message: err.data?.message || 'client error occurred',
            data: err.data?.data
        }, err.code)
    } else if (err instanceof HTTPException) {
        return err.getResponse();
    }
    
    console.error(err.name);
    console.error(err);
    
    return ctx.json({
        error: 'Internal Server Error',
        message: 'Sorry an error occurred',
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
})

export default app