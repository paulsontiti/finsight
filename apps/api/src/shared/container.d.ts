type Factory<T> = (container: Container) => T;
export declare class Container {
    private services;
    /**
     * Register a service
     */
    register<T>(name: string, factory: Factory<T>, singleton?: boolean): void;
    /**
     * Resolve a service
     */
    resolve<T>(name: string): T;
    /**
     * Check if service exists
     */
    has(name: string): boolean;
    /**
     * Clear all services (useful for testing)
     */
    clear(): void;
}
export {};
//# sourceMappingURL=container.d.ts.map