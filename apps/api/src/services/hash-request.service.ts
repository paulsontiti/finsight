import crypto from "crypto";

export function hashRequest(payload: any): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}