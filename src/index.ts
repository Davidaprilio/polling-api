import ENV from '@/misc/env'
import app from '@/server'
import {getRuntimeKey} from 'hono/adapter'
import { redisClient } from '@/repositories/redis'

async function main() {
    let runtime: string 
    switch (getRuntimeKey()) {
        case 'workerd':runtime = 'cloudflare workers' 
            break;
        case 'edge-light': runtime = 'vercel edge light function'
            break;
        default: runtime = getRuntimeKey()
            break;
    }
    console.log("Running with", runtime);

    try {
        await redisClient.connect()
    } catch (error) {
        console.error("Error during Redis connection");
        console.error(error);
        return process.exit(1)
    }    

    Bun.serve({
        port: ENV.APP_PORT,
        fetch: app.fetch,
    })
    console.log(`Listening on port ${ENV.APP_HOST}:${ENV.APP_PORT}`);    
}
main()
