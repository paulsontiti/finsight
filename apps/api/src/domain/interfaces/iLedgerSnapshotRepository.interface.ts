import type { LedgerSnapshot } from "../../../generated/prisma/client.js";
import type { CreateLedgerSnapshotDTO } from "../../application/dto/createLedgerSnapshotDTO.js";
import type { IRepository } from "./irepository.interface.js";

export interface ILedgerSnapshotRepository extends IRepository<
  CreateLedgerSnapshotDTO,
  LedgerSnapshot
> {
  findLatestByWallet(walletId: string): Promise<LedgerSnapshot | null>;

  findByWallet(walletId: string): Promise<LedgerSnapshot[]>;
}
