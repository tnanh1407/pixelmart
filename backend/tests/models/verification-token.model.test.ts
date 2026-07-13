import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import VerificationToken from "~/models/verification-token.model.ts";
import { TOKEN_TYPES as tokenType } from "~/constants/roles.ts";
import User from "~/models/user.model.ts";

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

describe("VerificationToken Model", () => {
  const validToken = {
    code: "123456",
    type: tokenType.EMAIL_VERIFICATION,
  };

  describe("schema validation", () => {
    it("should create a valid token", async () => {
      const user = await createTestUser();
      const token = new VerificationToken({
        ...validToken,
        userId: user._id.toString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
      const saved = await token.save();

      expect(saved._id).toBeDefined();
      expect(saved.code).toBe("123456");
      expect(saved.type).toBe(tokenType.EMAIL_VERIFICATION);
      expect(saved.used).toBe(false);
    });

    it("should fail if userId is missing", async () => {
      const token = new VerificationToken({
        ...validToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await expect(token.save()).rejects.toThrow();
    });

    it("should fail if code is missing", async () => {
      const user = await createTestUser();
      const token = new VerificationToken({
        userId: user._id.toString(),
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await expect(token.save()).rejects.toThrow();
    });

    it("should fail if code is not 6 characters", async () => {
      const user = await createTestUser();
      const token = new VerificationToken({
        userId: user._id.toString(),
        code: "12345",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await expect(token.save()).rejects.toThrow();
    });

    it("should fail if type is missing", async () => {
      const user = await createTestUser();
      const token = new VerificationToken({
        userId: user._id.toString(),
        code: "123456",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await expect(token.save()).rejects.toThrow();
    });

    it("should fail with invalid type", async () => {
      const user = await createTestUser();
      const token = new VerificationToken({
        userId: user._id.toString(),
        code: "123456",
        type: "invalid-type",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await expect(token.save()).rejects.toThrow();
    });

    it("should fail if expiresAt is missing", async () => {
      const user = await createTestUser();
      const token = new VerificationToken({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
      });

      await expect(token.save()).rejects.toThrow();
    });
  });

  describe("default values", () => {
    it("should default used to false", async () => {
      const user = await createTestUser();
      const token = await VerificationToken.create({
        ...validToken,
        userId: user._id.toString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      expect(token.used).toBe(false);
    });

    it("should generate uuid for _id", async () => {
      const user = await createTestUser();
      const token = await VerificationToken.create({
        ...validToken,
        userId: user._id.toString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      expect(token._id).toMatch(uuidRegex);
    });
  });

  describe("token types", () => {
    it("should accept email-verification type", async () => {
      const user = await createTestUser();
      const token = await VerificationToken.create({
        userId: user._id.toString(),
        code: "123456",
        type: tokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      expect(token.type).toBe("email-verification");
    });

    it("should accept forgot-password type", async () => {
      const user = await createTestUser();
      const token = await VerificationToken.create({
        userId: user._id.toString(),
        code: "654321",
        type: tokenType.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      expect(token.type).toBe("forgot-password");
    });

  });

  describe("timestamps", () => {
    it("should set createdAt and updatedAt on create", async () => {
      const user = await createTestUser();
      const token = await VerificationToken.create({
        ...validToken,
        userId: user._id.toString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      expect(token.createdAt).toBeDefined();
      expect(token.updatedAt).toBeDefined();
      expect(token.createdAt).toBeInstanceOf(Date);
      expect(token.updatedAt).toBeInstanceOf(Date);
    });
  });
});
