type Factory<T> = (container: Container) => T;

interface ServiceDefinition<T> {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
}

export class Container {
  private services = new Map<string, ServiceDefinition<any>>();

  /**
   * Register a service
   */
  register<T>(
    name: string,
    factory: Factory<T>,
    singleton: boolean = false
  ): void {
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
  resolve<T>(name: string): T {
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
  has(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }
}