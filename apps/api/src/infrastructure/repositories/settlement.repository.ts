import { PrismaClient } from "@prisma/client";

export class PrismaSettlementRepository {
  constructor(
    private prisma: PrismaClient,
  ) {}

  async create(data: any) {
    return this.prisma.settlement.create({
      data,
    });
  }

  async findPending() {
    return this.prisma.settlement.findMany({
      where: {
        status: "PENDING",
      },
    });
  }

  async updateStatus(
    settlementId: string,
    status: string,
  ) {
    return this.prisma.settlement.update({
      where: {
        id: settlementId,
      },

      data: {
        status,

        settledAt:
          status === "SUCCESS"
            ? new Date()
            : null,
      },
    });
  }

  async findByReference(
    reference: string,
  ) {
    return this.prisma.settlement.findUnique({
      where: {
        reference,
      },
    });
  }
}