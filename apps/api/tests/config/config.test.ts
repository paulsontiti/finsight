import { describe, it, expect } from "vitest";
import { ConfigService } from "../../src/shared/config/config.service.js";

describe("Config Service", () => {

  it("should return env variable", () => {
    process.env.TEST_KEY = "value";

    const config = new ConfigService();

    expect(config.get("TEST_KEY")).toBe("value");
  });

  it("should throw error if variable missing", () => {
    const config = new ConfigService();

    expect(() => config.get("UNKNOWN_KEY")).toThrow();
  });

  it("should parse number correctly", () => {
    process.env.PORT = "3000";

    const config = new ConfigService();

    expect(config.getNumber("PORT")).toBe(3000);
  });

});