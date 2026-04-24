import bcrypt from "bcrypt";
export class BcryptService {
    saltRounds = 10;
    async hash(password) {
        const hash = await bcrypt.hash(password, this.saltRounds);
        if (!hash || typeof hash !== "string") {
            throw new Error("Invalid hash generated");
        }
        return hash;
    }
    async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
//# sourceMappingURL=bcrypt.service.js.map