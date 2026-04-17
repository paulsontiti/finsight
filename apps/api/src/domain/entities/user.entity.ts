import { Entity } from "./entity.js";

interface CreateUserProps {
  //id?: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export class User extends Entity<CreateUserProps>{
//   private readonly _id: string;
//   private props.email: string;
//   private props.password: string;
//   private readonly props.createdAt: Date;

  constructor(props: CreateUserProps) {
    super(props)
    // this._id = props.id || randomUUID();

    this.props.email = this.validateAndNormalizeEmail(props.email);
    this.props.password = this.validatePassword(props.password);

    this.props.createdAt = props.createdAt || new Date();

    this.validate();
  }

  // =========================
  // GETTERS (READ-ONLY ACCESS)
  // =========================

//   get id(): string {
//     return this._id;
//   }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  // =========================
  // DOMAIN LOGIC
  // =========================

  private validate() {
    if (!this.id) {
      throw new Error("User ID is required");
    }

    if (!this.props.email) {
      throw new Error("Email is required");
    }

    if (!this.props.password) {
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
    this.props.email = this.validateAndNormalizeEmail(newEmail);
  }

  updatePassword(newPassword: string) {
    this.props.password = this.validatePassword(newPassword);
  }

  // =========================
  // COMPARISON
  // =========================

  equals(user: User): boolean {
    return this.email === user.email;
  }

  // =========================
  // SERIALIZATION (SAFE)
  // =========================

  toJSON() {
    return {
      id: this.id,
      email: this.props.email,
      createdAt: this.props.createdAt
      // ❌ password intentionally excluded
    };
  }
}