import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userRepository from "~/repositories/user.repository.ts";
import User from "~/models/user.model.ts";
import { ROLES, GENDERS } from "~/constants/roles.ts";
import { comparePassword } from "~/utils/bcrypt.ts";

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

const localUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  gender: GENDERS.MALE,
  role: ROLES.USER,
  phone: "0912345678",
  provider: "local" as const,
};

const googleUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  gender: GENDERS.FEMALE,
  role: ROLES.USER,
  provider: "google" as const,
  googleId: "google_id_123",
};

describe("UserRepository", () => {
  describe("create", () => {
    it("should create a new user", async () => {
      const user = await userRepository.create(localUser);

      expect(user._id).toBeDefined();
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
    });

    it("should hash password when creating local user", async () => {
      const user = await userRepository.create(localUser);
      const userWithPassword = await User.findById(user._id).select("+password");

      expect(userWithPassword!.password).toBeDefined();
      expect(userWithPassword!.password).not.toBe("password123");

      const isMatch = await comparePassword("password123", userWithPassword!.password!);
      expect(isMatch).toBe(true);
    });

    it("should create a google user without password", async () => {
      const user = await userRepository.create(googleUser);

      expect(user._id).toBeDefined();
      expect(user.provider).toBe("google");
      expect(user.googleId).toBe("google_id_123");
    });

    it("should save with default values", async () => {
      const user = await userRepository.create({
        name: "Default User",
        email: "default@example.com",
        password: "password123",
        provider: "local",
      });

      expect(user.gender).toBe(GENDERS.OTHER);
      expect(user.role).toBe(ROLES.USER);
      expect(user.isEmailVerified).toBe(false);
      expect(user.isActive).toBe(true);
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      await userRepository.create(localUser);

      const found = await userRepository.findByEmail("john@example.com");

      expect(found).not.toBeNull();
      expect(found!.email).toBe("john@example.com");
      expect(found!.name).toBe("John Doe");
    });

    it("should return null if user not found", async () => {
      const found = await userRepository.findByEmail("nonexistent@example.com");

      expect(found).toBeNull();
    });

    it("should not include password by default", async () => {
      await userRepository.create(localUser);

      const found = await userRepository.findByEmail("john@example.com");

      expect(found!.password).toBeUndefined();
    });

    it("should find by email case-insensitive (lowercase stored)", async () => {
      await userRepository.create(localUser);

      const found = await userRepository.findByEmail("JOHN@EXAMPLE.COM");

      expect(found).not.toBeNull();
      expect(found!.email).toBe("john@example.com");
    });
  });

  describe("findByEmailWithPassword", () => {
    it("should find user by email with password", async () => {
      await userRepository.create(localUser);

      const found = await userRepository.findByEmailWithPassword("john@example.com");

      expect(found).not.toBeNull();
      expect(found!.email).toBe("john@example.com");
      expect(found!.password).toBeDefined();
      expect(typeof found!.password).toBe("string");
    });

    it("should return null if user not found", async () => {
      const found = await userRepository.findByEmailWithPassword("nonexistent@example.com");

      expect(found).toBeNull();
    });

    it("should return hashed password, not plain text", async () => {
      await userRepository.create(localUser);

      const found = await userRepository.findByEmailWithPassword("john@example.com");

      expect(found!.password).not.toBe("password123");
      expect(found!.password!.length).toBeGreaterThan(20);
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const created = await userRepository.create(localUser);

      const found = await userRepository.findById(created._id.toString());

      expect(found).not.toBeNull();
      expect(found!.name).toBe("John Doe");
      expect(found!.email).toBe("john@example.com");
    });

    it("should return null for non-existent id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const found = await userRepository.findById(fakeId);

      expect(found).toBeNull();
    });

    it("should return null for invalid id format", async () => {
      const found = await userRepository.findById("invalid-id");

      expect(found).toBeNull();
    });
  });

  describe("findByGoogleId", () => {
    it("should find user by googleId", async () => {
      await userRepository.create(googleUser);

      const found = await userRepository.findByGoogleId("google_id_123");

      expect(found).not.toBeNull();
      expect(found!.googleId).toBe("google_id_123");
      expect(found!.name).toBe("Jane Doe");
    });

    it("should return null if googleId not found", async () => {
      const found = await userRepository.findByGoogleId("nonexistent_google_id");

      expect(found).toBeNull();
    });
  });

  describe("findByPhone", () => {
    it("should find user by phone", async () => {
      await userRepository.create(localUser);

      const found = await userRepository.findByPhone("0912345678");

      expect(found).not.toBeNull();
      expect(found!.phone).toBe("0912345678");
    });

    it("should return null if phone not found", async () => {
      const found = await userRepository.findByPhone("0999999999");

      expect(found).toBeNull();
    });

    it("should return null for user without phone", async () => {
      await userRepository.create(googleUser);

      const found = await userRepository.findByPhone("0912345678");

      expect(found).toBeNull();
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      const users = Array.from({ length: 25 }, (_, i) => ({
        name: `User ${String(i + 1).padStart(2, "0")}`,
        email: `user${i + 1}@example.com`,
        password: "password123",
        provider: "local" as const,
        role: i < 5 ? ROLES.ADMIN : ROLES.USER,
      }));

      await User.insertMany(users);
    });

    it("should return paginated results with defaults (page=1, limit=10)", async () => {
      const result = await userRepository.findAll();

      expect(result.data).toHaveLength(10);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
    });

    it("should return correct page 2", async () => {
      const result = await userRepository.findAll({}, { page: 2 });

      expect(result.data).toHaveLength(10);
      expect(result.pagination.page).toBe(2);
    });

    it("should return partial page 3", async () => {
      const result = await userRepository.findAll({}, { page: 3 });

      expect(result.data).toHaveLength(5);
      expect(result.pagination.totalPages).toBe(3);
    });

    it("should respect custom limit", async () => {
      const result = await userRepository.findAll({}, { limit: 5 });

      expect(result.data).toHaveLength(5);
      expect(result.pagination.totalPages).toBe(5);
    });

    it("should apply filter", async () => {
      const result = await userRepository.findAll({ role: ROLES.ADMIN });

      expect(result.data).toHaveLength(5);
      expect(result.pagination.total).toBe(5);
      result.data.forEach((user) => {
        expect(user.role).toBe(ROLES.ADMIN);
      });
    });

    it("should sort by createdAt descending by default", async () => {
      const result = await userRepository.findAll();

      for (let i = 1; i < result.data.length; i++) {
        expect(new Date(result.data[i - 1].createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(result.data[i].createdAt).getTime()
        );
      }
    });

    it("should sort ascending when specified", async () => {
      const result = await userRepository.findAll({}, { sort: "createdAt" });

      for (let i = 1; i < result.data.length; i++) {
        expect(new Date(result.data[i - 1].createdAt).getTime()).toBeLessThanOrEqual(
          new Date(result.data[i].createdAt).getTime()
        );
      }
    });

    it("should return empty array when no matches", async () => {
      const result = await userRepository.findAll({ role: "superadmin" as any });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe("update", () => {
    it("should update user fields", async () => {
      const created = await userRepository.create(localUser);

      const updated = await userRepository.update(created._id.toString(), {
        name: "Updated Name",
      });

      expect(updated).not.toBeNull();
      expect(updated!.name).toBe("Updated Name");
      expect(updated!.email).toBe("john@example.com");
    });

    it("should return updated document (new: true)", async () => {
      const created = await userRepository.create(localUser);

      const updated = await userRepository.update(created._id.toString(), {
        role: ROLES.ADMIN,
      });

      expect(updated!.role).toBe(ROLES.ADMIN);
    });

    it("should return null for non-existent id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const updated = await userRepository.update(fakeId, { name: "New Name" });

      expect(updated).toBeNull();
    });

    it("should not update fields not provided", async () => {
      const created = await userRepository.create(localUser);

      const updated = await userRepository.update(created._id.toString(), {
        name: "Updated Name",
      });

      expect(updated!.email).toBe("john@example.com");
      expect(updated!.phone).toBe("0912345678");
    });
  });

  describe("updatePassword", () => {
    it("should hash password before storing", async () => {
      const created = await userRepository.create(localUser);

      const updated = await userRepository.updatePassword(
        created._id.toString(),
        "newpassword456"
      );

      expect(updated).not.toBeNull();

      const userWithPassword = await User.findById(created._id).select("+password");

      expect(userWithPassword!.password).toBeDefined();
      expect(userWithPassword!.password).not.toBe("newpassword456");
    });

    it("should return null for non-existent id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const updated = await userRepository.updatePassword(fakeId, "newpassword");

      expect(updated).toBeNull();
    });
  });

  describe("updateEmailVerified", () => {
    it("should update isEmailVerified to true", async () => {
      const created = await userRepository.create(localUser);
      expect(created.isEmailVerified).toBe(false);

      const updated = await userRepository.updateEmailVerified(
        created._id.toString(),
        true
      );

      expect(updated).not.toBeNull();
      expect(updated!.isEmailVerified).toBe(true);
    });

    it("should update isEmailVerified to false", async () => {
      const created = await userRepository.create({
        ...localUser,
        isEmailVerified: true,
      });

      const updated = await userRepository.updateEmailVerified(
        created._id.toString(),
        false
      );

      expect(updated!.isEmailVerified).toBe(false);
    });

    it("should return null for non-existent id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const updated = await userRepository.updateEmailVerified(fakeId, true);

      expect(updated).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete user by id", async () => {
      const created = await userRepository.create(localUser);

      const deleted = await userRepository.delete(created._id.toString());

      expect(deleted).not.toBeNull();
      expect(deleted!.name).toBe("John Doe");

      const found = await userRepository.findById(created._id.toString());
      expect(found).toBeNull();
    });

    it("should return null for non-existent id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const deleted = await userRepository.delete(fakeId);

      expect(deleted).toBeNull();
    });

    it("should only delete the specified user", async () => {
      const user1 = await userRepository.create(localUser);
      const user2 = await userRepository.create({
        ...localUser,
        email: "user2@example.com",
        phone: "0987654321",
      });

      await userRepository.delete(user1._id.toString());

      const foundUser2 = await userRepository.findById(user2._id.toString());
      expect(foundUser2).not.toBeNull();
    });
  });

  describe("count", () => {
    it("should count all users with default empty filter", async () => {
      await userRepository.create(localUser);
      await userRepository.create(googleUser);

      const count = await userRepository.count();

      expect(count).toBe(2);
    });

    it("should count users matching filter", async () => {
      await userRepository.create(localUser);
      await userRepository.create(googleUser);
      await userRepository.create({
        ...localUser,
        email: "admin@example.com",
        phone: "0900000000",
        role: ROLES.ADMIN,
      });

      const count = await userRepository.count({ role: ROLES.USER });

      expect(count).toBe(2);
    });

    it("should return 0 when no users match", async () => {
      await userRepository.create(localUser);

      const count = await userRepository.count({ role: ROLES.ADMIN });

      expect(count).toBe(0);
    });

    it("should return 0 for empty database", async () => {
      const count = await userRepository.count();

      expect(count).toBe(0);
    });
  });

  describe("exists", () => {
    it("should return true if user exists by email", async () => {
      await userRepository.create(localUser);

      const result = await userRepository.exists({ email: "john@example.com" });

      expect(result).toBe(true);
    });

    it("should return false if user does not exist", async () => {
      const result = await userRepository.exists({ email: "nonexistent@example.com" });

      expect(result).toBe(false);
    });

    it("should return true if user exists by googleId", async () => {
      await userRepository.create(googleUser);

      const result = await userRepository.exists({ googleId: "google_id_123" });

      expect(result).toBe(true);
    });

    it("should return true if user exists by phone", async () => {
      await userRepository.create(localUser);

      const result = await userRepository.exists({ phone: "0912345678" });

      expect(result).toBe(true);
    });

    it("should return false for empty database", async () => {
      const result = await userRepository.exists({ email: "any@example.com" });

      expect(result).toBe(false);
    });

    it("should return true when matching multiple conditions", async () => {
      await userRepository.create(localUser);

      const result = await userRepository.exists({
        email: "john@example.com",
        phone: "0912345678",
      });

      expect(result).toBe(true);
    });

    it("should return false when one condition does not match", async () => {
      await userRepository.create(localUser);

      const result = await userRepository.exists({
        email: "john@example.com",
        phone: "0000000000",
      });

      expect(result).toBe(false);
    });
  });
});
