import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { fileTypeFromBuffer } from "file-type";
import { AppError } from "./error.middleware.ts";

const storage = multer.memoryStorage();

const allowed = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      return cb(new AppError("Only image files are allowed", 400));
    }
    cb(null, true);
  },
});

export const uploadAvatar = [
  upload.single("avatar"),
  async (req: Request, _res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) return next();

    const type = await fileTypeFromBuffer(file.buffer);
    if (!type || !allowed.includes(type.mime)) {
      return next(new AppError("Invalid image file", 400));
    }

    next();
  },
];
