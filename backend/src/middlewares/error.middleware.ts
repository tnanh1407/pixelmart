import { type Request, type Response, type NextFunction } from "express";
import env from "../config/env.ts";

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleMongooseError = (err: any) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return new AppError(messages.join(", "), 400);
  }
  if (err.name === "CastError") {
    return new AppError("Invalid ID format", 400);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(`${field} already exists`, 409);
  }
  return err;
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // todo1 : chạy vào zod
  if (err.name === "ZodError") {
    const messages = err.errors.map((e: any) => e.message);
    return res.status(400).json({
      status: "error",
      message: messages.join(", "),
    });
  }

  // todo2 : chạy vào mongooseError : xử lí  ValidationError , CastError
  if ((err.name && ["ValidationError", "CastError"].includes(err.name)) || err.code === 11000) {
    err = handleMongooseError(err);
  }

  // todo3 : chạy vào 500
  const statusCode = err.statusCode || 500;
  const message = err.isOperational || env.NODE_ENV !== "production"
    ? err.message
    : "Internal server error";

  //todo4 : in lỗi
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export { AppError, errorHandler };
