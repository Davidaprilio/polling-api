import { DIContainer } from "@/misc/di-container";
import ENV from "@/misc/env";
import { DependencyTypes } from "@/server";

declare module 'hono' {
    interface ContextVariableMap {
        diContainer: DIContainer<DependencyTypes>
    }
}

export type AsyncVoidFunction = () => Promise<void>;

export type AppEnv = typeof ENV

export interface Credentials {
    username: string
    password: string
}