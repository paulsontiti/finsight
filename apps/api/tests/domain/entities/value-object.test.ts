import { describe, it, expect } from "vitest";
import { ValueObject } from "../../../src/domain/entities/valueObject.js";

class NameVO extends ValueObject<{ value: string }> {}

describe("ValueObject", () => {

  it("should create a value object", () => {
    const vo = new NameVO({ value: "Paul" });

    expect(vo).toBeDefined();
  });

  it("should compare equal value objects correctly", () => {
    const vo1 = new NameVO({ value: "Paul" });
    const vo2 = new NameVO({ value: "Paul" });

    expect(vo1.equals(vo2)).toBe(true);
  });

  it("should return false for different values", () => {
    const vo1 = new NameVO({ value: "Paul" });
    const vo2 = new NameVO({ value: "John" });

    expect(vo1.equals(vo2)).toBe(false);
  });

  it("should return false when comparing with undefined", () => {
    const vo = new NameVO({ value: "Paul" });

    expect(vo.equals(undefined)).toBe(false);
  });

it("should compare nested objects correctly", () => {
  class ComplexVO extends ValueObject<{ user: { name: string } }> {}

  const vo1 = new ComplexVO({ user: { name: "Paul" } });
  const vo2 = new ComplexVO({ user: { name: "Paul" } });

  expect(vo1.equals(vo2)).toBe(true);
});

});