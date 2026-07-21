import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const sessionSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
        index: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    isRevoked: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    lastActiveAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ userId: 1, isRevoked: 1 });
const Session = mongoose.model("Session", sessionSchema);
export default Session;
