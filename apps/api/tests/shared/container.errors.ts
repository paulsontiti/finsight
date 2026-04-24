import { describe, it, expect } from "vitest";
import { Container } from "../../src/shared/container.js";

describe("DI Container - Errors", () => {
  it("should throw error if service not registered", () => {
    const container = new Container();

    expect(() => {
      container.resolve("unknown");
    }).toThrow();
  });

  it("should not allow duplicate registration (optional)", () => {
    const container = new Container();

    container.register("service", () => ({}));

    expect(() => {
      container.register("service", () => ({}));
    }).toThrow();
  });

  it("should not initialize service until resolved", () => {
    const container = new Container();

    let initialized = false;

    container.register("lazyService", () => {
      initialized = true;
      return {};
    });

    expect(initialized).toBe(false);

    container.resolve("lazyService");

    expect(initialized).toBe(true);
  });

  it("should resolve nested dependencies", () => {
    const container = new Container();

    class A {}
    class B {
      constructor(public a: A) {}
    }
    class C {
      constructor(public b: B) {}
    }

    container.register("a", () => new A());

    container.register("b", () => {
      const a = container.resolve<A>("a");
      return new B(a);
    });

    container.register("c", () => {
      const b = container.resolve<B>("b");
      return new C(b);
    });

    const c = container.resolve<C>("c");

    expect(c.b.a).toBeInstanceOf(A);
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
