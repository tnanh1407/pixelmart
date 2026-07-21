import authService from "../services/auth.service.js";
import emailVerificationService from "../services/email-verification.service.js";
import env from "../config/env.js";
import { registerSchema, loginSchema, googleLoginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, } from "../validators/user.validator.js";
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
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data);
        this.setTokenCookies(res, result.accessToken, result.refreshToken);
        res.json({
            success: true,
            message: "Login successfully",
            data: { user: result.user },
        });
    }
    async googleLogin(req, res) {
        const data = googleLoginSchema.parse(req.body);
        const result = await authService.googleLogin(data);
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
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
            });
            return;
        }
        res.json({
            success: true,
            data: {
                ...user.toJSON(),
                hasPassword: Boolean(user.password),
            },
        });
    }
    async sendVerificationCode(req, res) {
        const userId = String(req.user?.userId);
        await emailVerificationService.sendVerificationCode(userId);
        res.json({
            success: true,
            message: "Verification code sent successfully",
        });
    }
    async verifyEmail(req, res) {
        const userId = String(req.user?.userId);
        const { code } = verifyEmailSchema.parse(req.body);
        await emailVerificationService.verifyEmail(userId, code);
        res.json({
            success: true,
            message: "Email verified successfully",
        });
    }
    async resendVerificationCode(req, res) {
        const userId = String(req.user?.userId);
        await emailVerificationService.resendVerificationCode(userId);
        res.json({
            success: true,
            message: "Verification code resent successfully",
        });
    }
    async forgotPassword(req, res) {
        const { email } = forgotPasswordSchema.parse(req.body);
        await authService.forgotPassword(email);
        res.json({
            success: true,
            message: "If the email exists, a reset link has been sent",
        });
    }
    async resetPassword(req, res) {
        const { token, password } = resetPasswordSchema.parse(req.body);
        await authService.resetPassword(token, password);
        res.json({
            success: true,
            message: "Password reset successfully",
        });
    }
    async changePassword(req, res) {
        const userId = String(req.user?.userId);
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
        await authService.changePassword(userId, currentPassword, newPassword);
        res.json({
            success: true,
            message: "Đổi mật khẩu thành công",
        });
    }
}
export default new AuthController();
