import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import verificationTokenRepository from "~/repositories/verification-token.repository.ts";
import VerificationToken from "~/models/verification-token.model.ts";
import User from "~/models/user.model.ts";
import { TOKEN_TYPES as tokenType} from "~/constants/roles.ts";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await VerificationToken.deleteMany({});
  await User.deleteMany({});
});

const createTestUser = async () => {
  return await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    provider: "local",
  });
};

describe("VerificationTokenRepository", () => {
  describe("create", () => {
    it("should create a new verification token", async () => {
      const user = await createTestUser();
      const token = await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      expect(token._id).toBeDefined();
      expect(token.code).toBe("123456");
      expect(token.type).toBe(tokenType.EMAIL_VERIFICATION);
      expect(token.used).toBe(false);
    });

    it("should create token with forgot-password type", async () => {
      const user = await createTestUser();
      const token = await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "654321",
        type: tokenType.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      expect(token.type).toBe(tokenType.FORGOT_PASSWORD);
    });
  });

  describe("findValidCode", () => {
    it("should find valid code", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      const found = await verificationTokenRepository.findValidCode(
        user._id.toString(),
        "123456",
        tokenType.EMAIL_VERIFICATION
      );

      expect(found).not.toBeNull();
      expect(found!.code).toBe("123456");
    });

    it("should return null for wrong code", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      const found = await verificationTokenRepository.findValidCode(
        user._id.toString(),
        "000000",
        tokenType.EMAIL_VERIFICATION
      );

      expect(found).toBeNull();
    });

    it("should return null for used token", async () => {
      const user = await createTestUser();
      const token = await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      await verificationTokenRepository.markAsUsed(token._id.toString());

      const found = await verificationTokenRepository.findValidCode(
        user._id.toString(),
        "123456",
        tokenType.EMAIL_VERIFICATION
      );

      expect(found).toBeNull();
    });

    it("should return null for expired token", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() - 1000),
        used: false,
      });

      const found = await verificationTokenRepository.findValidCode(
        user._id.toString(),
        "123456",
        tokenType.EMAIL_VERIFICATION
      );

      expect(found).toBeNull();
    });

    it("should return null for wrong type", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      const found = await verificationTokenRepository.findValidCode(
        user._id.toString(),
        "123456",
        tokenType.FORGOT_PASSWORD
      );

      expect(found).toBeNull();
    });
  });

  describe("markAsUsed", () => {
    it("should mark token as used", async () => {
      const user = await createTestUser();
      const token = await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      await verificationTokenRepository.markAsUsed(token._id.toString());

      const found = await VerificationToken.findById(token._id);
      expect(found!.used).toBe(true);
    });
  });

  describe("deleteByUserIdAndType", () => {
    it("should delete tokens by userId and type", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "654321",
        type: tokenType.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      await verificationTokenRepository.deleteByUserIdAndType(
        user._id.toString(),
        tokenType.EMAIL_VERIFICATION
      );

      const emailTokens = await VerificationToken.find({
        userId: user._id.toString(),
        type: tokenType.EMAIL_VERIFICATION,
      });
      const forgotTokens = await VerificationToken.find({
        userId: user._id.toString(),
        type: tokenType.FORGOT_PASSWORD,
      });

      expect(emailTokens).toHaveLength(0);
      expect(forgotTokens).toHaveLength(1);
    });
  });

  describe("countByUserIdAndType", () => {
    it("should count tokens by userId and type", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "111111",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "222222",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "333333",
        type: tokenType.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      const emailCount = await verificationTokenRepository.countByUserIdAndType(
        user._id.toString(),
        tokenType.EMAIL_VERIFICATION
      );
      const forgotCount = await verificationTokenRepository.countByUserIdAndType(
        user._id.toString(),
        tokenType.FORGOT_PASSWORD
      );

      expect(emailCount).toBe(2);
      expect(forgotCount).toBe(1);
    });

    it("should return 0 for no tokens", async () => {
      const user = await createTestUser();

      const count = await verificationTokenRepository.countByUserIdAndType(
        user._id.toString(),
        tokenType.EMAIL_VERIFICATION
      );

      expect(count).toBe(0);
    });
  });

  describe("deleteExpired", () => {
    it("should delete expired tokens", async () => {
      const user = await createTestUser();
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "111111",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() - 1000),
        used: false,
      });
      await verificationTokenRepository.create({
        userId: user._id.toString(),
        code: "222222",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false,
      });

      await verificationTokenRepository.deleteExpired();

      const remaining = await VerificationToken.find({});
      expect(remaining).toHaveLength(1);
      expect(remaining[0].code).toBe("222222");
    });
  });
});
