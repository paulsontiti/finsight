import type { IHashService } from "../types/index.js";
export declare class BcryptService implements IHashService {
    private readonly saltRounds;
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=bcrypt.service.d.ts.map