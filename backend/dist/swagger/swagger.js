import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";
import { authSchemas } from "./auth.swagger.js";
const isProduction = process.env.NODE_ENV === "production";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PixelMart API",
            version: "1.0.0",
            description: "Tài liệu API cho nền tảng thương mại điện tử PixelMart.\n\n## Xác thực\n- **Đăng ký/Đăng nhập/Google**: Tự động đặt `accessToken` (15 phút) và `refreshToken` (7 ngày) dưới dạng httpOnly cookies.\n- **Endpoint được bảo vệ**: Yêu cầu header `Authorization: Bearer <token>` hoặc cookie `accessToken`.\n- **Làm mới token**: Gọi `POST /api/v1/auth/refresh` để nhận cặp token mới qua cookie `refreshToken`.",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT access token",
                },
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    description: "Đối tượng người dùng trả về sau khi xác thực thành công",
                    properties: {
                        _id: { type: "string", description: "UUID v4" },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        gender: { type: "string", enum: ["male", "female", "other"], example: "other" },
                        role: { type: "string", enum: ["user", "admin"], example: "user" },
                        phone: { type: "string", nullable: true, example: "0123456789" },
                        provider: { type: "string", enum: ["local", "google"], example: "local" },
                        googleId: { type: "string", nullable: true },
                        avatar: { type: "string", nullable: true, example: "https://res.cloudinary.com/..." },
                        isEmailVerified: { type: "boolean", example: false },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                UserWithPassword: {
                    type: "object",
                    allOf: [
                        { $ref: "#/components/schemas/User" },
                        {
                            type: "object",
                            properties: {
                                hasPassword: { type: "boolean", example: true },
                            },
                        },
                    ],
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string" },
                    },
                },
                ...authSchemas,
            },
        },
        paths: {},
    },
    apis: isProduction
        ? [path.join(__dirname, "../routes/v1/*.routes.js")]
        : ["./src/routes/v1/*.routes.ts"],
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
