import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "./error.middleware.js";
export const auth = (req, res, next) => {
    let token;
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
    req.user = decoded;
    next();
};
export const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError("Not authenticated", 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new AppError("Forbidden: insufficient permissions", 403);
        }
        next();
    };
};
