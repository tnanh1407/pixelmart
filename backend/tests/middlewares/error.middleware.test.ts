import { Request, Response, NextFunction } from "express";

process.env.URL_MONGODB = "mongodb://localhost:27017/test";

import { AppError, errorHandler } from "~/middlewares/error.middleware.ts";

describe("error.middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("AppError", () => {
    it("should create an error with message and statusCode", () => {
      const error = new AppError("Not found", 404);
      expect(error.message).toBe("Not found");
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    it("should be an instance of Error", () => {
      const error = new AppError("Bad request", 400);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it("should capture stack trace", () => {
      const error = new AppError("Server error", 500);
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("Server error");
    });
  });

  describe("errorHandler", () => {
    it("should handle ZodError and return 400", () => {
      const zodError = {
        name: "ZodError",
        errors: [{ message: "Invalid email" }, { message: "Password too short" }],
      };

      errorHandler(zodError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Invalid email, Password too short",
      });
    });

    it("should handle single ZodError", () => {
      const zodError = {
        name: "ZodError",
        errors: [{ message: "Required field" }],
      };

      errorHandler(zodError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Required field",
      });
    });

    it("should handle Mongoose ValidationError and return 400", () => {
      const validationError = {
        name: "ValidationError",
        errors: {
          name: { message: "Name is required" },
          email: { message: "Email is invalid" },
        },
      };

      errorHandler(validationError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Name is required, Email is invalid",
      });
    });

    it("should handle Mongoose CastError and return 400", () => {
      const castError = {
        name: "CastError",
      };

      errorHandler(castError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Invalid ID format",
      });
    });

    it("should handle Mongoose duplicate key error (code 11000) and return 409", () => {
      const duplicateError = {
        code: 11000,
        keyValue: { email: "test@example.com" },
      };

      errorHandler(duplicateError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "email already exists",
      });
    });

    it("should handle AppError and return its statusCode", () => {
      const appError = new AppError("Custom error", 422);

      errorHandler(appError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Custom error",
      });
    });

    it("should return 500 for unknown errors in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const unknownError = new Error("Something went wrong");
      errorHandler(unknownError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Something went wrong",
      });

      process.env.NODE_ENV = originalEnv;
    });

    it("should return generic message for unknown errors in production", () => {
      const env = require("~/config/env.ts").default;
      const originalEnv = env.NODE_ENV;
      env.NODE_ENV = "production";

      const unknownError = new Error("Something went wrong");
      errorHandler(unknownError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Internal server error",
      });

      env.NODE_ENV = originalEnv;
    });

    it("should log error stack to console", () => {
      const error = new AppError("Test error", 400);

      errorHandler(error, req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(error.stack);
    });
  });
});
