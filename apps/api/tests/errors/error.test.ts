import { describe, it, expect } from "vitest";
import { UserAlreadyExistsError } from "../../src/shared/erors/domain.errors.js";
import { RegisterUserUseCase } from "../../src/application/use-cases/register-user.usecase.js";
import prisma from "../../src/prisma.js";
import { AuditLogger } from "../../src/shared/logger/audit.logger.js";
describe("Error System", () => {
  it("should create domain error correctly", () => {
    const error = new UserAlreadyExistsError();

    expect(error.message).toBe("User already exists");
    expect(error.statusCode).toBe(409);
  });

  it("should throw error if user exists", async () => {
    const useCase = new RegisterUserUseCase({
      findByEmail: async (email:string) => ({
        id: "1",
        email: "test@mail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: "123",
      }),
      create: async () => ({
        id: "1",
        email: "test@mail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: "123",
      }),
      findById: async () => null,
    },new AuditLogger());

    await expect(
      useCase.execute({ email: "test@mail.com", password: "123" }),
    ).rejects.toThrow("User already exists");
  });
});
