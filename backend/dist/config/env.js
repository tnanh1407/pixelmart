const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    URL_MONGODB: process.env.URL_MONGODB,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    CLIENT_URL: process.env.CLIENT_URL,
};
if (!env.URL_MONGODB) {
    throw new Error("Missing URL_MONGODB env variable");
}
export default env;
