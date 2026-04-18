
import type { ITokenService, IUserRepository, RegisterLoginUserDTO } from "../../shared/types/index.js";
import type { IHashService } from "../../domain/repositories/hash-service.repository.js";
import { InvalidCredentialsError, UserNotFoundError } from "../../shared/erors/domain.errors.js";


export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
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
      user.password
    );

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    // 4. Generate token
    const token = this.tokenService.sign({
      user:{userId: user.id}
    });

    // 5. Return response
    return {
      token,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }
}