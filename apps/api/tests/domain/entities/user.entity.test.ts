import { describe, it, expect } from "vitest";
import { CreateUserEntity, DBUserEntity } from "../../../src/domain/entities/user.entity.js";
import { Role } from "../../../generated/prisma/enums.js";

describe("User Entity - Creation", () => {

  it("should create a valid user", () => {
    const user = new CreateUserEntity({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(user).toBeDefined();
    expect(user.email).toBe("test@mail.com");
  });

  
});
describe("User Entity - Email Validation", () => {

it("should throw error if email is invalid", () => {
  expect(() => {
    new CreateUserEntity({
      email: "invalid-email",
      password: "Password123!",
    });
  }).toThrow();
});

it("should normalize email to lowercase", () => {
  const user = new CreateUserEntity({
    email: "TEST@MAIL.COM",
    password: "Password123!",
  });

  expect(user.email).toBe("test@mail.com");
});

});

describe("User Entity - Password Validation", () => {

  it("should throw if password is too short", () => {
    expect(() => {
      new CreateUserEntity({
        email: "test@mail.com",
        password: "123",  
      });
    }).toThrow();
  });

  it("should throw if password has no uppercase", () => {
    expect(() => {
      new CreateUserEntity({
        email: "test@mail.com",
        password: "password123!",
      });
    }).toThrow();
  });

  it("should throw if password has no number", () => {
    expect(() => {
      new CreateUserEntity({
        email: "test@mail.com",
        password: "Password!",
      });
    }).toThrow();
  });

  it("should accept strong password", () => {
    const user = new CreateUserEntity({
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(user).toBeDefined();
  });

});

describe("User Entity - Timestamps", () => {

  it("should set createdAt automatically", () => {
    const user = new DBUserEntity({
      id: "1",
      email: "test@mail.com",
      password: "Password123!",
    });

    expect(user.createdAt).toBeInstanceOf(Date);
  });

});

describe("User Entity - Business Rules", () => {

  it("should not allow empty email", () => {
    expect(() => {
      new CreateUserEntity({
        email: "",
        password: "Password123!",
      });
    }).toThrow();
  });

  it("should not allow empty password", () => {
    expect(() => {
      new CreateUserEntity({
        email: "test@mail.com",
        password: "",
      });
    }).toThrow();
  });

});

describe("User Entity - Serialization", () => {

  it("should return safe JSON (no password exposure)", () => {
    const user = new DBUserEntity({
      id: "1",
      email: "test@mail.com",
      password: "Password123!",
    });

    const json = user.toJSON();

    expect("password" in json).toBeFalsy();
    expect(json.email).toBe("test@mail.com");
  });

});

describe("User Entity - Equality", () => {

  it("should consider users equal if email match", () => {
    const user1 = new CreateUserEntity({
      email: "a@mail.com",
      password: "Password123!",
    });

    const user2 = new CreateUserEntity({
      email: "a@mail.com",
      password: "Password123!",
    });

    expect(user1.equals(user2)).toBe(true);
  });

});

describe("User Entity - Edge Cases", () => {

  it("should trim email spaces", () => {
    const user = new CreateUserEntity({
      email: "  test@mail.com  ",
      password: "Password123!",
    });

    expect(user.email).toBe("test@mail.com");
  });

  it("should handle very long email safely", () => {
    const longEmail = "a".repeat(100) + "@mail.com";

    const user = new CreateUserEntity({
      email: longEmail,
      password: "Password123!",
    });

    expect(user.email).toContain("@mail.com");
  });

});

// describe("User Entity - ID", () => {

//   it("should require id", () => {
//     expect(() => {
//       new DBUserEntity({
//         email: "test@mail.com",
//         password: "Password123!",isVerified:false,
//       role:Role.APPUSER,
//       createdAt:new Date(),
//       updatedAt:new Date()
//       });
//     }).toThrow();
//   });

//   it("should not allow id mutation", () => {
//     const user = new DBUserEntity({
     
//       email: "test@mail.com",
//       password: "Password123!",isVerified:false,
//       role:Role.APPUSER,
//       createdAt:new Date(),
//       updatedAt:new Date()
//     });

//     expect(() => {
//       (user as any).id = "2";
//     }).toThrow();
//   });

// });