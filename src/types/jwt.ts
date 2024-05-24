import { JWTPayload as JWTPayloadBase } from "hono/utils/jwt/types";

export type AppJWTPayload = JWTPayloadBase & {
    sub: number // User ID
}

export const JWTAlgorithmList = ["HS256","HS384","HS512","RS256","RS384","RS512","PS256","PS384","PS512","ES256","ES384","ES512","EdDSA"] as const
export type JWTAlgorithm = typeof JWTAlgorithmList[number]
