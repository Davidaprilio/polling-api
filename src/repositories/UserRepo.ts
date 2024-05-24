import { AppDS } from "@/repositories/database"
import { User } from "@/entity/User"
import Cache from "@/repositories/redis"
import { IUserRepo } from "./interfaces"
import { EntityManager, Repository } from "typeorm"


export class UserRepository extends Repository<User> implements IUserRepo {
    constructor(manager: EntityManager) {
        super(User, manager)
    }
    
    async findById(userId: number) {
        const user = await Cache.remmember(`user:id.${userId}`, 120, async () => {
            return await this.findOneBy({id: userId})
        }, User)
        return user
    }
}

export const UserRepo = new UserRepository(AppDS.manager)
