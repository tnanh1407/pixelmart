import { render } from "@react-email/render";
import userRepository from "../repositories/user.repository.js";
import verificationTokenRepository from "../repositories/verification-token.repository.js";
import { TOKEN_TYPES as tokenType } from "~/constants/roles.ts";
import { generateOtp } from "../utils/otp.js";
import { sendMail } from "../utils/mail.js";
import { AppError } from "../middlewares/error.middleware.js";
import VerificationEmail from "../utils/emails/verification-email.tsx";

const MAX_RESEND_PER_DAY = 5;
const CODE_EXPIRY_MINUTES = 15;

class EmailVerificationService {
  async sendVerificationCode(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    const count = await verificationTokenRepository.countByUserIdAndType(
      userId,
      tokenType.EMAIL_VERIFICATION
    );
    if (count >= MAX_RESEND_PER_DAY) {
      throw new AppError("Too many requests. Please try again tomorrow", 429);
    }

    await verificationTokenRepository.deleteByUserIdAndType(
      userId,
      tokenType.EMAIL_VERIFICATION
    );

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await verificationTokenRepository.create({
      userId,
      code,
      type: tokenType.EMAIL_VERIFICATION,
      expiresAt,
      used: false,
    });

    const html = await render(
      VerificationEmail({
        name: user.name,
        code,
        expiresInMinutes: CODE_EXPIRY_MINUTES,
      })
    );

    await sendMail({
      to: user.email,
      subject: "Xác thực tài khoản PixelMart",
      html,
    });
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    const token = await verificationTokenRepository.findValidCode(
      userId,
      code,
      tokenType.EMAIL_VERIFICATION
    );

    if (!token) {
      throw new AppError("Invalid or expired verification code", 400);
    }

    await verificationTokenRepository.markAsUsed(token._id.toString());
    await userRepository.updateEmailVerified(userId, true);
  }

  async resendVerificationCode(userId: string): Promise<void> {
    await this.sendVerificationCode(userId);
  }
}

export default new EmailVerificationService();
