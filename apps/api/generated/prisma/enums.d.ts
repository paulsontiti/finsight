export declare const TransactionType: {
    readonly CREDIT: "CREDIT";
    readonly DEBIT: "DEBIT";
    readonly TRANSFER: "TRANSFER";
};
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export declare const LedgerEntryType: {
    readonly DEBIT: "DEBIT";
    readonly CREDIT: "CREDIT";
};
export type LedgerEntryType = (typeof LedgerEntryType)[keyof typeof LedgerEntryType];
export declare const SavingsStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type SavingsStatus = (typeof SavingsStatus)[keyof typeof SavingsStatus];
export declare const Role: {
    readonly APPUSER: "APPUSER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
//# sourceMappingURL=enums.d.ts.map