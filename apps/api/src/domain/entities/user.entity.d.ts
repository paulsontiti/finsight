import { Role } from "../../../generated/prisma/enums.js";
import { type CreateUserProps } from "../../shared/types/index.js";
import { Entity } from "./entity.js";
export declare class DBUserEntity extends Entity {
    private _email;
    private readonly _createdAt;
    private readonly _updatedAt;
    private _role;
    private _isVerified;
    constructor(props: any);
    get role(): Role;
    get email(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
    get isVerified(): boolean;
    private validate;
    private validateAndNormalizeEmail;
    markVerified(): void;
    updateEmail(newEmail: string): void;
    equals(user: DBUserEntity): boolean;
    toJSON(): {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        isverified: boolean;
    };
}
export declare class CreateUserEntity extends Entity {
    private _email;
    private _password;
    constructor(props: CreateUserProps);
    get email(): string;
    get password(): string;
    private validate;
    private validateAndNormalizeEmail;
    private validatePassword;
    updateEmail(newEmail: string): void;
    updatePassword(newPassword: string): void;
    equals(user: CreateUserEntity): boolean;
    toJSON(): {
        id: string;
        email: string;
    };
}
//# sourceMappingURL=user.entity.d.ts.map