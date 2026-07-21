import { render } from "@react-email/render";
import User from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { comparePassword } from "../utils/bcrypt.js";
import { hashPassword } from "../utils/bcrypt.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import { sendMail } from "../utils/mail.js";
import ForgotPasswordEmail from "../utils/emails/forgot-password-email.js";
import VerificationToken from "../models/verification-token.model.js";
import { TOKEN_TYPES as tokenType } from "../constants/roles.js";
import env from "../config/env.js";
class AuthService {
    async register(data) {
        const existing = await User.exists({ email: data.email });
        if (existing) {
            throw new AppError("Email already exists", 409);
        }
        const { firstName, lastName, ...userData } = data;
        const name = `${firstName} ${lastName}`.trim();
        const user = await User.create({ ...userData, name });
        const tokenPayload = {
            userId: String(user._id),
            email: user.email,
            role: user.role,
        };
        const tokens = generateTokenPair(tokenPayload);
        return { user, ...tokens };
    }
    async login(data) {
        const user = await User.findOne({ email: data.email }).select("+password");
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }
        if (!user.password) {
            throw new AppError("Tài khoản này sử dụng đăng nhập Google. Vui lòng đăng nhập bằng Google.", 403);
        }
        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }
        if (!user.isActive) {
            throw new AppError("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.", 403);
        }
        if (!user.isEmailVerified) {
            throw new AppError("Email not verified. Please verify your email before logging in.", 403);
        }
        const tokenPayload = {
            userId: String(user._id),
            email: user.email,
            role: user.role,
        };
        const tokens = generateTokenPair(tokenPayload);
        return { user, ...tokens };
    }
    async googleLogin(data) {
        let user = await User.findOne({ googleId: data.googleId });
        if (!user) {
            user = await User.findOne({ email: data.email });
            if (user) {
                user = await User.findByIdAndUpdate(String(user._id), { googleId: data.googleId }, { returnDocument: "after" });
            }
            else {
                user = await User.create({
                    email: data.email,
                    name: data.name,
                    avatar: data.avatar ?? '',
                    googleId: data.googleId,
                    provider: "google",
                    isEmailVerified: true,
                });
            }
        }
        if (!user) {
            throw new AppError("Failed to create or find user", 500);
        }
        if (!user.isActive) {
            throw new AppError("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.", 403);
        }
        const tokenPayload = {
            userId: String(user._id),
            email: user.email,
            role: user.role,
        };
        const tokens = generateTokenPair(tokenPayload);
        return { user, ...tokens };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            const tokenPayload = {
                userId: String(user._id),
                email: user.email,
                role: user.role,
            };
            const tokens = generateTokenPair(tokenPayload);
            return tokens;
        }
        catch (error) {
            if (error instanceof AppError)
                throw error;
            throw new AppError("Invalid or expired refresh token", 401);
        }
    }
    async getMe(userId) {
        const user = await User.findById(userId).select("+password");
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;
    }
    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            return;
        }
        await VerificationToken.deleteMany({ userId: user._id.toString(), type: tokenType.FORGOT_PASSWORD });
        const { v4: uuidv4 } = await import("uuid");
        const token = uuidv4();
        const expiresInMinutes = 15;
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        await VerificationToken.create({
            userId: user._id.toString(),
            code: token,
            type: tokenType.FORGOT_PASSWORD,
            expiresAt,
            used: false,
        });
        const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
        const html = await render(ForgotPasswordEmail({
            name: user.name,
            resetUrl,
            expiresInMinutes,
        }));
        await sendMail({
            to: user.email,
            subject: "Đặt lại mật khẩu PixelMart",
            html,
        });
    }
    async resetPassword(token, newPassword) {
        const resetToken = await VerificationToken.findOne({
            code: token,
            type: tokenType.FORGOT_PASSWORD,
            used: false,
            expiresAt: { $gt: new Date() },
        });
        if (!resetToken) {
            throw new AppError("Invalid or expired reset token", 400);
        }
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(resetToken.userId, { password: hashed });
        await VerificationToken.findByIdAndUpdate(resetToken._id, { used: true });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const idUser = await User.findById(userId);
        if (!idUser) {
            throw new AppError("User not found", 404);
        }
        const user = await User.findOne({ email: idUser.email }).select("+password");
        if (!user) {
            throw new AppError("User not found", 404);
        }
        if (!user.password) {
            throw new AppError("Tài khoản này sử dụng đăng nhập Google. Không thể thay đổi mật khẩu.", 400);
        }
        const isPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new AppError("Mật khẩu hiện tại không đúng", 400);
        }
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(userId, { password: hashed });
    }
}
export default new AuthService();
