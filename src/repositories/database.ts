import "reflect-metadata";
import ENV from "@/misc/env"
import { DataSource, DataSourceOptions } from "typeorm"

import { User } from "@/entity/User";

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