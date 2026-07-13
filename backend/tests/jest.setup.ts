// Jest setup file
// Set required env variables before any imports

process.env.URL_MONGODB = process.env.URL_MONGODB || "mongodb://localhost:27017/test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test_jwt_refresh_secret";
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.SMTP_USER = process.env.SMTP_USER || "test@gmail.com";
process.env.SMTP_PASS = process.env.SMTP_PASS || "test_password";
