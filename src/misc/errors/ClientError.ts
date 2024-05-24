import HttpStatusCodes from "../HttpStatusCodes"

export type ClientErrorData<AddedType> = {
    message?: string
    errorCodeRef?: number
    [key: string]: any
} & AddedType

export default class ClientError extends Error {
    readonly code: HttpStatusCodes
    readonly data: ClientErrorData<{}>

    constructor(
        message: string, code: HttpStatusCodes = 400, data: ClientErrorData<{}> = {}) {
        super(message)

        this.name = 'ClientError'
        this.code = code
        this.data = data
    }
}
