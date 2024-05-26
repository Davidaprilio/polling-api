import { User } from '@/db/schema/users';
import HttpStatusCodes from '@/misc/HttpStatusCodes';
import { verifyJwtToken } from '@/misc/utils';
import { AppJWTPayload } from '@/types/jwt';
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception';
import { JwtTokenInvalid } from 'hono/utils/jwt/types';

const JWTAuthentication = createMiddleware<{
    Variables: {
        payload: AppJWTPayload
        user: User
    }
}>(async (c, next) => {
    const bearer = c.req.header('Authorization')
    if (bearer === undefined) {
        // Response
        throw new HTTPException(401, {
            message: 'Token not found',
            res: c.json({
                error: 'Token not found',
                message: 'Sorry, the requested token was not found',
            })
        })
    } else if (!bearer.startsWith('Bearer')) {
        throw new JwtTokenInvalid(bearer)
    }
    
    const jwtToken = bearer.replace('Bearer ', '')
    const payload = await verifyJwtToken(jwtToken)
    c.set('payload', payload)

    const user = await c.var.diContainer.reg.userRepo.findById(payload.sub)
    if (user === null) {
        throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
            res: c.json({
                error: 'Unauthorized',
                message: 'Sorry, you are not authorized to access this resource',
            })
        })
    }
    c.set('user', user)

    await next()

    // rolling jwt token for next request
    // c.res.headers.set('X-Token', jwtToken)
})

export default JWTAuthentication