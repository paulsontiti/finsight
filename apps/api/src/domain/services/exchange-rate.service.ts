export class ExchangeRateService {
  private rates: Record<string, number> = {
    USD_NGN: 1600,
    EUR_NGN: 1750,
    GBP_NGN: 2050,
  };

  // CONVERT
  convert(
    amount: number,

    from: string,

    to: string,
  ) {
    if (from === to) {
      return amount;
    }

    const pair = `${from}_${to}`;

    const reversePair = `${to}_${from}`;

    // DIRECT RATE
    if (this.rates[pair]) {
      return amount * this.rates[pair];
    }

    // REVERSE RATE
    if (this.rates[reversePair]) {
      return amount / this.rates[reversePair];
    }

    throw new Error("Exchange rate unavailable");
  }
}
