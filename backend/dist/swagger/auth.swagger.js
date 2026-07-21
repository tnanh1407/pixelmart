export const authSchemas = {
    RegisterInput: {
        type: "object",
        required: ["firstName", "lastName", "email", "password", "confirmPassword"],
        properties: {
            firstName: {
                type: "string",
                minLength: 1,
                maxLength: 50,
                example: "John",
                description: "Tên của người dùng",
            },
            lastName: {
                type: "string",
                minLength: 1,
                maxLength: 50,
                example: "Doe",
                description: "Họ của người dùng",
            },
            email: {
                type: "string",
                format: "email",
                example: "john@example.com",
                description: "Địa chỉ email của người dùng",
            },
            password: {
                type: "string",
                format: "password",
                minLength: 6,
                maxLength: 100,
                example: "password123",
                description: "Mật khẩu (tối thiểu 6 ký tự)",
            },
            confirmPassword: {
                type: "string",
                format: "password",
                example: "password123",
                description: "Phải khớp với mật khẩu",
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
                description: "Địa chỉ email của người dùng",
            },
            password: {
                type: "string",
                format: "password",
                example: "password123",
                description: "Mật khẩu của người dùng",
            },
        },
    },
    GoogleLoginInput: {
        type: "object",
        required: ["googleId", "email", "name"],
        properties: {
            googleId: {
                type: "string",
                description: "ID tài khoản Google từ Google OAuth",
                example: "1234567890",
            },
            email: {
                type: "string",
                format: "email",
                description: "Email tài khoản Google",
                example: "john@gmail.com",
            },
            name: {
                type: "string",
                description: "Họ tên từ hồ sơ Google",
                example: "John Doe",
            },
            avatar: {
                type: "string",
                nullable: true,
                description: "URL ảnh đại diện từ hồ sơ Google",
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
                description: "Mã xác thực 6 chữ số được gửi qua email",
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
                description: "Địa chỉ email để gửi liên kết đặt lại mật khẩu",
            },
        },
    },
    ResetPasswordInput: {
        type: "object",
        required: ["token", "password", "confirmPassword"],
        properties: {
            token: {
                type: "string",
                description: "Mã thông báo đặt lại mật khẩu nhận được qua email",
                example: "550e8400-e29b-41d4-a716-446655440000",
            },
            password: {
                type: "string",
                format: "password",
                minLength: 6,
                maxLength: 100,
                example: "newPassword123",
                description: "Mật khẩu mới (tối thiểu 6 ký tự)",
            },
            confirmPassword: {
                type: "string",
                format: "password",
                example: "newPassword123",
                description: "Phải khớp với mật khẩu mới",
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
                description: "Mật khẩu hiện tại",
            },
            newPassword: {
                type: "string",
                format: "password",
                minLength: 6,
                maxLength: 100,
                example: "newPassword123",
                description: "Mật khẩu mới (tối thiểu 6 ký tự)",
            },
            confirmPassword: {
                type: "string",
                format: "password",
                example: "newPassword123",
                description: "Phải khớp với mật khẩu mới",
            },
        },
    },
};
