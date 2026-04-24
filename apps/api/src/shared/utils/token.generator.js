import crypto from "crypto";
export class TokenGenerator {
    generate() {
        return crypto.randomBytes(32).toString("hex");
    }
}
//# sourceMappingURL=token.generator.js.map