import { Request, Response, NextFunction } from "express";

process.env.URL_MONGODB = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

import { auth, checkRole } from "~/middlewares/auth.middleware.ts";
import { generateAccessToken } from "~/utils/jwt.ts";
import { AppError } from "~/middlewares/error.middleware.ts";

describe("auth.middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("auth", () => {
    it("should throw AppError when no authorization header", () => {
      req.headers = {};

      expect(() => auth(req as Request, res as Response, next)).toThrow(AppError);
      expect(() => auth(req as Request, res as Response, next)).toThrow("No token provided");
    });

    it("should throw AppError when authorization header does not start with Bearer", () => {
      req.headers = {
        authorization: "Basic abc123",
      };

      expect(() => auth(req as Request, res as Response, next)).toThrow(AppError);
      expect(() => auth(req as Request, res as Response, next)).toThrow("No token provided");
    });

    it("should throw AppError when token is invalid", () => {
      req.headers = {
        authorization: "Bearer invalid_token_here",
      };

      expect(() => auth(req as Request, res as Response, next)).toThrow();
    });

    it("should set req.user and call next when token is valid", () => {
      const payload = {
        userId: "user-123",
        email: "test@example.com",
        role: "user",
      };
      const token = generateAccessToken(payload);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      auth(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(payload.userId);
      expect(req.user?.email).toBe(payload.email);
      expect(req.user?.role).toBe(payload.role);
    });

    it("should handle empty Bearer token", () => {
      req.headers = {
        authorization: "Bearer ",
      };

      expect(() => auth(req as Request, res as Response, next)).toThrow();
    });
  });

  describe("checkRole", () => {
    it("should throw AppError when req.user is not set", () => {
      req.user = undefined;
      const middleware = checkRole("admin");

      expect(() => middleware(req as Request, res as Response, next)).toThrow(AppError);
      expect(() => middleware(req as Request, res as Response, next)).toThrow("Not authenticated");
    });

    it("should throw AppError when user role is not in allowed roles", () => {
      req.user = {
        userId: "user-123",
        email: "test@example.com",
        role: "user",
      };
      const middleware = checkRole("admin");

      expect(() => middleware(req as Request, res as Response, next)).toThrow(AppError);
      expect(() => middleware(req as Request, res as Response, next)).toThrow("Forbidden: insufficient permissions");
    });

    it("should call next when user role is in allowed roles", () => {
      req.user = {
        userId: "user-123",
        email: "admin@example.com",
        role: "admin",
      };
      const middleware = checkRole("admin");

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should allow multiple roles", () => {
      req.user = {
        userId: "user-123",
        email: "user@example.com",
        role: "user",
      };
      const middleware = checkRole("admin", "user", "shop_owner");

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should throw AppError when role is not in multiple allowed roles", () => {
      req.user = {
        userId: "user-123",
        email: "user@example.com",
        role: "guest",
      };
      const middleware = checkRole("admin", "user", "shop_owner");

      expect(() => middleware(req as Request, res as Response, next)).toThrow(AppError);
      expect(() => middleware(req as Request, res as Response, next)).toThrow("Forbidden: insufficient permissions");
    });
  });
});
