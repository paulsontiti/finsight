import type { IApiKeyRepository, IHashService } from "../../shared/types/index.js";
import { ApiKeyGenerator } from "../../infrastructure/utils/api-key-generator.js";
import type { UseCase } from "../interfaces/useCase.js";




export class ApiKeyUseCase implements UseCase<string,{apiKey:string}> {
  constructor(
    private readonly repo: IApiKeyRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(ownerId: string) {
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