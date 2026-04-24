import type { IApiKeyRepository, IHashService } from "../../shared/types/index.js";
import type { UseCase } from "../interfaces/useCase.js";
export declare class ApiKeyUseCase implements UseCase<string, {
    apiKey: string;
}> {
    private readonly repo;
    private readonly hashService;
    constructor(repo: IApiKeyRepository, hashService: IHashService);
    execute(ownerId: string): Promise<{
        apiKey: string;
    }>;
}
//# sourceMappingURL=api-key.usecase.d.ts.map