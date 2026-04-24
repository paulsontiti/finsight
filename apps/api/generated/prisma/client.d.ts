import * as runtime from "@prisma/client/runtime/library";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model PasswordResetToken
 * ///////////////////
 * ///////////////////
 */
export type PasswordResetToken = Prisma.PasswordResetTokenModel;
/**
 * Model VerificationToken
 * ///////////////////
 * ///////////////////
 */
export type VerificationToken = Prisma.VerificationTokenModel;
/**
 * Model RefreshToken
 *
 */
export type RefreshToken = Prisma.RefreshTokenModel;
/**
 * Model Wallet
 *
 */
export type Wallet = Prisma.WalletModel;
/**
 * Model Transaction
 *
 */
export type Transaction = Prisma.TransactionModel;
/**
 * Model LedgerEntry
 *
 */
export type LedgerEntry = Prisma.LedgerEntryModel;
/**
 * Model SavingsPlan
 *
 */
export type SavingsPlan = Prisma.SavingsPlanModel;
//# sourceMappingURL=client.d.ts.map