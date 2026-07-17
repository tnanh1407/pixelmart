import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import { userSeedData } from "../data/user_seed_data.js";
import { hashPassword } from "../utils/bcrypt.js";

dotenv.config();

const mongoUri = process.env.URL_MONGODB;
if (!mongoUri) {
  console.error("Missing URL_MONGODB env variable");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cache uploaded avatars to avoid re-uploading same image
const avatarCache = new Map<string, string>();

async function uploadAvatar(url: string, userId: string): Promise<string | null> {
  if (!url) return null;

  // Check cache first
  if (avatarCache.has(url)) {
    return avatarCache.get(url)!;
  }

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `pixelmart/users/${userId}/avatars`,
      resource_type: "image",
      public_id: "avatar",
    });
    avatarCache.set(url, result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(`  Failed to upload avatar for user ${userId}:`, error);
    return null;
  }
}

async function seedUsers() {
  try {
    console.log("=== Seeding Users ===");
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri as string);
    console.log("Connected successfully.\n");

    console.log("Clearing existing users...");
    await User.deleteMany({});
    console.log("Cleared.\n");

    console.log("Uploading avatars to Cloudinary...");
    const usersToInsert = [];

    for (let i = 0; i < userSeedData.length; i++) {
      const data = userSeedData[i];

      const email = data.email;
      const phone = data.phone;

      // Generate UUID for user ID (for Cloudinary folder path)
      const userId = uuidv4();

      // Upload avatar to Cloudinary: pixelmart/users/:id/avatars/avatar
      let avatarUrl = null;
      if (data.avatar) {
        avatarUrl = await uploadAvatar(data.avatar, userId);
        if (avatarUrl) {
          process.stdout.write(`  [${i + 1}/${userSeedData.length}] ${data.name} - OK\n`);
        }
      }

      // Hash password for local provider
      let hashedPassword: string | undefined;
      if (data.password) {
        hashedPassword = await hashPassword(data.password);
      }

      const userDoc: any = {
        _id: userId,
        name: data.name,
        email,
        gender: data.gender,
        dob: data.dob ? new Date(data.dob) : null,
        role: data.role,
        phone,
        provider: data.provider,
        avatar: avatarUrl,
        isEmailVerified: data.isEmailVerified,
        isPhoneVerified: data.isPhoneVerified,
        isActive: data.isActive,
        addresses: data.addresses || [],
      };

      if (data.provider === "google") {
        userDoc.googleId = `google_${i + 1}_${Math.random().toString(36).slice(2)}`;
      } else {
        // Local users MUST have a password
        userDoc.password = hashedPassword || await hashPassword("Password123!");
      }

      usersToInsert.push(userDoc);
    }

    console.log(`\nInserting ${usersToInsert.length} users...`);
    const inserted = await User.insertMany(usersToInsert);
    console.log(`Successfully seeded ${inserted.length} users!\n`);

    console.log("--- Account Summary ---");
    const admins = inserted.filter((u) => u.role === "admin");
    const vendors = inserted.filter((u) => u.role === "vendor");
    const users = inserted.filter((u) => u.role === "user");

    console.log(`  Admins:  ${admins.length} (admin1-5@gmail.com / Password123!)`);
    console.log(`  Vendors: ${vendors.length} (vendor1-30@gmail.com / Password123!)`);
    console.log(`  Users:   ${users.length} (user1-180@gmail.com / Password123!)`);
    console.log(`  Total:   ${inserted.length} users`);

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("User seeding failed:", error);
    process.exit(1);
  }
}

seedUsers();
