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
import addressRoutes from "./routes/v1/address.routes.ts";
import categoryRoutes from "./routes/v1/category.routes.ts";
import storeRoutes from "./routes/v1/store.routes.ts";
import productRoutes from "./routes/v1/product.routes.ts";
import campaignRoutes from "./routes/v1/campaign.routes.ts";
import campaignItemRoutes, { campaignItemStandaloneRouter } from "./routes/v1/campaignItem.routes.ts";
import paymentRoutes from "./routes/v1/payment.routes.ts";

const app = express();

app.use(helmet());

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = env.CLIENT_URL ? [env.CLIENT_URL] : [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // đọc dữ liệu form 

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}

// check status
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", auth, userRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/campaigns/:campaignId/items", campaignItemRoutes);
app.use("/api/v1/campaign-items", campaignItemStandaloneRouter);
app.use("/api/v1/payment", paymentRoutes);

app.use(errorHandler);

export default app;
