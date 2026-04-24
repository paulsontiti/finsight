import type { CreateUserProps, DBUserProps, IUserRepository } from "../../shared/types/index.js";
export declare class PrismaUserRepository implements IUserRepository {
    update(data: any): Promise<void>;
    create(data: CreateUserProps): Promise<any>;
    findById(id: string): Promise<any | null>;
    findByEmail(email: string): Promise<DBUserProps | null>;
}
//# sourceMappingURL=user.repository.d.ts.map