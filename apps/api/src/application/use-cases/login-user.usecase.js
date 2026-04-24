import {} from "../../shared/types/index.js";
import { InvalidCredentialsError, UserNotFoundError, } from "../../shared/erors/domain.errors.js";
import { DatabaseError } from "../../shared/erors/system.error.js";
import { CreateUserEntity } from "../../domain/entities/user.entity.js";
export class LoginUserUseCase {
    userRepository;
    hashService;
    tokenService;
    refreshTokenService;
    constructor(userRepository, hashService, tokenService, refreshTokenService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.tokenService = tokenService;
        this.refreshTokenService = refreshTokenService;
    }
    async execute(data) {
        if (!data.email || !data.password) {
            throw new InvalidCredentialsError();
        }
        let loginUserEntity;
        try {
            loginUserEntity = new CreateUserEntity(data);
        }
        catch (err) {
            throw new InvalidCredentialsError();
        }
        // 1. Normalize email
        //const email = data.email.trim().toLowerCase();
        // 2. Find user
        const user = await this.userRepository.findByEmail(loginUserEntity.email);
        if (!user) {
            throw new UserNotFoundError();
        }
        // 3. Validate password
        const isValid = await this.hashService.compare(data.password, user.password);
        if (!isValid) {
            throw new InvalidCredentialsError();
        }
        // 4. Generate token
        const accessToken = this.tokenService.signAccessToken({
            userId: user.id,
            role: user.role,
        });
        const refreshToken = this.tokenService.signRefreshToken({
            userId: user.id,
            role: user.role,
        });
        try {
            await this.refreshTokenService.create(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        }
        catch (err) {
            throw new DatabaseError(err.message);
        }
        // 5. Return response
        const userApiRes = {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
        return userApiRes;
    }
}
//# sourceMappingURL=login-user.usecase.js.map