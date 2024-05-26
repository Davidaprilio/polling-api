import { and, eq } from "drizzle-orm";
import { DB } from "./database";
import { SelectedFields } from "drizzle-orm/mysql-core";

export default abstract class Repository<SchemaTable> {
    protected table: any;
    protected db: DB;

    async findByOne(fields: Partial<SchemaTable>): Promise<SchemaTable | null> 
    async findByOne<TSelection extends SelectedFields>(fields: Partial<SchemaTable>, selectFields: TSelection): Promise<SchemaTable | null> 
    async findByOne<TSelection extends SelectedFields>(fields: Partial<SchemaTable>, selectFields?: TSelection): Promise<any> {
        const data = await this.db
            .select(selectFields as TSelection)
            .from(this.table)
            .where(
                and(...Object.entries(fields).map(([key, value]) => {
                    return eq(this.table[key as keyof SchemaTable], value)
                }))
            )
            .limit(1) as SchemaTable[]
        return data[0] ? data[0] : null
    }

}
