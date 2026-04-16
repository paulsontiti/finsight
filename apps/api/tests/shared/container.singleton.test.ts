import { describe, it, expect } from "vitest";
import { Container } from "../../src/shared/container.js";

describe("DI Container - Singleton", () => {

  it("should return same instance when singleton", () => {
    const container = new Container();

    let instanceCount = 0;

    container.register("singletonService", () => {
      instanceCount++;
      return { id: instanceCount };
    }, true); // true = singleton

    const s1 = container.resolve<any>("singletonService");
    const s2 = container.resolve<any>("singletonService");

    expect(s1).toBe(s2);
    expect(instanceCount).toBe(1);
  });

  it("should not share state between non-singletons", () => {
  const container = new Container();

  container.register("service", () => ({ count: 0 }));

  const s1 = container.resolve<any>("service");
  const s2 = container.resolve<any>("service");

  s1.count = 10;

  expect(s2.count).toBe(0);
});

});