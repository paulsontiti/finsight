import app from "./app.js";
import { prisma } from "@repo/database";
const PORT = process.env.PORT || 5000;
// Fetch all users with their posts
const allUsers = await prisma.user.findMany();
console.log("All users:", JSON.stringify(allUsers, null, 2));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map