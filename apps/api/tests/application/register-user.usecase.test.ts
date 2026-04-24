import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { RegisterUserUseCase } from "../../src/application/use-cases/register-user.usecase.js";
import prisma from "../../src/prisma.js";

describe("RegisterUserUseCase", () => {
    beforeEach(async () => {
  await prisma.ledgerEntry.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
}, 100000);

afterAll(async () => {
  await prisma.$disconnect();
});

  it("should register a user", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        email:"test@mail.com",password:"hashed"
      }),
    };

    //const repo = new PrismaUserRepository();

    const hashService = {
      hash: vi.fn().mockResolvedValue("hashed-password"),
      compare: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(repo as any, hashService as any);

    await useCase.execute({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(repo.create).toHaveBeenCalled();
  });

  it("should hash password before saving", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue(null),
       create: vi.fn().mockResolvedValue({
        email:"test@mail.com",password:"hashed"
      }),
    };

    const hashService = {
      hash: vi.fn().mockResolvedValue("hashed-password"),
      compare: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(repo as any, hashService as any);

    await useCase.execute({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(hashService.hash).toHaveBeenCalledWith("Password123!");
  });

  it("should store hashed password, not raw password", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue(null),
     create: vi.fn().mockResolvedValue({
        email:"test@mail.com",password:"hashed"
      }),
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed-password")
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  await useCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });

  const savedUser = repo.create.mock.calls[0][0];

  expect(savedUser.password).toBe("hashed-password");
});

it("should throw error if user already exists", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({ id: "1" }),
     create: vi.fn().mockResolvedValue({
        email:"test@mail.com",password:"hashed"
      }),
  };

  const hashService = {
    hash: vi.fn()
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  await expect(
    useCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    })
  ).rejects.toThrow();
});

it("should not create user if email already exists", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({ id: "1" }),
     create: vi.fn().mockResolvedValue({
        email:"test@mail.com",password:"hashed"
      }),
  };

  const hashService = {
    hash: vi.fn()
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  await expect(
    useCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    })
  ).rejects.toThrow();

  expect(repo.create).not.toHaveBeenCalled();
});

it("should normalize email before saving", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue(null),
     create: vi.fn().mockResolvedValue({
        email:"test@mail.com",password:"hashed"
      }),
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed")
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  await useCase.execute({
    email: "TEST@MAIL.COM",
    password: "Password123!"
  });

  const savedUser = repo.create.mock.calls[0][0];

  expect(savedUser.email).toBe("test@mail.com");
});
it("should not expose password in response", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      toJSON: () => ({ id: "1", email: "test@mail.com" })
    })
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed")
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  const result = await useCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });

  expect(result.password).toBeUndefined();
});

it("should throw if hashing fails", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue(null),
     create: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      toJSON: () => ({ id: "1", email: "test@mail.com" })
    })
  };

  const hashService = {
    hash: vi.fn().mockRejectedValue(new Error("Hash failed"))
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  await expect(
    useCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    })
  ).rejects.toThrow();
});

it("should pass a User entity to repository", async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue(null),
     create: vi.fn().mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      toJSON: () => ({ id: "1", email: "test@mail.com" })
    })
  };

  const hashService = {
    hash: vi.fn().mockResolvedValue("hashed")
  };

  const useCase = new RegisterUserUseCase(repo as any, hashService as any);

  await useCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });

  const arg = repo.create.mock.calls[0][0];
  
  expect(arg).not.toHaveProperty("id");
  expect(arg).toHaveProperty("email");
});

});
