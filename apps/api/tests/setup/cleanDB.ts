import { beforeEach } from "vitest";
import prisma from "../../src/prisma.js";

beforeEach(async () => {
  await prisma.savingsPlan.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
});

