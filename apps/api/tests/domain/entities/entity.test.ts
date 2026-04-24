import { describe, it, expect } from "vitest";
import { Entity } from "../../../src/domain/entities/entity.js";

class TestEntity extends Entity {}

describe("Entity", () => {

  it("should create an entity with generated id", () => {
    const entity = new TestEntity();

    expect(entity.id).toBeDefined();
    expect(typeof entity.id).toBe("string");
  });

  it("should use provided id if given", () => {
    const entity = new TestEntity("custom-id");

    expect(entity.id).toBe("custom-id");
  });

//   it("should store props correctly", () => {
//     const entity = new TestEntity({ name: "Paul" });

//     expect(entity.props).toEqual({ name: "Paul" });
//   });

//   it("should keep props immutable (best practice check)", () => {
//     const entity = new TestEntity({ name: "Paul" });

//     // This depends on your implementation — optional strict mode
//     expect(entity.props.name).toBe("Paul");
//   });

  it("should create different ids for different entities", () => {
    const e1 = new TestEntity();
    const e2 = new TestEntity();

    expect(e1.id).not.toBe(e2.id);
  });


  it("should maintain identity across references", () => {
  const entity = new TestEntity();

  const ref = entity;

  expect(ref.id).toBe(entity.id);
});
});