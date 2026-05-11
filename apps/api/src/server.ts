import app from "./app.js";
import dotenv from "dotenv";
import { container } from "./shared/container/index.js";

dotenv.config();

//enforce required envs at startup
const config = container.resolve<any>("configService");
const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT","PAYSTACK_SECRET"];
requiredEnv.forEach((key) => {
  
  if (!process.env[key]) {
    throw new Error(`Missing required env: ${key}`);
  }
});

const PORT = config.get("PORT");




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
