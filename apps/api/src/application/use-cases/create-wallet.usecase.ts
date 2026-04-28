import { CreateWallet, Wallet } from "../../domain/entities/wallet.entity.js";
import type { IWalletRepository } from "../../interfaces/wallet-repository.interface.js";
import {
  InvalidCredentialsError,
  UserAlreadyHasWalletError,
} from "../../shared/erors/domain.errors.js";
import { DatabaseError } from "../../shared/erors/system.error.js";
import type { UseCase } from "../interfaces/useCase.js";

export class CreateWalletUseCase implements UseCase<CreateWallet,Wallet>{
  constructor(private readonly walletRepo: IWalletRepository) {}

  async execute(input: { userId: string; currency: string }) {
    try {
      const existingWallet = await this.walletRepo.findByUserId(input.userId);

      if (existingWallet) {
        throw new UserAlreadyHasWalletError()
        //Error("User already has a wallet");
      }

      try {
        const wallet = CreateWallet.create({
          userId: input.userId,
          currency: input.currency,
        });

        try {
          const savedWallet = await this.walletRepo.create(wallet);

          return savedWallet;
        } catch (err: any) {
          throw new DatabaseError(err.message);
        }
      } catch (err) {
        throw new InvalidCredentialsError();
      }
    } catch (err: any) {
      if (err instanceof UserAlreadyHasWalletError) {
        throw new UserAlreadyHasWalletError();
      }

      if (err instanceof InvalidCredentialsError) {
        throw new InvalidCredentialsError(err.message);
      }
        if (err instanceof DatabaseError) {
        throw new DatabaseError(err.message);
      }

      console.log(err)
      throw new Error(err.message);
    }
    // return {
    //   id: savedWallet.id,
    //   userId: savedWallet.userId,
    //   currency: savedWallet.currency,
    //   status: savedWallet.status
    // };
  }
}
