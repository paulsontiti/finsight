import { AppError } from "./base.error.js";


export class DatabaseError extends AppError {
  constructor(message = "Database error") {
    super(message, 501, false);
  }
}

export class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, false);
  }
}