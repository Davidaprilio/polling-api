import { env } from "@/misc/utils"
import { JWTAlgorithm, JWTAlgorithmList } from "@/types/jwt"

const ENV = {
    APP_PORT: env('APP_PORT', 3000),
    APP_HOST: env('APP_HOST', 'http://localhost'),
    APP_ENV: env('APP_ENV', 'development'), // development, production
    APP_DEBUG: env('APP_DEBUG', false),

    JWT_SECRET: env('JWT_SECRET', 'secret-key'),
    JWT_ALGORITHM: env('JWT_ALGORITHM', 'HS256') as JWTAlgorithm, // https://hono.dev/helpers/jwt#supported-algorithmtypes
    JWT_EXPIRES: env('JWT_EXPIRES', '5m'), // m, h, d, mo, y

    USE_DB_URL: env('USE_DB_URL', false),
    DB_URL: env('DATABASE_URL', 'mysql://root:root@localhost:3306/test'),
    DB_TYPE: env('DB_TYPE', 'mysql'),
    DB_HOST: env('DB_HOST', '127.0.0.1'),
    DB_PORT: env('DB_PORT', 3306),
    DB_USERNAME: env('DB_USERNAME', 'root'),
    DB_PASSWORD: env('DB_PASSWORD', ''),
    DB_DATABASE: env('DB_DATABASE', 'app'),
    DB_LOG: env('DB_LOG', false),

    REDIS_URL: env('REDIS_URL', 'redis://localhost:6379'),
}

if (!JWTAlgorithmList.includes(ENV.JWT_ALGORITHM)) {
    throw new Error("Unsupported .env JWT_ALGORITHM=" + ENV.JWT_ALGORITHM + ", choose supported Algorithms:\n" + JWTAlgorithmList.join(', '))
}

export default ENV