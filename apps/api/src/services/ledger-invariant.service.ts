import type { LedgerEntry } from "../domain/entities/ledger-entry.entity.js";

export class LedgerInvariantService {
  validateDebitCreditEquality(entries: LedgerEntry[]) {
    const debitTotal = entries
      .filter((e) => e.type === "DEBIT")
      .reduce((sum, e) => sum + e.amount, 0);

    const creditTotal = entries
      .filter((e) => e.type === "CREDIT")
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      valid: debitTotal === creditTotal,
      debitTotal,
      creditTotal,
      difference: Math.abs(debitTotal - creditTotal)
    };
  }
}