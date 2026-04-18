import bcrypt from "bcrypt";
import type { IHashService } from "../types/index.js";

export class BcryptService implements IHashService {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.saltRounds);
    if (!hash || typeof hash !== "string") {
      throw new Error("Invalid hash generated");
    }
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
