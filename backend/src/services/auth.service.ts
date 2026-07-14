import { render } from "@react-email/render";
import userRepository from "../repositories/user.repository.js";
import verificationTokenRepository from "../repositories/verification-token.repository.js";
import { AppError } from "../middlewares/error.middleware.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateTokenPair, verifyRefreshToken, type JwtPayload } from "../utils/jwt.js";
import { sendMail } from "../utils/mail.js";
import ForgotPasswordEmail from "../utils/emails/forgot-password-email.tsx";
import { TOKEN_TYPES as tokenType } from "~/constants/roles.ts";
import env from "../config/env.js";
interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface IGoogleLogin {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

interface ILogin {
  email: string;
  password: string;
}
class AuthService {
  async register(data: IRegister) {
    const existingEmail = await userRepository.exists({ email: data.email });
    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }

    const { firstName, lastName, ...userData } = data;
    const name = `${firstName} ${lastName}`.trim();

    const user = await userRepository.create({ ...userData, name });

    const tokenPayload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    return { user, ...tokens };
  }

  async login(data: ILogin) {
    const user = await userRepository.findByEmailWithPassword(data.email);
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

    const tokenPayload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    return {
      user,
      ...tokens,
    };
  }


  async googleLogin(data: IGoogleLogin) {
    let user = await userRepository.findByGoogleId(data.googleId);

    if (!user) {
      user = await userRepository.findByEmail(data.email);

      if (user) {
        user = await userRepository.update(String(user._id), { googleId: data.googleId });
      } else {
        user = await userRepository.create({
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

    const tokenPayload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };
    const tokens = generateTokenPair(tokenPayload);

    return {
      user,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const tokenPayload: JwtPayload = {
        userId: String(user._id),
        email: user.email,
        role: user.role,
      };
      const tokens = generateTokenPair(tokenPayload);

      return tokens;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return;
    }

    await verificationTokenRepository.deleteByUserIdAndType(
      user._id.toString(),
      tokenType.FORGOT_PASSWORD
    );

    const { v4: uuidv4 } = await import("uuid");
    const token = uuidv4();
    const expiresInMinutes = 15;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await verificationTokenRepository.create({
      userId: user._id.toString(),
      code: token,
      type: tokenType.FORGOT_PASSWORD,
      expiresAt,
      used: false,
    });

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

    const html = await render(
      ForgotPasswordEmail({
        name: user.name,
        resetUrl,
        expiresInMinutes,
      })
    );

    await sendMail({
      to: user.email,
      subject: "Đặt lại mật khẩu PixelMart",
      html,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await verificationTokenRepository.findValidToken(
      token,
      tokenType.FORGOT_PASSWORD
    );

    if (!resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    await userRepository.updatePassword(resetToken.userId, newPassword);
    await verificationTokenRepository.markAsUsed(resetToken._id.toString());
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findByEmailWithPassword(
      (await userRepository.findById(userId))?.email || ""
    );
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

    await userRepository.updatePassword(userId, newPassword);
  }
}

export default new AuthService();
