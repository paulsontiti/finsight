import crypto from "crypto";
import type { IGenerator } from "../shared/types/index.js";

export class TokenGeneratorService implements IGenerator {
  generate(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
