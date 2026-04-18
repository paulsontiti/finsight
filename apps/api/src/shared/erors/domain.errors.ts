import { AppError } from "./base.error.js";


export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User already exists", 409);
  }
}

export class BcryptHashError extends AppError {
  constructor() {
    super("Hashing failed", 409);
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = "Invalid credentials") {
    super(message, 401);
  }
}

export class InsufficientBalanceError extends AppError {
  constructor() {
    super("Insufficient wallet balance", 400);
  }
}