import type { Request } from "express";
import type { DBUserProps } from "../../domain/entities/user.entity.js";
import type { Repository } from "../../domain/repositories/repository.js";

export type RegisterLoginUserDTO = {
  email: string;
  password: string;
};

export type UserPayload = {
  user: { userId: string };
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
