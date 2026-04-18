import {
  type IHashService,
  type ITokenService,
  type IUserRepository,
  type RegisterLoginUserDTO,
} from "../../shared/types/index.js";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../shared/erors/domain.errors.js";
import { Role } from "../../../generated/prisma/enums.js";
import type { UseCase } from "../interfaces/useCase.js";

export class LoginUserUseCase implements UseCase<
  RegisterLoginUserDTO,
  { token: string; user: { id: string; email: string } }
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(data: RegisterLoginUserDTO) {
    // 1. Normalize email
    const email = data.email.trim().toLowerCase();

    // 2. Find user
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    // 3. Validate password
    const isValid = await this.hashService.compare(
      data.password,
      user.password,
    );

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    // 4. Generate token
    const token = this.tokenService.sign({
      user: { userId: user.id },
      role: user.role || Role.APPUSER,
    });

    // 5. Return response
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
