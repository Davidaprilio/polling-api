import { User } from "@/db/schema/users";
import Repository from "./Repository";

export interface IUserRepo extends Repository<User> {
    findById(userId: number): Promise<User|null>;
    findByEmail(email: string): Promise<User|null>;
    findByUsername(username: string): Promise<User|null>;
    updatePassword(userId: number, password: string): Promise<boolean>; 
}

export interface IPollingRepo {
    findById(userId: number): Promise<User|null>;
}