import { describe, it, expect } from "vitest";
import { UserAlreadyExistsError } from "../../src/shared/erors/domain.errors.js";
import { RegisterUserUseCase } from "../../src/application/use-cases/register-user.usecase.js";
import type { IHashService, IUserRepository } from "../../src/shared/types/index.js";
import { Role } from "../../generated/prisma/enums.js";

describe("Error System", () => {

  it("should create domain error correctly", () => {
    const error = new UserAlreadyExistsError();

    expect(error.message).toBe("User already exists");
    expect(error.statusCode).toBe(409);
  });

  it("should throw error if user exists", async () => {
    const user = { id: "1",email:"test@mail.com",password:"hashed",createdAt:new Date(),updatedAt:new Date(),isVerified:false,role:Role.APPUSER }

    const repo:IUserRepository = {
        create: async(data:any) => data,
    findByEmail: async () => user,
    update:async(data:any)=>{},
    findById:async(id:string)=> user
    
  }
    const hashService:IHashService ={
        hash:async(item:string)=>"hashed",
        compare:async(a:string,b:string) => true
    }
  const useCase = new RegisterUserUseCase(repo,hashService,);

  await expect(
    useCase.execute({ email: "test@mail.com", password: "Password123!" })
  ).rejects.toThrow("User already exists");
});

});