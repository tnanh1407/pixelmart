import VerificationToken, {
  type IVerificationToken,
  type IVerificationTokenDocument,
  type TokenType,
} from "../models/verification-token.model.js";

class VerificationTokenRepository {
  async create(data: IVerificationToken): Promise<IVerificationTokenDocument> {
    return await VerificationToken.create(data);
  }

  async findValidCode(
    userId: string,
    code: string,
    type: TokenType
  ): Promise<IVerificationTokenDocument | null> {
    return await VerificationToken.findOne({
      userId,
      code,
      type,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await VerificationToken.findByIdAndUpdate(id, { used: true });
  }

  async deleteByUserIdAndType(userId: string, type: TokenType): Promise<void> {
    await VerificationToken.deleteMany({ userId, type });
  }

  async countByUserIdAndType(userId: string, type: TokenType): Promise<number> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await VerificationToken.countDocuments({
      userId,
      type,
      createdAt: { $gte: oneDayAgo },
    });
  }

  async findValidToken(
    code: string,
    type: TokenType
  ): Promise<IVerificationTokenDocument | null> {
    return await VerificationToken.findOne({
      code,
      type,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async deleteExpired(): Promise<void> {
    await VerificationToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}

export default new VerificationTokenRepository();
