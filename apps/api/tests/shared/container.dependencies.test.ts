import { describe, it, expect } from "vitest";
import { Container } from "../../src/shared/container.js";

class Repo {
  get() {
    return "data";
  }
}

class Service {
  constructor(public repo: Repo) {}

  execute() {
    return this.repo.get();
  }
}

describe("DI Container - Dependencies", () => {

  it("should inject dependencies correctly", () => {
    const container = new Container();

    container.register("repo", () => new Repo());

    container.register("service", () => {
      const repo = container.resolve<Repo>("repo");
      return new Service(repo);
    });

    const service = container.resolve<Service>("service");

    expect(service.execute()).toBe("data");
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
});