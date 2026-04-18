import type { Request } from "express";
import type { Repository } from "../../domain/repositories/repository.js";

export type RegisterLoginUserDTO = {
  email: string;
  password: string;
};

export type UserPayload = {
  user: { userId: string };
  role: Role
};
export interface ITokenService {
  sign(payload: UserPayload): string;
  verify(token: string): UserPayload;
}

export interface IUserRepository extends Repository<DBUserProps> {
  findByEmail(email: string): Promise<DBUserProps | null>;
}

export interface AuthRequest extends Request {
  user?:{userId?: string;}
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
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
  role?:Role
}