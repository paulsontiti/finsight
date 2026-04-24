import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
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
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options?: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
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
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
       * @example
       * ```
       * const [george, bob, alice] = await prisma.$transaction([
       *   prisma.user.create({ data: { name: 'George' } }),
       *   prisma.user.create({ data: { name: 'Bob' } }),
       *   prisma.user.create({ data: { name: 'Alice' } }),
       * ])
       * ```
       *
       * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
       */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
    }): runtime.Types.Utils.JsPromise<R>;
    /**
     * Executes a raw MongoDB command and returns the result of it.
     * @example
     * ```
     * const user = await prisma.$runCommandRaw({
     *   aggregate: 'User',
     *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
     *   explain: false,
     * })
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PasswordResetTokens
      * const passwordResetTokens = await prisma.passwordResetToken.findMany()
      * ```
      */
    get passwordResetToken(): Prisma.PasswordResetTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VerificationTokens
      * const verificationTokens = await prisma.verificationToken.findMany()
      * ```
      */
    get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RefreshTokens
      * const refreshTokens = await prisma.refreshToken.findMany()
      * ```
      */
    get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.wallet`: Exposes CRUD operations for the **Wallet** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Wallets
      * const wallets = await prisma.wallet.findMany()
      * ```
      */
    get wallet(): Prisma.WalletDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Transactions
      * const transactions = await prisma.transaction.findMany()
      * ```
      */
    get transaction(): Prisma.TransactionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.ledgerEntry`: Exposes CRUD operations for the **LedgerEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LedgerEntries
      * const ledgerEntries = await prisma.ledgerEntry.findMany()
      * ```
      */
    get ledgerEntry(): Prisma.LedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.savingsPlan`: Exposes CRUD operations for the **SavingsPlan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SavingsPlans
      * const savingsPlans = await prisma.savingsPlan.findMany()
      * ```
      */
    get savingsPlan(): Prisma.SavingsPlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(dirname: string): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map