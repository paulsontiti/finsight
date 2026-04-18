import { describe, it, expect, vi } from "vitest";
import { container } from "../../src/shared/container/index.js";
import { RegisterUserUseCase } from "../../src/application/use-cases/register-user.usecase.js";
import "../setup/cleanDB.js"
import prisma from "../../src/prisma.js";

const registerUserUseCase = container.resolve<RegisterUserUseCase>("registerUserUseCase");

describe("RegisterUserUseCase", () => {

  it("should register a user", async () => {
   
    const user = await registerUserUseCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    });

    //console.log(user)
    expect(user).toBeDefined();
  });

//   it("should hash password before saving", async () => {

//   const user = await registerUserUseCase.execute({
//     email: "test@mail.com",
//     password: "Password123!"
//   });

//   expect(hashServiceRepository.hash).toHaveBeenCalled();
// });

// it("should store hashed password, not raw password", async () => {
//   const repo = {
//     findByEmail: vi.fn().mockResolvedValue(null),
//     create: vi.fn()
//   };

//   await registerUserUseCase.execute({
//     email: "test@mail.com",
//     password: "Password123!"
//   });

//   const savedUser = repo.create.mock.calls[0]?.[0];

//   expect(savedUser.password).toBe("hashed-password");
// });

it("should throw error if user already exists", async () => {
 await registerUserUseCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    })
  await expect(
    registerUserUseCase.execute({
      email: "test@mail.com",
      password: "Password123!"
    })
  ).rejects.toThrow();
});

// it("should not create user if email already exists", async () => {
//   const repo = {
//     findByEmail: vi.fn().mockResolvedValue({ id: "1" }),
//     create: vi.fn()
//   };

//   await expect(
//     registerUserUseCase.execute({
//       email: "test@mail.com",
//       password: "Password123!"
//     })
//   ).rejects.toThrow();

//   expect(repo.create).not.toHaveBeenCalled();
// });

it("should normalize email before saving", async () => {


  const savedUser = await registerUserUseCase.execute({
    email: "TEST@MAIL.COM",
    password: "Password123!"
  });

  expect(savedUser.email).toBe("test@mail.com");
});

it("should not expose password in response", async () => {
await prisma.user.deleteMany();

  const result = await registerUserUseCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });
  expect(result).not.toHaveProperty("password");
});

it("should pass a User entity to repository", async () => {
  

  const savedUser = await registerUserUseCase.execute({
    email: "test@mail.com",
    password: "Password123!"
  });
  

  expect(savedUser).toHaveProperty("id");
  expect(savedUser).toHaveProperty("email");
  expect(savedUser).toHaveProperty("role");
});

});