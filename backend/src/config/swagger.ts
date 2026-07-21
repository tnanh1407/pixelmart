import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PixelMart API",
      version: "1.0.0",
      description:
        "API documentation for PixelMart e-commerce platform.\n\n## Authentication\n- **Register/Login/Google**: Sets `accessToken` (15min) and `refreshToken` (7d) as httpOnly cookies automatically.\n- **Protected endpoints**: Require either `Authorization: Bearer <token>` header or `accessToken` cookie.\n- **Token refresh**: Call `POST /api/v1/auth/refresh` to get a new token pair via the `refreshToken` cookie.",
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
          description: "User object returned after successful authentication",
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
        RegisterInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "confirmPassword"],
          properties: {
            firstName: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              example: "John",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              example: "Doe",
              description: "User's last name",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              maxLength: 100,
              example: "password123",
              description: "Password (min 6 characters)",
            },
            confirmPassword: {
              type: "string",
              format: "password",
              example: "password123",
              description: "Must match password",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
              description: "User's password",
            },
          },
        },
        GoogleLoginInput: {
          type: "object",
          required: ["googleId", "email", "name"],
          properties: {
            googleId: {
              type: "string",
              description: "Google account ID from Google OAuth",
              example: "1234567890",
            },
            email: {
              type: "string",
              format: "email",
              description: "Google account email",
              example: "john@gmail.com",
            },
            name: {
              type: "string",
              description: "Full name from Google profile",
              example: "John Doe",
            },
            avatar: {
              type: "string",
              nullable: true,
              description: "Avatar URL from Google profile",
              example: "https://lh3.googleusercontent.com/...",
            },
          },
        },
        VerifyEmailInput: {
          type: "object",
          required: ["code"],
          properties: {
            code: {
              type: "string",
              minLength: 6,
              maxLength: 6,
              example: "123456",
              description: "6-digit verification code sent to email",
            },
          },
        },
        ForgotPasswordInput: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "Email address to send reset link",
            },
          },
        },
        ResetPasswordInput: {
          type: "object",
          required: ["token", "password", "confirmPassword"],
          properties: {
            token: {
              type: "string",
              description: "Reset token received via email",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              maxLength: 100,
              example: "newPassword123",
              description: "New password (min 6 characters)",
            },
            confirmPassword: {
              type: "string",
              format: "password",
              example: "newPassword123",
              description: "Must match password",
            },
          },
        },
        ChangePasswordInput: {
          type: "object",
          required: ["currentPassword", "newPassword", "confirmPassword"],
          properties: {
            currentPassword: {
              type: "string",
              format: "password",
              example: "oldPassword123",
              description: "Current password",
            },
            newPassword: {
              type: "string",
              format: "password",
              minLength: 6,
              maxLength: 100,
              example: "newPassword123",
              description: "New password (min 6 characters)",
            },
            confirmPassword: {
              type: "string",
              format: "password",
              example: "newPassword123",
              description: "Must match newPassword",
            },
          },
        },
      },
    },
    paths: {},
  },
  apis: ["./src/routes/v1/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
