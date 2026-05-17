import crypto from "crypto";
import { container } from "../../shared/container/index.js";

const algorithm = "aes-256-cbc";

const config = container.resolve<any>("configService");
const rawKey = config.get("ENCRYPTION_KEY");

const key = crypto
  .createHash("sha256")
  .update(rawKey)
  .digest();

export class EncryptionService {
  encrypt(text: string) {
    const iv = crypto.randomBytes(16);
   

    const cipher = crypto.createCipheriv(
      algorithm,

      Buffer.from(key),

      iv,
    );

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }
}
