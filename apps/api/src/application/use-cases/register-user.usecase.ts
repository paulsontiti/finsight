import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { UserAlreadyExistsError } from "../../shared/erors/domain.errors.js";

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    return this.userRepository.create(data);
  }
}