import { hashPassword, comparePassword } from "~/utils/bcrypt.ts";

describe("bcrypt utils", () => {
  describe("hashPassword", () => {
    it("should return a hashed password", async () => {
      const password = "mySecretPassword123";
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe("string");
      expect(hashed).not.toBe(password);
    });

    it("should generate different hashes for the same password", async () => {
      const password = "mySecretPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty string password", async () => {
      const hashed = await hashPassword("");
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe("string");
    });

    it("should handle special characters in password", async () => {
      const password = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
      const hashed = await hashPassword(password);
      expect(hashed).toBeDefined();
    });

    it("should handle long password", async () => {
      const password = "a".repeat(1000);
      const hashed = await hashPassword(password);
      expect(hashed).toBeDefined();
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const password = "mySecretPassword123";
      const hashed = await hashPassword(password);

      const isMatch = await comparePassword(password, hashed);
      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const password = "mySecretPassword123";
      const wrongPassword = "wrongPassword456";
      const hashed = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hashed);
      expect(isMatch).toBe(false);
    });

    it("should return false for empty password against hash", async () => {
      const password = "mySecretPassword123";
      const hashed = await hashPassword(password);

      const isMatch = await comparePassword("", hashed);
      expect(isMatch).toBe(false);
    });

    it("should return false for password against empty hash", async () => {
      const password = "mySecretPassword123";
      const isMatch = await comparePassword(password, "");
      expect(isMatch).toBe(false);
    });

    it("should handle special characters correctly", async () => {
      const password = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
      const hashed = await hashPassword(password);

      const isMatch = await comparePassword(password, hashed);
      expect(isMatch).toBe(true);
    });

    it("should handle long password correctly", async () => {
      const password = "a".repeat(1000);
      const hashed = await hashPassword(password);

      const isMatch = await comparePassword(password, hashed);
      expect(isMatch).toBe(true);
    });
  });
});
