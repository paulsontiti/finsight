import app from "./app.js";
import prisma from "./prisma.js";
import dotenv from "dotenv";
import { container } from "./shared/container/index.js";
dotenv.config();
//enforce required envs at startup
const config = container.resolve("configService");
const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT"];
requiredEnv.forEach((key) => {
    config.get(key);
    // if (!process.env[key]) {
    //   throw new Error(`Missing required env: ${key}`);
    // }
});
const PORT = config.get("PORT");
// Fetch all users with their posts
const allUsers = await prisma.user.findMany();
console.log("All users:", JSON.stringify(allUsers, null, 2));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map