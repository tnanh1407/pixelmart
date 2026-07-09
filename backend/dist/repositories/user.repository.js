import User from "../models/user.model.js";
class UserRepository {
    async create(data) {
        return await User.create(data);
    }
    async findByEmail(email) {
        return await User.findOne({ email });
    }
    async findByEmailWithPassword(email) {
        return await User.findOne({ email }).select("+password");
    }
    async findById(id) {
        return await User.findById(id);
    }
    async findByGoogleId(googleId) {
        return await User.findOne({ googleId });
    }
    async findByPhone(phone) {
        return await User.findOne({ phone });
    }
    async findAll(filter = {}, options = {}) {
        const { page = 1, limit = 10, sort = "-createdAt" } = options;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            User.find(filter).sort(sort).skip(skip).limit(limit),
            User.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }
    async updatePassword(id, password) {
        return await User.findByIdAndUpdate(id, { password }, { new: true });
    }
    async updateEmailVerified(id, isEmailVerified) {
        return await User.findByIdAndUpdate(id, { isEmailVerified }, { new: true });
    }
    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
    async count(filter = {}) {
        return await User.countDocuments(filter);
    }
    async exists(filter) {
        const doc = await User.exists(filter);
        return doc !== null;
    }
}
export default new UserRepository();
