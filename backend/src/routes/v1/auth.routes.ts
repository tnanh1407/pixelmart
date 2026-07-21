import { Router } from "express";
import authController from "../../controllers/auth.controller.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user account
 *     description: >
 *       Creates a new user with local (email/password) provider.
 *       On success, sets `accessToken` (15min) and `refreshToken` (7d) as httpOnly cookies
 *       and returns the created user object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *           example:
 *             firstName: John
 *             lastName: Doe
 *             email: john@example.com
 *             password: password123
 *             confirmPassword: password123
 *     responses:
 *       201:
 *         description: Account created. Tokens set as httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJ...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Register successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Register successfully
 *               data:
 *                 user:
 *                   _id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   gender: "other"
 *                   role: "user"
 *                   phone: null
 *                   provider: "local"
 *                   googleId: null
 *                   avatar: null
 *                   isEmailVerified: false
 *                   isActive: true
 *                   createdAt: "2026-07-21T10:00:00.000Z"
 *                   updatedAt: "2026-07-21T10:00:00.000Z"
 *       400:
 *         description: Validation error (missing fields, password mismatch, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "[\"First name is required\",\"Passwords do not match\"]"
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email already exists
 */
router.post("/register", asyncHandler(authController.register.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     description: >
 *       Authenticates a user with email and password.
 *       Requires email to be verified first.
 *       On success, sets `accessToken` (15min) and `refreshToken` (7d) as httpOnly cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful. Tokens set as httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIs...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Login successfully
 *               data:
 *                 user:
 *                   _id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   gender: "other"
 *                   role: "user"
 *                   phone: null
 *                   provider: "local"
 *                   googleId: null
 *                   avatar: null
 *                   isEmailVerified: true
 *                   isActive: true
 *                   createdAt: "2026-07-21T10:00:00.000Z"
 *                   updatedAt: "2026-07-21T10:00:00.000Z"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid email or password
 *       403:
 *         description: Account locked or email not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notVerified:
 *                 summary: Email not verified
 *                 value:
 *                   success: false
 *                   message: "Email not verified. Please verify your email before logging in."
 *               locked:
 *                 summary: Account locked
 *                 value:
 *                   success: false
 *                   message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
 *               googleAccount:
 *                 summary: Google account
 *                 value:
 *                   success: false
 *                   message: "Tài khoản này sử dụng đăng nhập Google. Vui lòng đăng nhập bằng Google."
 */
router.post("/login", asyncHandler(authController.login.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Login or register with Google OAuth
 *     description: >
 *       Authenticates using Google OAuth credentials.
 *       - If `googleId` exists → login.
 *       - If email exists but no `googleId` → link Google account to existing account.
 *       - If neither exists → create new account with `provider: "google"` and `isEmailVerified: true`.
 *       On success, sets `accessToken` (15min) and `refreshToken` (7d) as httpOnly cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginInput'
 *           example:
 *             googleId: "1234567890"
 *             email: "john@gmail.com"
 *             name: "John Doe"
 *             avatar: "https://lh3.googleusercontent.com/..."
 *     responses:
 *       200:
 *         description: Google login successful. Tokens set as httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIs...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Google login successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Google login successfully
 *               data:
 *                 user:
 *                   _id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john@gmail.com"
 *                   gender: "other"
 *                   role: "user"
 *                   phone: null
 *                   provider: "google"
 *                   googleId: "1234567890"
 *                   avatar: "https://lh3.googleusercontent.com/..."
 *                   isEmailVerified: true
 *                   isActive: true
 *                   createdAt: "2026-07-21T10:00:00.000Z"
 *                   updatedAt: "2026-07-21T10:00:00.000Z"
 *       403:
 *         description: Account is locked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
 */
router.post("/google", asyncHandler(authController.googleLogin.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: >
 *       Uses the `refreshToken` httpOnly cookie to generate a new token pair.
 *       The old refresh token is verified against `JWT_REFRESH_SECRET`.
 *       On success, new `accessToken` (15min) and `refreshToken` (7d) are set as httpOnly cookies.
 *     responses:
 *       200:
 *         description: Token refreshed successfully. New tokens set as httpOnly cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIs...; Max-Age=900; Path=/; HttpOnly; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *       401:
 *         description: No refresh token cookie or invalid/expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: Missing cookie
 *                 value:
 *                   success: false
 *                   message: No refresh token provided
 *               invalidToken:
 *                 summary: Invalid or expired
 *                 value:
 *                   success: false
 *                   message: Invalid or expired refresh token
 */
router.post("/refresh", asyncHandler(authController.refreshToken.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user
 *     description: >
 *       Clears the `accessToken` and `refreshToken` httpOnly cookies.
 *       No authentication required — can be called even without being logged in.
 *     responses:
 *       200:
 *         description: Cookies cleared successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.post("/logout", asyncHandler(authController.logout.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user profile
 *     description: >
 *       Returns the authenticated user's profile.
 *       Requires a valid JWT via `Authorization: Bearer <token>` header or `accessToken` cookie.
 *       If the account is locked (isActive = false), returns 403.
 *       The response includes a `hasPassword` field indicating whether the user has a password set
 *       (useful for Google-authenticated users who cannot change password).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         hasPassword:
 *                           type: boolean
 *                           example: true
 *             example:
 *               success: true
 *               data:
 *                 _id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 gender: "other"
 *                 role: "user"
 *                 phone: null
 *                 provider: "local"
 *                 googleId: null
 *                 avatar: null
 *                 isEmailVerified: true
 *                 isActive: true
 *                 createdAt: "2026-07-21T10:00:00.000Z"
 *                 updatedAt: "2026-07-21T10:00:00.000Z"
 *                 hasPassword: true
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       403:
 *         description: Account is locked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
 */
router.get("/me", auth, asyncHandler(authController.getMe.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/send-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Send 6-digit email verification code
 *     description: >
 *       Sends a 6-digit OTP code to the authenticated user's email for email verification.
 *       The code expires in 15 minutes.
 *       Rate-limited to 5 resends per day per user.
 *       Requires authentication.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Verification code sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent successfully
 *       400:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email is already verified
 *       429:
 *         description: Too many requests (max 5/day)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests. Please try again tomorrow
 */
router.post("/send-verification", auth, asyncHandler(authController.sendVerificationCode.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email with 6-digit code
 *     description: >
 *       Verifies the user's email using the 6-digit code sent to their email.
 *       The code expires in 15 minutes.
 *       Requires authentication.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailInput'
 *           example:
 *             code: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid/expired code or already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidCode:
 *                 summary: Invalid or expired code
 *                 value:
 *                   success: false
 *                   message: Invalid or expired verification code
 *               alreadyVerified:
 *                 summary: Already verified
 *                 value:
 *                   success: false
 *                   message: Email is already verified
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/verify-email", auth, asyncHandler(authController.verifyEmail.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Resend email verification code
 *     description: >
 *       Resends a new 6-digit verification code to the user's email.
 *       Deletes any previous unused codes first.
 *       Rate-limited to 5 resends per day per user.
 *       Requires authentication.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: New verification code sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code resent successfully
 *       400:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email is already verified
 *       429:
 *         description: Too many requests (max 5/day)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests. Please try again tomorrow
 */
router.post("/resend-verification", auth, asyncHandler(authController.resendVerificationCode.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset email
 *     description: >
 *       Sends a password reset link to the given email address.
 *       The link contains a UUID token that expires in 15 minutes.
 *       **Silent fail**: If the email does not exist, still returns 200 to prevent email enumeration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *           example:
 *             email: john@example.com
 *     responses:
 *       200:
 *         description: Reset link sent (if email exists). Always returns 200 to prevent email enumeration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: If the email exists, a reset link has been sent
 */
router.post("/forgot-password", asyncHandler(authController.forgotPassword.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 *     description: >
 *       Resets the password using the token received via email.
 *       The token is a UUID v4 that expires in 15 minutes.
 *       Once used, the token is marked as used and cannot be reused.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *           example:
 *             token: "550e8400-e29b-41d4-a716-446655440000"
 *             password: "newPassword123"
 *             confirmPassword: "newPassword123"
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid/expired token or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidToken:
 *                 summary: Invalid or expired token
 *                 value:
 *                   success: false
 *                   message: Invalid or expired reset token
 *               passwordMismatch:
 *                 summary: Passwords do not match
 *                 value:
 *                   success: false
 *                   message: "[\"Passwords do not match\"]"
 */
router.post("/reset-password", asyncHandler(authController.resetPassword.bind(authController)));

/**
 * @openapi
 * /api/v1/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change password (authenticated)
 *     description: >
 *       Changes the password for the currently authenticated user.
 *       Requires the current password for verification.
 *       Only works for accounts with `provider: "local"`.
 *       Google-authenticated accounts cannot change password.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *           example:
 *             currentPassword: "oldPassword123"
 *             newPassword: "newPassword123"
 *             confirmPassword: "newPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công
 *       400:
 *         description: Wrong current password or Google account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               wrongPassword:
 *                 summary: Wrong current password
 *                 value:
 *                   success: false
 *                   message: "Mật khẩu hiện tại không đúng"
 *               googleAccount:
 *                 summary: Google account cannot change password
 *                 value:
 *                   success: false
 *                   message: "Tài khoản này sử dụng đăng nhập Google. Không thể thay đổi mật khẩu."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/change-password", auth, asyncHandler(authController.changePassword.bind(authController)));

export default router;
