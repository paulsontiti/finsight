import { type IHashService, type ITokenService, type IUserRepository, type RegisterLoginUserDTO, type UserApiResponse } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
import type { RefreshTokenService } from "../../services/refresh-token.service.js";
export declare class LoginUserUseCase implements UseCase<RegisterLoginUserDTO, UserApiResponse> {
    private readonly userRepository;
    private readonly hashService;
    private readonly tokenService;
    private readonly refreshTokenService;
    constructor(userRepository: IUserRepository, hashService: IHashService, tokenService: ITokenService, refreshTokenService: RefreshTokenService);
    execute(data: RegisterLoginUserDTO): Promise<UserApiResponse>;
}
//# sourceMappingURL=login-user.usecase.d.ts.map