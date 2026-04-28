import { Role } from "../../../generated/prisma/enums.js";
import {
  type CreateUserProps,
  type DBUserProps,
} from "../../shared/types/index.js";
import { Entity } from "./entity.js";

export class DBUserEntity extends Entity {
  private _email: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private _role: Role;
  private _isVerified: boolean;

  constructor(props: any) {
    super();
    this._role = props.role || Role.APPUSER;

    this._email = this.validateAndNormalizeEmail(props.email);

    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._isVerified = false;
    this.validate();
  }

  // =========================
  // GETTERS (READ-ONLY ACCESS)
  // =========================

  get role(): Role {
    return this._role;
  }

  get email(): string {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  // =========================
  // DOMAIN LOGIC
  // =========================

  private validate() {
    if (!this.id) {
      throw new Error("User ID is required");
    }

    if (!this._email) {
      throw new Error("Email is required");
    }
  }

  private validateAndNormalizeEmail(email: string): string {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email");
    }

    const normalized = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error("Invalid email format");
    }

    return normalized;
  }

  // =========================
  // BEHAVIOR METHODS
  // =========================
  markVerified() {
    this._isVerified = true;
  }

  updateEmail(newEmail: string) {
    this._email = this.validateAndNormalizeEmail(newEmail);
  }

  // =========================
  // COMPARISON
  // =========================

  equals(user: DBUserEntity): boolean {
    return this.email === user.email;
  }

  // =========================
  // SERIALIZATION (SAFE)
  // =========================

  toJSON() {
    return {
      id: this.id,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      role: this.role,
      isverified: this.isVerified,
      // ❌ password intentionally excluded
    };
  }
}
export class CreateUserEntity extends Entity {
  private _email: string;
  private _password: string;

  constructor(props: CreateUserProps) {
    super();

    this._email = this.validateAndNormalizeEmail(props.email);
    this._password = this.validatePassword(props.password);

    this.validate();
  }

  // =========================
  // GETTERS (READ-ONLY ACCESS)
  // =========================

  //   get id(): string {
  //     return this._id;
  //   }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  // =========================
  // DOMAIN LOGIC
  // =========================

  private validate() {
    if (!this._email) {
      throw new Error("Email is required");
    }

    if (!this._password) {
      throw new Error("Password is required");
    }
  }

  private validateAndNormalizeEmail(email: string): string {
    if (!email || typeof email !== "string" || email.length > 120) {
      throw new Error("Invalid email");
    }

    const normalized = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error("Invalid email format");
    }

    return normalized;
  }

  private validatePassword(password: string): string {
    if (!password || typeof password !== "string") {
      throw new Error("Invalid password");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain an uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain a lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain a number");
    }

    if (!/[!@#$%^&*]/.test(password)) {
      throw new Error("Password must contain a special character");
    }

    return password;
  }

  // =========================
  // BEHAVIOR METHODS
  // =========================

  updateEmail(newEmail: string) {
    this._email = this.validateAndNormalizeEmail(newEmail);
  }

  updatePassword(newPassword: string) {
    this._password = this.validatePassword(newPassword);
  }

  // =========================
  // COMPARISON
  // =========================

  equals(user: CreateUserEntity): boolean {
    return this.email === user.email;
  }

  // =========================
  // SERIALIZATION (SAFE)
  // =========================

  toJSON() {
    return {
      id: this.id,
      email: this._email,
      // ❌ password intentionally excluded
    };
  }

  
}
