import ENV from '@/misc/env';
import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis';

const redisOption: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>  = {
    url: ENV.REDIS_URL,
}
export const redisClient = createClient(redisOption);


async function remmember(key: string, ttl: number, value: () => Promise<string>): Promise<string>
async function remmember(key: string, ttl: number, value: () => Promise<number>): Promise<number>
async function remmember<T>(key: string, ttl: number, value: () => Promise<T>, as: new () => T): Promise<T>
async function remmember<T>(key: string, ttl: number, value: () => Promise<T>, as: {}): Promise<object|null>
async function remmember<T>(key: string, ttl: number, value: () => Promise<T>, as?: any): Promise<any> {
    let val = await redisClient.get(key) as (T|string|null)
    if (val === null) {
        val = await value()

        let setVal = ''
        if (typeof val === 'object') {
            setVal = JSON.stringify(val)
        }
        if (val === null) {
            setVal = "<null>"
        }
        await redisClient.set(key, setVal as string, {
            EX: ttl
        })

    } else {
        if (val === '<null>') return null

        if (as) {
            val = JSON.parse(val as string) as T
            // make json object reflectable by prototype / rebuild to object class
            val = Object.create(as.prototype, Object.getOwnPropertyDescriptors(val)) as T
        }
    }

    return val
}

const Cache = {
    remmember,
    ...redisClient
}

export default Cache
