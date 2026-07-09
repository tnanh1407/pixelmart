import authService from "../services/auth.service.js";
import env from "../config/env.js";
import { registerSchema, loginSchema, googleLoginSchema, } from "../validators/user.validator.js";
const isProduction = env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
};
export class AuthController {
    setTokenCookies(res, accessToken, refreshToken) {
        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
    async register(req, res) {
        const data = registerSchema.parse(req.body);
        const result = await authService.register(data);
        this.setTokenCookies(res, result.accessToken, result.refreshToken);
        res.status(201).json({
            success: true,
            message: "Register successfully",
            data: { user: result.user },
        });
    }
    async login(req, res) {
        const { email, password } = loginSchema.parse(req.body);
        const result = await authService.login(email, password);
        this.setTokenCookies(res, result.accessToken, result.refreshToken);
        res.json({
            success: true,
            message: "Login successfully",
            data: { user: result.user },
        });
    }
    async googleLogin(req, res) {
        const { googleId, email, firstName, lastName, avatar } = googleLoginSchema.parse(req.body);
        const result = await authService.googleLogin(googleId, email, firstName, lastName, avatar);
        this.setTokenCookies(res, result.accessToken, result.refreshToken);
        res.json({
            success: true,
            message: "Google login successfully",
            data: { user: result.user },
        });
    }
    async refreshToken(req, res) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "No refresh token provided",
            });
            return;
        }
        const tokens = await authService.refreshToken(refreshToken);
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
        res.json({
            success: true,
            message: "Token refreshed successfully",
        });
    }
    async logout(req, res) {
        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    }
    async getMe(req, res) {
        const userId = String(req.user?.userId);
        const user = await authService.getMe(userId);
        res.json({
            success: true,
            data: user,
        });
    }
}
export default new AuthController();
