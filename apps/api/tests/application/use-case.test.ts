import { describe, it, expect } from "vitest";
import type { UseCase } from "../../src/application/interfaces/useCase.js";

class EchoUseCase implements UseCase<string, string> {
  async execute(input: string): Promise<string> {

    return input
  }
}

describe("UseCase Interface", () => {

  it("should execute and return result", async () => {
    const useCase = new EchoUseCase();

    const result = await useCase.execute("hello");

    expect(result).toBe("hello");
  });

  it("should handle async execution", async () => {
    const useCase = new EchoUseCase();

    const result = await useCase.execute("async");

    expect(result).toBe("async");
  });

  it("should allow different input/output types", async () => {
    class NumberUseCase implements UseCase<number, number> {
      async execute(input: number): Promise<number> {
        return input * 2;
      }
    }

    const useCase = new NumberUseCase();

    const result = await useCase.execute(5);

    expect(result).toBe(10);
  });

});