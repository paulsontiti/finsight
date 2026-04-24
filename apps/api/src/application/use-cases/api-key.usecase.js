import { ApiKeyGenerator } from "../../infrastructure/utils/api-key-generator.js";
export class ApiKeyUseCase {
    repo;
    hashService;
    constructor(repo, hashService) {
        this.repo = repo;
        this.hashService = hashService;
    }
    async execute(ownerId) {
        // 1. Generate raw key
        const rawKey = ApiKeyGenerator.generate();
        // 2. Hash key
        const hashedKey = await this.hashService.hash(rawKey);
        // 3. Store only hashed key
        await this.repo.create({
            hashedKey,
            ownerId
        });
        // 4. Return RAW key ONCE (important)
        return {
            apiKey: rawKey
        };
    }
}
//# sourceMappingURL=api-key.usecase.js.map