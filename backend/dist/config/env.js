const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 5000,
    URL_MONGODB: process.env.URL_MONGODB,
    DB_NAME: process.env.DB_NAME || "pixelmart",
    JWT_SECRET: process.env.JWT_SECRET || "pixelmart_jwt_secret_default",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "pixelmart_jwt_refresh_secret_default",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/v1/auth/google/callback",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
if (!env.URL_MONGODB) {
    throw new Error("Missing URL_MONGODB env variable");
}
export default env;
