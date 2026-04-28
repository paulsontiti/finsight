
export class ValidationsService{

    static validatePassword(password: string): string {
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
}