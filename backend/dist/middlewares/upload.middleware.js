import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { AppError } from "./error.middleware.js";
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
    async (req, _res, next) => {
        const file = req.file;
        if (!file)
            return next();
        const type = await fileTypeFromBuffer(file.buffer);
        if (!type || !allowed.includes(type.mime)) {
            return next(new AppError("Invalid image file", 400));
        }
        next();
    },
];
export const uploadCampaignImage = [
    upload.single("image"),
    async (req, _res, next) => {
        const file = req.file;
        if (!file)
            return next();
        const type = await fileTypeFromBuffer(file.buffer);
        if (!type || !allowed.includes(type.mime)) {
            return next(new AppError("Invalid image file", 400));
        }
        next();
    },
];
export const uploadCategoryImage = [
    upload.single("image"),
    async (req, _res, next) => {
        const file = req.file;
        if (!file)
            return next();
        const type = await fileTypeFromBuffer(file.buffer);
        if (!type || !allowed.includes(type.mime)) {
            return next(new AppError("Invalid image file", 400));
        }
        next();
    },
];
