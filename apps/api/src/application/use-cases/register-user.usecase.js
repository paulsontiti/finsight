import { CreateUserEntity, DBUserEntity, } from "../../domain/entities/user.entity.js";
import { AppError } from "../../shared/erors/base.error.js";
import { BcryptHashError, InvalidCredentialsError, UserAlreadyExistsError, } from "../../shared/erors/domain.errors.js";
import { DatabaseError } from "../../shared/erors/system.error.js";
export class RegisterUserUseCase {
    userRepository;
    hashService;
    auditLogger;
    constructor(userRepository, hashService, auditLogger) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.auditLogger = auditLogger;
    }
    async execute(data) {
        try {
            // =========================
            // 1. CREATE USER ENTITY
            // =========================
            let userEntity;
            try {
                userEntity = new CreateUserEntity({
                    email: data.email,
                    password: data.password,
                });
            }
            catch (err) {
                throw new InvalidCredentialsError();
            }
            // =========================
            // 2. CHECK IF USER EXISTS
            // =========================
            const existingUser = await this.userRepository.findByEmail(userEntity.email);
            if (existingUser) {
                throw new UserAlreadyExistsError();
            }
            // =========================
            // 3. HASH PASSWORD
            // =========================
            let hashedPassword = "";
            try {
                hashedPassword = await this.hashService.hash(userEntity?.password);
            }
            catch (err) {
                throw new BcryptHashError();
            }
            // =========================
            // 4. SAVE USER
            // =========================
            let savedUser;
            try {
                savedUser = await this.userRepository.create({
                    email: userEntity.email,
                    password: hashedPassword,
                });
            }
            catch (err) {
                throw new DatabaseError(err.message);
            }
            this.auditLogger?.logAction({
                userId: savedUser.id,
                action: "USER_REGISTERED",
            });
            // =========================
            // 6. RETURN SAFE OUTPUT
            // =========================
            // const dbUser: DBUserEntity = new DBUserEntity({
            //   email: savedUser.email,
            //   createdAt: savedUser.createdAt,
            //   updatedAt: savedUser.updatedAt,
            //   id: savedUser.id,
            //   role: savedUser.role,
            //   isVerified: false,
            // });
            const { password, ...user } = savedUser;
            return user;
        }
        catch (err) {
            if (err instanceof InvalidCredentialsError) {
                throw new InvalidCredentialsError();
            }
            if (err instanceof UserAlreadyExistsError) {
                throw new UserAlreadyExistsError();
            }
            if (err instanceof BcryptHashError) {
                throw new BcryptHashError();
            }
            throw new DatabaseError(err.message);
        }
    }
}
//# sourceMappingURL=register-user.usecase.js.map