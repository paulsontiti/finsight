import { Entity } from "./entity.js";

export interface CreateUserProps {
  //id?: string;
  email: string;
  password: string;
  //createdAt?: Date;
}

export interface DBUserProps {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class DBUser extends Entity<DBUserProps>{
  //private readonly _id: string;
  private _email: string;
  private _password: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(props: DBUserProps) {
    super()
    // this._id = props.id || randomUUID();

    this._email = this.validateAndNormalizeEmail(props.email);
    this._password = this.validatePassword(props.password);

    this._createdAt = props.createdAt || new Date();
     this._updatedAt = props.updatedAt || new Date();

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

  get createdAt(): Date {
    return this._createdAt;
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

    if (!this._password) {
      throw new Error("Password is required");
    }
  }

  private validateAndNormalizeEmail(email: string): string {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email");
    }

    const normalized = email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  equals(user: DBUser): boolean {
    return this.email === user.email;
  }

  // =========================
  // SERIALIZATION (SAFE)
  // =========================

  toJSON() {
    return {
      id: this.id,
      email: this._email,
      createdAt: this._createdAt
      // ❌ password intentionally excluded
    };
  }
}