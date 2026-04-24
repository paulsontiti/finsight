import { describe, it, expect, afterAll } from "vitest";
import { container } from "../../src/shared/container/index.js";

describe("DI System Integration", () => {

  afterAll(() => {
    container.clear();
  });

  it("should resolve user repository", () => {
    const repo = container.resolve("userRepository") as any;

    expect(repo).toBeDefined();
    expect(typeof repo.create).toBe("function");
  });

  it("should resolve use case with injected dependency", () => {
    const useCase = container.resolve<any>("registerUserUseCase");

    expect(useCase).toBeDefined();
    expect(typeof useCase.execute).toBe("function");
  });

});