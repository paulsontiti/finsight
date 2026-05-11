import type { UserSession } from "../../../generated/prisma/client.js";
import type { PrismaUserSessionRepository } from "../../domain/repositories/user-session.repository.js";
import type { UseCase } from "../interfaces/useCase.js";

export interface SaveUserSessionInput {
  userId: string;
  deviceId: string;
  ip: string;
  userAgent?: string;
}

export class SaveUserSessionUseCase implements UseCase<SaveUserSessionInput,UserSession>{
  constructor(private userSessionRepo: PrismaUserSessionRepository) {}

  async execute(input: SaveUserSessionInput) {
    const existingSession =
      await this.userSessionRepo.findByUserDevice(
        input.userId,
        input.deviceId,
      );

    // 🧠 CASE 1: SESSION EXISTS → UPDATE LAST ACTIVE
    if (existingSession) {
      return this.userSessionRepo.updateLastActive(
        existingSession.id,
      );
    }

    // 🆕 CASE 2: NEW DEVICE → CREATE SESSION
    return this.userSessionRepo.create({
      userId: input.userId,
      deviceId: input.deviceId,
      ip: input.ip,
      userAgent: input.userAgent as string,
      lastActiveAt: new Date(),
    });
  }
}