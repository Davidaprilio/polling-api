import HttpStatusCodes from "../HttpStatusCodes"
import ClientError, { ClientErrorData } from "./ClientError"

export type ValidationErrorData = ClientErrorData<{
    errors: {
        [key: string]: string[]
    }
}>
export default class ValidationError extends ClientError {
    readonly data: ValidationErrorData

    constructor(
        message: string, 
        code: HttpStatusCodes = HttpStatusCodes.UNPROCESSABLE_ENTITY, 
        data: ValidationErrorData
    ) {
        super(message, code, data)
        this.name = 'Validation'
        this.data = data
    }
}
