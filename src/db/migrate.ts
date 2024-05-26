import ENV from '@/misc/env';
import { rootPath } from '@/misc/utils';
import { createNewDBConn } from '@/repositories/database';
import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';

if (ENV.IS_PROD) {
    console.log([
        "==================== Production Mode ================",
        "You are sure running migration in production mode?",
        "This script will migrate the database",
        "if you are not sure, press Ctrl+C or Just hit Enter",
        "if want to continue, press y and then hit Enter",
        "======================================================"
    ].join('\n'));
    
    
    const ans = confirm('Are you sure you want to migrate the database?')
    if (!ans) {
        console.log("Migration cancelled");
        console.log("Fiuhhh..., I'm glad I could remind you!");        
        process.exit(0)
    }
}

console.log("Preparing database migration...");
const {db, conn } = createNewDBConn('default')

// This will run migrations on the database, skipping the ones already applied
console.log("Migrating database...");
await migrate(db, { 
    migrationsFolder: rootPath('/drizzle'),
    migrationsTable: 'table_migrations',
});

// Don't forget to close the connection, otherwise the script will hang
await conn.end();
console.log("Database migrated successfully");
process.exit(0)
