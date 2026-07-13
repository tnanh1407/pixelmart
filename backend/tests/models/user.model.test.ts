import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "~/models/user.model.ts";
import { ROLES, GENDERS } from "~/constants/roles.ts";
import { hashPassword, comparePassword } from "~/utils/bcrypt.ts";

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
  await User.deleteMany({});
});

describe("User Model", () => {
  const validLocalUser = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    gender: GENDERS.MALE,
    role: ROLES.USER,
    provider: "local",
  };

  const validGoogleUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    gender: GENDERS.FEMALE,
    role: ROLES.USER,
    provider: "google",
    googleId: "google123",
  };

  describe("schema validation", () => {
    it("should create a valid local user", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      expect(saved._id).toBeDefined();
      expect(saved.name).toBe("John Doe");
      expect(saved.email).toBe("john@example.com");
      expect(saved.gender).toBe(GENDERS.MALE);
      expect(saved.role).toBe(ROLES.USER);
      expect(saved.provider).toBe("local");
      expect(saved.isEmailVerified).toBe(false);
      expect(saved.isActive).toBe(true);
    });

    it("should create a valid google user without password", async () => {
      const user = new User(validGoogleUser);
      const saved = await user.save();

      expect(saved._id).toBeDefined();
      expect(saved.password).toBeUndefined();
      expect(saved.provider).toBe("google");
      expect(saved.googleId).toBe("google123");
    });

    it("should generate uuid for _id", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      expect(saved._id).toMatch(uuidRegex);
    });

    it("should fail if name is missing", async () => {
      const user = new User({ ...validLocalUser, name: undefined });

      await expect(user.save()).rejects.toThrow();
    });

    it("should fail if email is missing", async () => {
      const user = new User({ ...validLocalUser, email: undefined });

      await expect(user.save()).rejects.toThrow();
    });

    it("should trim and lowercase email", async () => {
      const user = new User({ ...validLocalUser, email: "  JOHN@EXAMPLE.COM  " });
      const saved = await user.save();

      expect(saved.email).toBe("john@example.com");
    });

    it("should trim name", async () => {
      const user = new User({ ...validLocalUser, name: "  John Doe  " });
      const saved = await user.save();

      expect(saved.name).toBe("John Doe");
    });

    it("should fail if name is less than 2 characters", async () => {
      const user = new User({ ...validLocalUser, name: "J" });

      await expect(user.save()).rejects.toThrow();
    });

    it("should fail if name exceeds 100 characters", async () => {
      const user = new User({ ...validLocalUser, name: "J".repeat(101) });

      await expect(user.save()).rejects.toThrow();
    });

    it("should accept name with exactly 2 characters", async () => {
      const user = new User({ ...validLocalUser, name: "Jo" });
      const saved = await user.save();

      expect(saved.name).toBe("Jo");
    });

    it("should accept name with exactly 100 characters", async () => {
      const user = new User({ ...validLocalUser, name: "J".repeat(100) });
      const saved = await user.save();

      expect(saved.name).toBe("J".repeat(100));
    });

    it("should fail if email is not unique", async () => {
      await new User(validLocalUser).save();
      const duplicate = new User({ ...validLocalUser, name: "Another" });

      await expect(duplicate.save()).rejects.toThrow();
    });

    it("should fail if password is less than 6 characters", async () => {
      const user = new User({ ...validLocalUser, password: "12345" });

      await expect(user.save()).rejects.toThrow();
    });

    it("should accept password with exactly 6 characters", async () => {
      const user = new User({ ...validLocalUser, password: "123456" });
      const saved = await user.save();

      expect(saved._id).toBeDefined();
    });
  });

  describe("gender field", () => {
    it("should default gender to 'other'", async () => {
      const user = new User({
        name: "No Gender",
        email: "nogender@example.com",
        password: "password123",
        provider: "local",
      });
      const saved = await user.save();

      expect(saved.gender).toBe(GENDERS.OTHER);
    });

    it("should accept male gender", async () => {
      const user = new User({ ...validLocalUser, gender: GENDERS.MALE });
      const saved = await user.save();

      expect(saved.gender).toBe(GENDERS.MALE);
    });

    it("should accept female gender", async () => {
      const user = new User({ ...validLocalUser, gender: GENDERS.FEMALE });
      const saved = await user.save();

      expect(saved.gender).toBe(GENDERS.FEMALE);
    });

    it("should accept other gender", async () => {
      const user = new User({ ...validLocalUser, gender: GENDERS.OTHER });
      const saved = await user.save();

      expect(saved.gender).toBe(GENDERS.OTHER);
    });

    it("should fail with invalid gender", async () => {
      const user = new User({ ...validLocalUser, gender: "invalid" });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("role field", () => {
    it("should default role to 'user'", async () => {
      const user = new User({
        name: "No Role",
        email: "norole@example.com",
        password: "password123",
        provider: "local",
      });
      const saved = await user.save();

      expect(saved.role).toBe(ROLES.USER);
    });

    it("should accept user role", async () => {
      const user = new User({ ...validLocalUser, role: ROLES.USER });
      const saved = await user.save();

      expect(saved.role).toBe(ROLES.USER);
    });

    it("should accept admin role", async () => {
      const user = new User({ ...validLocalUser, role: ROLES.ADMIN });
      const saved = await user.save();

      expect(saved.role).toBe(ROLES.ADMIN);
    });

    it("should fail with invalid role", async () => {
      const user = new User({ ...validLocalUser, role: "superadmin" });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("phone field", () => {
    it("should accept valid Vietnamese phone starting with 0", async () => {
      const user = new User({ ...validLocalUser, phone: "0912345678" });
      const saved = await user.save();

      expect(saved.phone).toBe("0912345678");
    });

    it("should accept valid Vietnamese phone starting with +84", async () => {
      const user = new User({ ...validLocalUser, phone: "+84912345678" });
      const saved = await user.save();

      expect(saved.phone).toBe("+84912345678");
    });

    it("should fail with invalid phone format", async () => {
      const user = new User({ ...validLocalUser, phone: "123456" });

      await expect(user.save()).rejects.toThrow();
    });

    it("should fail if phone is not unique", async () => {
      await new User({ ...validLocalUser, phone: "0912345678" }).save();
      const duplicate = new User({
        ...validLocalUser,
        email: "another@example.com",
        phone: "0912345678",
      });

      await expect(duplicate.save()).rejects.toThrow();
    });

    it("should trim phone number", async () => {
      const user = new User({ ...validLocalUser, phone: "  0912345678  " });
      const saved = await user.save();

      expect(saved.phone).toBe("0912345678");
    });

    it("should allow multiple users without phone (sparse)", async () => {
      await new User({ ...validLocalUser }).save();
      const second = new User({
        ...validLocalUser,
        email: "second@example.com",
      });
      const saved = await second.save();

      expect(saved._id).toBeDefined();
    });
  });

  describe("googleId field", () => {
    it("should fail if googleId is not unique", async () => {
      await new User(validGoogleUser).save();
      const duplicate = new User({
        ...validGoogleUser,
        email: "another@example.com",
      });

      await expect(duplicate.save()).rejects.toThrow();
    });

    it("should allow multiple users without googleId (sparse)", async () => {
      await new User(validLocalUser).save();
      const second = new User({
        ...validLocalUser,
        email: "second@example.com",
      });
      const saved = await second.save();

      expect(saved._id).toBeDefined();
    });
  });

  describe("provider field", () => {
    it("should default provider to 'local'", async () => {
      const user = new User({
        name: "No Provider",
        email: "noprovider@example.com",
        password: "password123",
      });
      const saved = await user.save();

      expect(saved.provider).toBe("local");
    });

    it("should accept 'local' provider", async () => {
      const user = new User({ ...validLocalUser, provider: "local" });
      const saved = await user.save();

      expect(saved.provider).toBe("local");
    });

    it("should accept 'google' provider", async () => {
      const user = new User({ ...validGoogleUser, provider: "google" });
      const saved = await user.save();

      expect(saved.provider).toBe("google");
    });

    it("should fail with invalid provider", async () => {
      const user = new User({ ...validLocalUser, provider: "facebook" });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("boolean defaults", () => {
    it("should default isEmailVerified to false", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      expect(saved.isEmailVerified).toBe(false);
    });

    it("should default isActive to true", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      expect(saved.isActive).toBe(true);
    });

    it("should allow setting isEmailVerified to true", async () => {
      const user = new User({ ...validLocalUser, isEmailVerified: true });
      const saved = await user.save();

      expect(saved.isEmailVerified).toBe(true);
    });

    it("should allow setting isActive to false", async () => {
      const user = new User({ ...validLocalUser, isActive: false });
      const saved = await user.save();

      expect(saved.isActive).toBe(false);
    });
  });

  describe("pre-validate hook", () => {
    it("should require password for local provider", async () => {
      const user = new User({
        name: "No Password",
        email: "nopass@example.com",
        provider: "local",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should not require password for google provider", async () => {
      const user = new User({
        name: "Google User",
        email: "google@example.com",
        provider: "google",
        googleId: "google456",
      });
      const saved = await user.save();

      expect(saved._id).toBeDefined();
    });
  });

  describe("pre-save hook (password hashing)", () => {
    it("should hash password on save", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      const userWithPassword = await User.findById(saved._id).select("+password");

      expect(userWithPassword!.password).toBeDefined();
      expect(userWithPassword!.password).not.toBe("password123");

      const isMatch = await comparePassword("password123", userWithPassword!.password!);
      expect(isMatch).toBe(true);
    });

    it("should rehash password when modified", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      const firstHash = (
        await User.findById(saved._id).select("+password")
      )!.password;

      saved.password = "newpassword123";
      await saved.save();

      const secondHash = (
        await User.findById(saved._id).select("+password")
      )!.password;

      expect(firstHash).not.toBe(secondHash);

      const isNewMatch = await comparePassword("newpassword123", secondHash!);
      expect(isNewMatch).toBe(true);
    });

    it("should not rehash password if other fields are modified", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      const firstHash = (
        await User.findById(saved._id).select("+password")
      )!.password;

      saved.name = "Updated Name";
      await saved.save();

      const secondHash = (
        await User.findById(saved._id).select("+password")
      )!.password;

      expect(firstHash).toBe(secondHash);
    });

    it("should not hash password for google provider (no password)", async () => {
      const user = new User(validGoogleUser);
      const saved = await user.save();

      expect(saved.password).toBeUndefined();
    });
  });

  describe("toJSON transform", () => {
    it("should remove password from JSON output", async () => {
      const user = new User(validLocalUser);
      await user.save();

      const json = user.toJSON();

      expect(json.password).toBeUndefined();
    });

    it("should remove __v from JSON output", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      const json = saved.toJSON();

      expect(json.__v).toBeUndefined();
    });

    it("should keep other fields in JSON output", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      const json = saved.toJSON();

      expect(json._id).toBeDefined();
      expect(json.name).toBe("John Doe");
      expect(json.email).toBe("john@example.com");
      expect(json.gender).toBe(GENDERS.MALE);
      expect(json.role).toBe(ROLES.USER);
      expect(json.provider).toBe("local");
      expect(json.isEmailVerified).toBe(false);
      expect(json.isActive).toBe(true);
      expect(json.createdAt).toBeDefined();
      expect(json.updatedAt).toBeDefined();
    });
  });

  describe("timestamps", () => {
    it("should set createdAt and updatedAt on create", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();

      expect(saved.createdAt).toBeDefined();
      expect(saved.updatedAt).toBeDefined();
      expect(saved.createdAt).toBeInstanceOf(Date);
      expect(saved.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt on update", async () => {
      const user = new User(validLocalUser);
      const saved = await user.save();
      const originalUpdatedAt = saved.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 50));

      saved.name = "Updated Name";
      await saved.save();

      expect(saved.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe("password select: false", () => {
    it("should not return password by default in queries", async () => {
      await new User(validLocalUser).save();

      const user = await User.findOne({ email: "john@example.com" });

      expect(user!.password).toBeUndefined();
    });

    it("should return password when explicitly selected", async () => {
      await new User(validLocalUser).save();

      const user = await User.findOne({ email: "john@example.com" }).select(
        "+password"
      );

      expect(user!.password).toBeDefined();
    });
  });
});
