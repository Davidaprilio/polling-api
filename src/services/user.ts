import ENV from "@/misc/env";
import UnauthorizedError from "@/misc/errors/UnauthorizedError";
import { getUnitValue, makeJwtToken, randomStr } from "@/misc/utils";
import { IUserRepo } from "@/repositories/interfaces";
import { Credentials } from "@/types/app";
import { AppJWTPayload } from "@/types/jwt";
import moment = require("moment");
import { IEmailService } from "./interfaces";

export default class UserService {
    constructor(
        private userRepo: IUserRepo,
        private emailService: IEmailService,
    ) {}

    async signIn(credentials: Credentials) {
        const user = await this.userRepo.findOneBy({ 
            username: credentials.username
        })

        const errorReason = 'username or password invalid'
        if (user === null) 
            throw new UnauthorizedError('User Not Found', {message: errorReason})
        if (!Bun.password.verifySync(credentials.password, user.password)) 
            throw new UnauthorizedError('Password Invalid', {message: errorReason})

        const expJwt = getUnitValue(ENV.JWT_EXPIRES)
        const expDate = moment().add(expJwt.duration, expJwt.unit)

        const payload: AppJWTPayload = {
            sub: user.id,
            exp: expDate.unix(),
        }
        const token = await makeJwtToken(payload)

        return {
            token,
            payload,
            exp: expDate,
        }
    }


    async forgotPassword(email: string) {
        const user = await this.userRepo.findOneByOrFail({
            email
        })

        const newPassword = randomStr(8, 'alphaNumericSymbol')
        user.password = Bun.password.hashSync(newPassword)
        await user.save()

        this.emailService.sendForgotPassword([email], {
            name: user.name,
            password: newPassword
        })

        return true
    }
}