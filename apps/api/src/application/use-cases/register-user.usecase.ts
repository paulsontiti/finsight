import type { UserRepository } from "../../domain/repositories/user.repository.js";

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    return this.userRepository.create(data);
  }
}