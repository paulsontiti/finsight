// src/config/env.ts
import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });
console.log("Using ENV:", envFile);
//# sourceMappingURL=env.js.map