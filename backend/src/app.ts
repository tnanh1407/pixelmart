import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import env from "./config/env.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import { auth } from "./middlewares/auth.middleware.ts";
import authRoutes from "./routes/v1/auth.routes.ts";
import userRoutes from "./routes/v1/user.routes.ts";

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", auth, userRoutes);

app.use(errorHandler);

export default app;
