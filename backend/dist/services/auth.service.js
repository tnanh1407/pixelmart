import userRepository from "../repositories/user.repository.js";
import { AppError } from "../middlewares/error.middleware.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
class AuthService {
    async register(data) {
        const existingEmail = await userRepository.exists({ email: data.email });
        if (existingEmail) {
            throw new AppError("Email already exists", 409);
        }
        const { firstName, lastName, ...userData } = data;
        const name = `${firstName} ${lastName}`.trim();
        const user = await userRepository.create({ ...userData, name });
        const tokenPayload = {
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
    async login(email, password) {
        const user = await userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }
        const tokenPayload = {
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
    async googleLogin(googleId, email, firstName, lastName, avatar) {
        let user = await userRepository.findByGoogleId(googleId);
        if (!user) {
            user = await userRepository.findByEmail(email);
            if (user) {
                user = await userRepository.update(String(user._id), { googleId });
            }
            else {
                const name = `${firstName} ${lastName}`.trim();
                user = await userRepository.create({
                    email,
                    name,
                    avatar,
                    googleId,
                    provider: "google",
                    isEmailVerified: true,
                });
            }
        }
        if (!user) {
            throw new AppError("Failed to create or find user", 500);
        }
        const tokenPayload = {
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
    async refreshToken(refreshToken) {
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const user = await userRepository.findById(decoded.userId);
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
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;
    }
}
export default new AuthService();
