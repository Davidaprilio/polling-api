import { User } from "@/entity/User";
import { Repository } from "typeorm";

export interface IUserRepo extends Repository<User>{
    findById(userId: number): Promise<User|null>;
}

export interface IPollingRepo extends Repository<User>{
    findById(userId: number): Promise<User|null>;
}