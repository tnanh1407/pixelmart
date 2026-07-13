import jwt from "jsonwebtoken";
import env from "../config/env.ts";
import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from "~/constants/roles.ts";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET!, {
    expiresIn: JWT_ACCESS_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET!, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const generateTokenPair = (payload: JwtPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET!) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;
};
