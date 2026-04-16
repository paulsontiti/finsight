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

});