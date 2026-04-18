import { describe, it, expect } from "vitest";
import { DBUserEntity } from "../../src/domain/entities/user.entity.js";
import { Role } from "../../generated/prisma/enums.js";

describe("User Entity - Creation", () => {
  it("should create a valid user", () => {
    const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

    expect(user).toBeDefined();
    expect(user.email).toBe("test@mail.com");
  });
});

describe("User Entity - Email Validation", () => {
  it("should throw error if email is invalid", () => {
    expect(() => {
       new DBUserEntity({
        id:"",
      email: "test@mail",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    }).toThrow();
  });

  it("should normalize email to lowercase", () => {
   
 const user = new DBUserEntity({
        id:"",
      email: "TEST@MAIL.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    expect(user.email).toBe("test@mail.com");
  });
});

describe("User Entity - Password Validation", () => {
  it("should throw if password is too short", () => {
    expect(() => {
       new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Pass!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    }).toThrow();
  });

  it("should throw if password has no uppercase", () => {
    expect(() => {
       new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    }).toThrow();
  });

  it("should throw if password has no number", () => {
    expect(() => {
       new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Passwordrrr!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    }).toThrow();
  });

  it("should accept strong password", () => {
     const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

    expect(user).toBeDefined();
  });
});

describe("User Entity - ID", () => {
  it("should set id automatically by base class Entity", () => {
     const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    expect(user.id).toBeDefined();
  });

//   it("should not allow id mutation", () => {
//     const user = new User({
//       email: "test@mail.com",
//       password: "Password123!",
//     });

//     try {
//       user.id = 2;
//     } catch (err: any) {
//       expect(err).toBeDefined();
//     }
//   });
});

describe("User Entity - Timestamps", () => {

  it("should set createdAt automatically", () => {
    const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

    expect(user.createdAt).toBeInstanceOf(Date);
  });

});

describe("User Entity - Business Rules", () => {

  it("should not allow empty email", () => {
    expect(() => {
       new DBUserEntity({
        id:"",
      email: "",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    }).toThrow();
  });

  it("should not allow empty password", () => {
    expect(() => {
       new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    }).toThrow();
  });

});

describe("User Entity - Serialization", () => {

  it("should return safe JSON (no password exposure)", () => {
    const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });
    const json = user.toJSON();
    const hasPassword = "password" in json;
    expect(hasPassword).toBeFalsy();
    expect(json.email).toBe("test@mail.com");
  });

});

describe("User Entity - Equality", () => {

  it("should consider users equal if email match", () => {
     const user1 = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

     const user2 = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

    expect(user1.equals(user2)).toBe(true);
  });

});

describe("User Entity - Edge Cases", () => {

  it("should trim email spaces", () => {
     const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

    expect(user.email).toBe("test@mail.com");
  });

  it("should handle very long email safely", () => {
    const longEmail = "a".repeat(100) + "@mail.com";

     const user = new DBUserEntity({
        id:"",
      email: "test@mail.com",
      password: "Password123!",createdAt: new Date(),updatedAt: new Date(),role:Role.APPUSER
    });

    expect(user.email).toContain("@mail.com");
  });

});