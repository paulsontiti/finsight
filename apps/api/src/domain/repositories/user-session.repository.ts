import { PrismaClient } from "@prisma/client";
import type { UserSession } from "../../../generated/prisma/browser.js";

export class PrismaUserSessionRepository {
  constructor(private prisma: PrismaClient) {}

  // 🆕 CREATE SESSION
  async create(data: {
    userId: string;
    deviceId: string;
    ip: string;
    userAgent?: string;
    expiresAt?: Date;
    lastActiveAt?: Date;
  }) {
    return this.prisma.userSession.create({
      data: {
        userId: data.userId,
        deviceId: data.deviceId,
        ip: data.ip,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
        lastActiveAt:
          data.lastActiveAt ?? new Date(),
      },
    });
  }

  // 🔍 FIND SESSION BY USER + DEVICE
  async findByUserDevice(
    userId: string,
    deviceId: string,
  ) {
    return this.prisma.userSession.findFirst({
      where: {
        userId,
        deviceId,
      },
    });
  }

  // 🔍 FIND SESSION BY ID
  async findById(id: string) {
    return this.prisma.userSession.findUnique({
      where: { id },
    });
  }

  // 👤 GET ALL USER SESSIONS
  async findByUserId(userId: string) {
    return this.prisma.userSession.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // 🌍 GET KNOWN DEVICES
  async getKnownDevices(userId: string) {
    const sessions =
      await this.prisma.userSession.findMany({
        where: {
          userId,
        },

        select: {
          deviceId: true,
        },

        distinct: ["deviceId"],
      });

    return sessions
      .map((s:UserSession) => s.deviceId)
      .filter(Boolean);
  }

  // 🌍 GET KNOWN IPS
  async getKnownIps(userId: string) {
    const sessions =
      await this.prisma.userSession.findMany({
        where: {
          userId,
        },

        select: {
          ip: true,
        },

        distinct: ["ip"],
      });

    return sessions
      .map((s:UserSession) => s.ip)
      .filter(Boolean);
  }

  // 🔄 UPDATE LAST ACTIVE TIME
  async updateLastActive(id: string) {
    return this.prisma.userSession.update({
      where: {
        id,
      },

      data: {
        lastActiveAt: new Date(),
      },
    });
  }

  // 🔐 DEACTIVATE SESSION
  async deactivateSession(id: string) {
    return this.prisma.userSession.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });
  }

  // 🚪 LOGOUT ALL USER SESSIONS
  async deactivateAllUserSessions(
    userId: string,
  ) {
    return this.prisma.userSession.updateMany({
      where: {
        userId,
      },

      data: {
        isActive: false,
      },
    });
  }

  // 🧹 DELETE EXPIRED SESSIONS
  async deleteExpiredSessions() {
    return this.prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  }

  // 🚨 DETECT RECENT LOGIN VELOCITY
  async countRecentSessions(
    userId: string,
    seconds: number,
  ) {
    const since = new Date(
      Date.now() - seconds * 1000,
    );

    return this.prisma.userSession.count({
      where: {
        userId,

        createdAt: {
          gte: since,
        },
      },
    });
  }
}