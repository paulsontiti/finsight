export class ConfigService {
    get(key) {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
    getNumber(key) {
        const value = this.get(key);
        const parsed = Number(value);
        if (isNaN(parsed)) {
            throw new Error(`Invalid number for env variable: ${key}`);
        }
        return parsed;
    }
    getBoolean(key) {
        const value = this.get(key);
        return value === "true";
    }
}
//# sourceMappingURL=config.service.js.map