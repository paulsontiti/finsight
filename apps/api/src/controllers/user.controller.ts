import type { Request, Response } from "express";
import { container } from "../shared/container/index.js";
import type { RegisterUserUseCase } from "../application/use-cases/register-user.usecase.js";


export class UserController {
  async register(req:Request, res:Response) {
    const useCase = container.resolve<RegisterUserUseCase>("registerUserUseCase");

    const result = await useCase.execute(req.body);

    return res.json(result);
  }
}