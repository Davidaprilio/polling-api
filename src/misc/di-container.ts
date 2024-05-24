// import { DependencyTypes } from "@/server";

export class DIContainer<DependencyTypes>{
    private registry = new Map<
        keyof DependencyTypes,
        DependencyTypes[keyof DependencyTypes]
    >();

    // constructor() {
    //     return new Proxy(this, {
    //         get(target, prop, receiver) {
    //             console.log('dinamic get', { prop });
    //             // find property inside registry first
    //             if (typeof prop === "string" && target.registry.has(prop as keyof DependencyTypes)) {
    //                 return target.get(prop as keyof DependencyTypes);
    //             }
    //             // if not found, get from this class
    //             return Reflect.get(target, prop, receiver);
    //         },
    //     });
    // }

    constructor(dependencies: DependencyTypes) {
        for (const key in dependencies) {
            this.registry.set(key, dependencies[key]);
        }
    }

    register<Key extends keyof DependencyTypes, Args extends unknown[]>(
        key: Key,
        Constructor: new (...args: Args) => DependencyTypes[Key],
        ...args: Args
    ): void {
        const instance = new Constructor(...args);
        this.registry.set(key, instance);
    }

    get<K extends keyof DependencyTypes>(key: K): DependencyTypes[K] {
        const instance = this.registry.get(key);
        if (!instance) {
            throw new Error(`No instance found for key: ${String(key)}`);
        }
        return instance as DependencyTypes[K];
    }

    /**
     * Dynamic get property from registry key Map
     * 
     */
    get reg(): DependencyTypes {
        return new Proxy(this, {
            get(target, prop) {
                return target.get(prop as keyof DependencyTypes);
            },
        }) as any as DependencyTypes
    }
}
