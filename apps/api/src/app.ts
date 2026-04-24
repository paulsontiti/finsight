import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import { AppError } from "./shared/erors/base.error.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Finsight API" });
});
app.use("/api/auth", authRouter);
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
});

export default app;
