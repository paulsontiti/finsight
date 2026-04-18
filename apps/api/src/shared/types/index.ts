import type { DBUserProps } from "../../domain/entities/user.entity.js";
import type { Repository } from "../../domain/repositories/repository.js";

export type RegisterLoginUserDTO = {
  email: string;
  password: string;
};

export interface ITokenService {
  sign(payload: any): string;
}

export interface IUserRepository extends Repository<DBUserProps> {
  findByEmail(email: string): Promise<DBUserProps | null>;
}