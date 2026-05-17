import type { Wallet } from "../../../generated/prisma/client.js";
import type { CreateWalletProps } from "../entities/wallet.entity.js";
import type { IRepository } from "./irepository.interface.js";

export interface IWalletRepository extends IRepository<CreateWalletProps,Wallet>{
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: CreateWalletProps): Promise<Wallet>;
  updateBalance(id: string, amount: number): Promise<Wallet>;
  safeDebit(walletId:string,amount:number,version:number): Promise<any>
  updateBalanceWithVersion(walletId:string,version:number,amount:number): Promise<any>
}
