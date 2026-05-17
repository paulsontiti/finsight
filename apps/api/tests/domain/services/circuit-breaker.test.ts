import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { CircuitBreakerService } from "../../src/services/circuit-breaker.service";

describe(
  "CircuitBreakerService",
  () => {
    let service: CircuitBreakerService;

    beforeEach(() => {
      service =
        new CircuitBreakerService();
    });

    // ✅ SUCCESS
    it(
      "should execute successfully",
      async () => {
        const result =
          await service.execute(
            async () => "success",
          );

        expect(result).toBe(
          "success",
        );
      },
    );

    // 🚨 FAILURE COUNT
    it(
      "should increment failure count",
      async () => {
        await expect(
          service.execute(
            async () => {
              throw new Error(
                "API failed",
              );
            },
          ),
        ).rejects.toThrow();

        expect(
          service["failures"],
        ).toBe(1);
      },
    );

    // 🚨 OPEN CIRCUIT
    it(
      "should open circuit after repeated failures",
      async () => {
        for (
          let i = 0;
          i < 5;
          i++
        ) {
          try {
            await service.execute(
              async () => {
                throw new Error(
                  "Failure",
                );
              },
            );
          } catch {}
        }

        await expect(
          service.execute(
            async () => "ok",
          ),
        ).rejects.toThrow(
          "Circuit breaker open",
        );
      },
    );

    // ✅ RESET
    it(
      "should reset circuit breaker",
      async () => {
        service.reset();

        expect(
          service["failures"],
        ).toBe(0);

        expect(
          service["isOpen"],
        ).toBe(false);
      },
    );
  },
);