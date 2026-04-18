import crypto from "crypto";

export class ApiKeyGenerator {
  static generate(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}