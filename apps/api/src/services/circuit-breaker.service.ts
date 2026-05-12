export class CircuitBreakerService {
  private failures = 0;

  private isOpen = false;

  async execute(fn: Function) {
    if (this.isOpen) {
      throw new Error(
        "Circuit breaker open",
      );
    }

    try {
      const result = await fn();

      this.failures = 0;

      return result;
    } catch (error) {
      this.failures++;

      if (this.failures >= 5) {
        this.isOpen = true;
      }

      throw error;
    }
  }

  reset() {
    this.failures = 0;

    this.isOpen = false;
  }
}