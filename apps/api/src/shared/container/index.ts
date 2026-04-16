

// Repositories


// Use Cases
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { UserRepository } from "../../domain/repositories/user.repository.js";
import { Container } from "../container.js";

// Shared instance
export const container = new Container();

/**
 * =========================
 * REGISTER REPOSITORIES
 * =========================
 */
container.register("userRepository", () => {
  return new UserRepository();
});

/**
 * =========================
 * REGISTER USE CASES
 * =========================
 */
container.register("registerUserUseCase", (c) => {
  const userRepo = c.resolve<UserRepository>("userRepository");

  return new RegisterUserUseCase(userRepo);
});