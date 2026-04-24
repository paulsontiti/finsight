import { describe, it, expect } from "vitest";
import { Container } from "../../src/shared/container.js";

describe("DI Container - Registration", () => {

  it("should register a service", () => {
    const container = new Container();

    container.register("testService", () => ({ name: "test" }));

    const service = container.resolve("testService") as {name:string};

    expect(service).toBeDefined();
    expect(service.name).toBe("test");
  });

});