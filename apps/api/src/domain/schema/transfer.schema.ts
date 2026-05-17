import { z } from "zod";

export const transferSchema =
  z.object({
    walletId:
      z.string(),

    receiverWalletId:
      z.string(),

    amount:
      z.number().positive(),

    reference:
      z.string(),
  });