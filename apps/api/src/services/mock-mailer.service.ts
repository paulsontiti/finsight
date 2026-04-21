import type { IMailer } from "../shared/types/index.js";

export class MockMailer implements IMailer{
  async send(data: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    console.log("📧 Mock Email Sent:", data);
  }
}