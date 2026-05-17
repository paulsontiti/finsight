export class WebhookRepository {
  constructor(private prisma: any) {}

  async createEvent(data: {
    provider: string;
    eventType: string;
    reference: string;
    payload: any;
  }) {
    if(!data.eventType || !data.payload || !data.provider || !data.reference){
        throw new Error("Invalid input")
    }
    return this.prisma.webhookEvent.create({
      data: {
        ...data,
        status: "PENDING"
      }
    });
  }

  async markProcessed(id: string) {
    return this.prisma.webhookEvent.update({
      where: { id },
      data: { status: "PROCESSED" }
    });
  }

  async markFailed(id: string) {
    return this.prisma.webhookEvent.update({
      where: { id },
      data: {
        status: "FAILED",
        retryCount: { increment: 1 }
      }
    });
  }

  async findPending(limit: number) {
    return this.prisma.webhookEvent.findMany({
      where: { status: "PENDING" },
      take: limit
    });
  }
}