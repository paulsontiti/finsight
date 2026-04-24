import { Role } from "../../../generated/prisma/enums.js";
import {} from "../../shared/types/index.js";
import { Entity } from "./entity.js";
export class DBUserEntity extends Entity {
    _email;
    _createdAt;
    _updatedAt;
    _role;
    _isVerified;
    constructor(props) {
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
    get role() {
        return this._role;
    }
    get email() {
        return this._email;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get isVerified() {
        return this._isVerified;
    }
    // =========================
    // DOMAIN LOGIC
    // =========================
    validate() {
        if (!this.id) {
            throw new Error("User ID is required");
        }
        if (!this._email) {
            throw new Error("Email is required");
        }
    }
    validateAndNormalizeEmail(email) {
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
    updateEmail(newEmail) {
        this._email = this.validateAndNormalizeEmail(newEmail);
    }
    // =========================
    // COMPARISON
    // =========================
    equals(user) {
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
    _email;
    _password;
    constructor(props) {
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
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    // =========================
    // DOMAIN LOGIC
    // =========================
    validate() {
        if (!this._email) {
            throw new Error("Email is required");
        }
        if (!this._password) {
            throw new Error("Password is required");
        }
    }
    validateAndNormalizeEmail(email) {
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
    validatePassword(password) {
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
    updateEmail(newEmail) {
        this._email = this.validateAndNormalizeEmail(newEmail);
    }
    updatePassword(newPassword) {
        this._password = this.validatePassword(newPassword);
    }
    // =========================
    // COMPARISON
    // =========================
    equals(user) {
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
//# sourceMappingURL=user.entity.js.map