import crypto from "crypto";
import type { IGenerator } from "../types/index.js";

export class TokenGenerator implements IGenerator{
  generate(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}