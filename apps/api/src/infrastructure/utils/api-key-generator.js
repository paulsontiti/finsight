import crypto from "crypto";
export class ApiKeyGenerator {
    static generate() {
        return crypto.randomBytes(32).toString("hex");
    }
}
//# sourceMappingURL=api-key-generator.js.map