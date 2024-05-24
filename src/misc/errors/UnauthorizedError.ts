import HttpStatusCodes from "@/misc/HttpStatusCodes";
import ClientError, { ClientErrorData } from "./ClientError";

export default class UnauthorizedError extends ClientError {
    constructor(
        message: string,
        data: ClientErrorData<{}>,
        code: HttpStatusCodes = HttpStatusCodes.UNAUTHORIZED
    ) {
        super(message, code, data)
        this.name = 'Unauthorized'
    }
}