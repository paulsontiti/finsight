export class ConfigService {
  get(key: string): string {
    const value = process.env[key];

    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const parsed = Number(value);

    if (isNaN(parsed)) {
      throw new Error(`Invalid number for env variable: ${key}`);
    }

    return parsed;
  }

  getBoolean(key: string): boolean {
    const value = this.get(key);

    return value === "true";
  }
}