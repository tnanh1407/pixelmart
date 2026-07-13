import jwt from "jsonwebtoken";

jest.mock("~/config/env.ts", () => ({
  __esModule: true,
  default: {
    JWT_SECRET: "test_access_secret",
    JWT_REFRESH_SECRET: "test_refresh_secret",
  },
}));

import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  JwtPayload,
} from "~/utils/jwt.ts";

const mockPayload: JwtPayload = {
  userId: "user123",
  email: "test@example.com",
  role: "user",
};

describe("jwt utils", () => {
  describe("generateAccessToken", () => {
    it("should return a string token", () => {
      const token = generateAccessToken(mockPayload);
      expect(typeof token).toBe("string");
    });

    it("should generate a valid jwt format token", () => {
      const token = generateAccessToken(mockPayload);
      const parts = token.split(".");
      expect(parts).toHaveLength(3);
    });

    it("should encode the payload correctly", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = jwt.decode(token) as JwtPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should sign with JWT_SECRET", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = jwt.verify(token, "test_access_secret") as JwtPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
    });

    it("should throw error when signed with wrong secret", () => {
      const token = generateAccessToken(mockPayload);

      expect(() => {
        jwt.verify(token, "wrong_secret");
      }).toThrow();
    });

    it("should set expiry to 15 minutes", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty("exp");
      expect(decoded).toHaveProperty("iat");
      expect(decoded.exp - decoded.iat).toBe(900); // 15 minutes = 900 seconds
    });
  });

  describe("generateRefreshToken", () => {
    it("should return a string token", () => {
      const token = generateRefreshToken(mockPayload);
      expect(typeof token).toBe("string");
    });

    it("should generate a valid jwt format token", () => {
      const token = generateRefreshToken(mockPayload);
      const parts = token.split(".");
      expect(parts).toHaveLength(3);
    });

    it("should encode the payload correctly", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = jwt.decode(token) as JwtPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should sign with JWT_REFRESH_SECRET", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = jwt.verify(token, "test_refresh_secret") as JwtPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
    });

    it("should throw error when signed with wrong secret", () => {
      const token = generateRefreshToken(mockPayload);

      expect(() => {
        jwt.verify(token, "wrong_secret");
      }).toThrow();
    });

    it("should set expiry to 7 days", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty("exp");
      expect(decoded).toHaveProperty("iat");
      expect(decoded.exp - decoded.iat).toBe(604800); // 7 days = 604800 seconds
    });
  });

  describe("generateTokenPair", () => {
    it("should return an object with accessToken and refreshToken", () => {
      const tokens = generateTokenPair(mockPayload);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
    });

    it("should return two different tokens", () => {
      const tokens = generateTokenPair(mockPayload);

      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });

    it("should generate valid jwt format for both tokens", () => {
      const tokens = generateTokenPair(mockPayload);

      expect(tokens.accessToken.split(".")).toHaveLength(3);
      expect(tokens.refreshToken.split(".")).toHaveLength(3);
    });

    it("should encode the same payload in both tokens", () => {
      const tokens = generateTokenPair(mockPayload);

      const accessDecoded = jwt.decode(tokens.accessToken) as JwtPayload;
      const refreshDecoded = jwt.decode(tokens.refreshToken) as JwtPayload;

      expect(accessDecoded.userId).toBe(mockPayload.userId);
      expect(refreshDecoded.userId).toBe(mockPayload.userId);
      expect(accessDecoded.email).toBe(mockPayload.email);
      expect(refreshDecoded.email).toBe(mockPayload.email);
    });

    it("should sign tokens with different secrets", () => {
      const tokens = generateTokenPair(mockPayload);

      expect(() => jwt.verify(tokens.accessToken, "test_access_secret")).not.toThrow();
      expect(() => jwt.verify(tokens.refreshToken, "test_refresh_secret")).not.toThrow();
      expect(() => jwt.verify(tokens.accessToken, "test_refresh_secret")).toThrow();
      expect(() => jwt.verify(tokens.refreshToken, "test_access_secret")).toThrow();
    });
  });

  describe("verifyAccessToken", () => {
    it("should return decoded payload for valid token", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should throw error for invalid token", () => {
      expect(() => {
        verifyAccessToken("invalid.token.here");
      }).toThrow();
    });

    it("should throw error for token signed with wrong secret", () => {
      const token = jwt.sign(mockPayload, "wrong_secret", { expiresIn: "15m" });

      expect(() => {
        verifyAccessToken(token);
      }).toThrow();
    });

    it("should throw error for expired token", () => {
      const token = jwt.sign(mockPayload, "test_access_secret", { expiresIn: "0s" });

      expect(() => {
        verifyAccessToken(token);
      }).toThrow();
    });
  });

  describe("verifyRefreshToken", () => {
    it("should return decoded payload for valid token", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should throw error for invalid token", () => {
      expect(() => {
        verifyRefreshToken("invalid.token.here");
      }).toThrow();
    });

    it("should throw error for token signed with wrong secret", () => {
      const token = jwt.sign(mockPayload, "wrong_secret", { expiresIn: "7d" });

      expect(() => {
        verifyRefreshToken(token);
      }).toThrow();
    });

    it("should throw error for expired token", () => {
      const token = jwt.sign(mockPayload, "test_refresh_secret", { expiresIn: "0s" });

      expect(() => {
        verifyRefreshToken(token);
      }).toThrow();
    });
  });

  describe("token pair integration", () => {
    it("should generate and verify access token correctly", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should generate and verify refresh token correctly", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should not verify access token as refresh token", () => {
      const token = generateAccessToken(mockPayload);

      expect(() => {
        verifyRefreshToken(token);
      }).toThrow();
    });

    it("should not verify refresh token as access token", () => {
      const token = generateRefreshToken(mockPayload);

      expect(() => {
        verifyAccessToken(token);
      }).toThrow();
    });
  });
});
