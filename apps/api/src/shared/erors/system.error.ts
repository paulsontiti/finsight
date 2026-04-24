import { AppError } from "./base.error.js";


export class DatabaseError extends AppError {
  constructor(message = "Database error") {
    super(message, 501, false);
  }
}