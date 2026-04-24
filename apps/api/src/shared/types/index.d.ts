import type { Request } from "express";
import type { Role } from "../../../generated/prisma/enums.js";
export type EmailVerificaionProp = {
    userId: string;
    email: string;
};
export type RegisterLoginUserDTO = {
    email: string;
    password: string;
};
export interface UserPayload {
    userId: string;
    role: Role;
}
export type UserApiResponse = {
    accessToken: string;
    refreshToken: string;
    user: DBUserProps;
};
export interface ITokenService {
    signAccessToken(payload: UserPayload): string;
    signRefreshToken(payload: UserPayload): string;
    verify(token: string): UserPayload;
}
export interface IGenerator {
    generate(): string;
}
export interface IUserRepository extends Repository<CreateUserProps> {
    findByEmail(email: string): Promise<DBUserProps | null>;
    update(data: any): Promise<void>;
}
export interface AuthRequest extends Request {
    user?: {
        userId?: string;
    };
    apiClient: any;
}
export interface CreateUserProps {
    email: string;
    password: string;
}
export interface DBUserProps {
    id: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    isVerified: Boolean;
}
export interface CreateRefreshTokenProps {
    userId: string;
    hashedToken: string;
    expiresAt: Date;
}
export interface DBRefreshTokenProps {
    id: string;
    userId: string;
    hashedToken: string;
    expiresAt: Date;
    createdAt: Date;
}
export interface DBApiKeyProps {
    id: string;
    hashedKey: string;
    ownerId: string;
    createdAt: Date;
}
export interface CreateApiKeyProps {
    hashedKey: string;
    ownerId: string;
}
export interface IApiKeyRepository extends Repository<CreateApiKeyProps> {
    findByKey(key: string): Promise<CreateApiKeyProps>;
}
export interface IHashService {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
export interface Repository<T> {
    create(entity: T): Promise<T>;
    findById(id: string): Promise<T | null>;
}
export interface IRefreshTokenRepository {
    create(data: CreateRefreshTokenProps): Promise<void>;
    findByUserId(userId: string): Promise<DBRefreshTokenProps[]>;
    delete(id: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
export interface ITokenRepository {
    create(data: {
        userId: string;
        token: string;
        expiresAt: Date;
    }): Promise<void>;
    find(token: string): Promise<{
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
    } | null>;
    delete(id: string): Promise<void>;
}
export interface IMailer {
    send(data: {
        to: string;
        subject: string;
        body: string;
    }): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map