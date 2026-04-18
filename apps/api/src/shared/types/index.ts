import type { Request } from "express";
import type { Role } from "../../../generated/prisma/enums.js";

export type RegisterLoginUserDTO = {
  email: string;
  password: string;
};

export type UserPayload = {
  user: { userId: string };
  role: Role;
};
export interface ITokenService {
  sign(payload: UserPayload): string;
  verify(token: string): UserPayload;
}

export interface IUserRepository extends Repository<DBUserProps> {
  findByEmail(email: string): Promise<DBUserProps | null>;
}

export interface AuthRequest extends Request {
  user?: { userId?: string };
  apiClient: any;
}

export interface CreateUserProps {
  email: string;
  password: string;
}

export interface DBUserProps {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
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
