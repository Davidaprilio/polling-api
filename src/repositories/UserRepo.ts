import { DB } from "@/repositories/database"
import Cache from "@/repositories/redis"
import { NewUser, User, users } from "@/db/schema/users"
import { IUserRepo } from "./interfaces"
import Repository from "./Repository"
import { eq } from "drizzle-orm"


export class UserRepository extends Repository<User> implements IUserRepo {
    protected table = users

    constructor(
        readonly db: DB
    ) {
        super()
    }
    
    async findById(userId: number) {
        const user = await Cache.remmember(`user:id.${userId}`, 120, async () => {
            return await this.findByOne({
                id: userId
            })
        }, {})

        return user
    }

    async findByUsername(username: string) {
        return await this.findByOne({
            username
        })
    }

    async findByEmail(email: string) {
        return await this.findByOne({
            email
        })
    }

    async updatePassword(userId: number, password: string): Promise<boolean> {
        const res = await this.db.update(users).set({
            password
        }).where(eq(users.id, userId))
        return res[0].affectedRows === 1
    }

    async createUser(user: NewUser): Promise<User> {
        const newUser = await this.db.insert(users).values(user)
        return newUser
    }
}
