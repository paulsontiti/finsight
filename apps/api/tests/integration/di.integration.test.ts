import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { container } from "../../src/shared/container/index.js";
import { UserRepository } from "../../src/domain/repositories/user.repository.js";
import { RegisterUserUseCase } from "../../src/application/use-cases/register-user.usecase.js";

describe("DI System Integration", () => {
  afterAll(() => {
    container.clear();
  });

  it("should resolve user repository", () => {
    
    // container.register("userRepository", () => {
    //   return new UserRepository();
    // });

    const repo = container.resolve<UserRepository>("userRepository");

    expect(repo).toBeDefined();
    expect(typeof repo.create).toBe("function");
  });

  it("should resolve use case with injected dependency", () => {
    // container.register("registerUserUseCase", (c) => {
    //   const userRepo = c.resolve<UserRepository>("userRepository");

    //   return new RegisterUserUseCase(userRepo);
    // });
    const useCase = container.resolve<RegisterUserUseCase>(
      "registerUserUseCase",
    );

    expect(useCase).toBeDefined();
    expect(typeof useCase.execute).toBe("function");
  });
});
