export class Container {
    services = new Map();
    /**
     * Register a service
     */
    register(name, factory, singleton = false) {
        if (this.services.has(name)) {
            throw new Error(`Service "${name}" is already registered`);
        }
        this.services.set(name, {
            factory,
            singleton
        });
    }
    /**
     * Resolve a service
     */
    resolve(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service "${name}" is not registered`);
        }
        // Return existing instance if singleton
        if (service.singleton) {
            if (!service.instance) {
                service.instance = service.factory(this);
            }
            return service.instance;
        }
        // Return new instance (transient)
        return service.factory(this);
    }
    /**
     * Check if service exists
     */
    has(name) {
        return this.services.has(name);
    }
    /**
     * Clear all services (useful for testing)
     */
    clear() {
        this.services.clear();
    }
}
//# sourceMappingURL=container.js.map