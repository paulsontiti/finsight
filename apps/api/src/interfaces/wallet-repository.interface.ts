import type { CreateWalletProps, Wallet } from "../domain/entities/wallet.entity.js";


export interface IWalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: CreateWalletProps): Promise<Wallet>;
  updateBalance(id:string,amount:number): Promise<Wallet>
}