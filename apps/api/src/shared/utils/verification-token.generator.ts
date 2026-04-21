import crypto from "crypto";

export class VerificationTokenGenerator {
  generate(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}