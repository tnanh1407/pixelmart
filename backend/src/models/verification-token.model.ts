import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { TOKEN_TYPES } from "~/constants/roles.ts"


export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export interface IVerificationToken {
  userId: string;
  code: string;
  type: TokenType;
  expiresAt: Date;
  used: boolean;
}

export interface IVerificationTokenDocument extends IVerificationToken, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const verificationTokenSchema = new mongoose.Schema<IVerificationTokenDocument>(
  {
    _id: {
      type: String,
      default: uuidv4,
    } as any,
    userId: {
      type: String,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Verification code is required"],
      minlength: 6, 
    },
    type: {
      type: String,
      enum: Object.values(TOKEN_TYPES),
      required: [true, "Token type is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
      index: { expires: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationToken = mongoose.model<IVerificationTokenDocument>(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
