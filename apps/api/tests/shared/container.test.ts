import { describe, it, expect } from "vitest";
import { Container } from "../../src/shared/container.js";

describe("DI Container - Registration", () => {
  it("should register a service", () => {
    type ServiceType = {name:string}
    const container = new Container();

    container.register("testService", () => ({ name: "test" }));

    const service = container.resolve("testService") as ServiceType;

  
    expect(service).toBeDefined();
    expect(service.name).toBe("test");
  });
});
