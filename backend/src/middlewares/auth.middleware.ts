import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt.js";
import { AppError } from "./error.middleware.js";
import User from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Try Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Fallback: try httpOnly cookie
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError("No token provided", 401);
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw new AppError("Tài khoản không khả dụng. Vui lòng liên hệ quản trị viên.", 401);
  }

  req.user = decoded;
  next();
};

export const checkRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden: insufficient permissions", 403);
    }

    next();
  };
};
