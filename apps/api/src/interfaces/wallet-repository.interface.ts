import type { CreateWalletProps, Wallet } from "../domain/entities/wallet.entity.js";


export interface IWalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: CreateWalletProps): Promise<Wallet>;
  update(id:string): Promise<void>
}