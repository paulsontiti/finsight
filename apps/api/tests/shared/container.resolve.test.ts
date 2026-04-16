import { describe, it, expect } from "vitest";
import { Container } from "../../src/shared/container.js";

describe("DI Container - Resolve", () => {

  it("should resolve a registered service", () => {
    const container = new Container();

    container.register("service", () => ({ value: 42 }));

    const result = container.resolve<{ value: number }>("service");

    expect(result.value).toBe(42);
  });

  it("should return new instance if not singleton", () => {
    const container = new Container();

    container.register("service", () => ({ count: Math.random() }));

    const s1 = container.resolve<any>("service");
    const s2 = container.resolve<any>("service");

    expect(s1).not.toBe(s2);
  });

});