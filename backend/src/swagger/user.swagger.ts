export const userSchemas = {
  UpdateUserInput: {
    type: "object",
    description: "Thông tin cập nhật người dùng (Admin)",
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Nguyễn Văn A",
        description: "Tên người dùng",
      },
      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
        description: "Email người dùng",
      },
      phone: {
        type: "string",
        example: "0912000001",
        description: "Số điện thoại",
      },
      gender: {
        type: "string",
        enum: ["male", "female", "other"],
        example: "male",
        description: "Giới tính",
      },
      role: {
        type: "string",
        enum: ["user", "admin"],
        example: "user",
        description: "Vai trò",
      },
    },
  },
  ProfileUpdateInput: {
    type: "object",
    description: "Thông tin cập nhật hồ sơ cá nhân (multipart/form-data)",
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Nguyễn Văn A",
        description: "Tên người dùng",
      },
      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
        description: "Email người dùng",
      },
      phone: {
        type: "string",
        example: "0912000001",
        description: "Số điện thoại",
      },
      gender: {
        type: "string",
        enum: ["male", "female", "other"],
        example: "male",
        description: "Giới tính",
      },
    },
  },
  PaginatedUsers: {
    type: "object",
    description: "Danh sách người dùng phân trang",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/User" },
      },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 20 },
          totalPages: { type: "integer", example: 2 },
        },
      },
    },
  },
};
