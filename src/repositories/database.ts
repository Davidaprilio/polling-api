import "reflect-metadata";
import { MySql2Database, MySql2DrizzleConfig, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import ENV from "@/misc/env"
import { DataSource, DataSourceOptions } from "typeorm"

import { User } from "@/entity/User";
import Schema from "@/db/schema";

const options: DataSourceOptions = {
    type: "mysql",
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    // url: ENV.DB_URL,
    logging: ENV.DB_LOG,
    entities: [ User ],
    migrations: [],
    migrationsTableName: "custom_migration_table",
}

export const AppDS = new DataSource(options)
// export const AppSecDS = new DataSource({...options, database: 'laravel_invitation'})

export async function initAllDS() {
    return await Promise.all([
        AppDS.initialize(),
        // AppSecDS.initialize(),
    ])
}

const createDBConfig = (options: mysql.PoolOptions) => options
export const dbConfigs = {
    default: createDBConfig({
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        user: ENV.DB_USERNAME,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_DATABASE,
    })
} as const

type KeyDBconfig = keyof typeof dbConfigs
export const dbCollection = new Map<KeyDBconfig, DBConn>()

export type DB = MySql2Database<Record<string, never>>
export type DBConn = {
    db: DB;
    conn: mysql.Pool;
}

export function createNewDBConn(name: KeyDBconfig): DBConn
export function createNewDBConn(name: string, options: mysql.PoolOptions): DBConn
export function createNewDBConn(name: KeyDBconfig|string, options?: mysql.PoolOptions): DBConn {
    if (options === undefined) {
        options = dbConfigs[name as KeyDBconfig]
        if (options === undefined) {
            throw new Error(`Database config not found: ${name}`)
        }
    }
    const poolConnection = mysql.createPool(options);
    const db = drizzle(poolConnection, {
        mode: 'default',
        // schema: Schema,
    });
    const dbConn = {
        db,
        conn: poolConnection
    }
    dbCollection.set(name as KeyDBconfig, dbConn)
    return dbConn
}
