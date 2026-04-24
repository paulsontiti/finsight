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

});