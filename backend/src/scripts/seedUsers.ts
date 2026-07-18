import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Vendor from "../models/vendor.model.js";
import Cart from "../models/cart.model.js";
import Voucher from "../models/voucher.model.js";
import Notification from "../models/notification.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import Wishlist from "../models/wishlist.model.js";
import StoreFollow from "../models/storeFollow.model.js";
import ReturnRequest from "../models/returnRequest.model.js";
import VoucherUsage from "../models/voucherUsage.model.js";
import Banner from "../models/banner.model.js";
import PaymentTransaction from "../models/paymentTransaction.model.js";
import ChatRoom from "../models/chatRoom.model.js";
import ChatMessage from "../models/chatMessage.model.js";
import { userSeedData } from "../data/user_seed_data.js";
import { vendorSeedData } from "../data/vendor_seed_data.js";
import { cartSeedData } from "../data/cart_seed_data.js";
import { voucherSeedData } from "../data/voucher_seed_data.js";
import { notificationSeedData } from "../data/notification_seed_data.js";
import { orderSeedData } from "../data/order_seed_data.js";
import { reviewSeedData } from "../data/review_seed_data.js";
import { wishlistSeedData } from "../data/wishlist_seed_data.js";
import { storeFollowSeedData } from "../data/storeFollow_seed_data.js";
import { returnRequestSeedData } from "../data/returnRequest_seed_data.js";
import { voucherUsageSeedData } from "../data/voucherUsage_seed_data.js";
import { bannerSeedData } from "../data/banner_seed_data.js";
import { paymentTransactionSeedData } from "../data/paymentTransaction_seed_data.js";
import { chatRoomSeedData } from "../data/chatRoom_seed_data.js";
import { chatMessageSeedData } from "../data/chatMessage_seed_data.js";
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

      // Use pre-defined _id from seed data, or generate new UUID
      const userId = data._id || uuidv4();

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
        dob: data.dob || null,
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
    console.log(`Successfully seeded ${inserted.length} users!`);

    // Seed Vendors
    console.log(`\n=== Seeding Vendors ===`);
    console.log("Clearing existing vendors...");
    await Vendor.deleteMany({});
    console.log("Cleared.");

    console.log(`Inserting ${vendorSeedData.length} vendors...`);
    const insertedVendors = await Vendor.insertMany(vendorSeedData);
    console.log(`Successfully seeded ${insertedVendors.length} vendors!`);

    const approved = insertedVendors.filter((v) => v.status === "approved");
    const pending = insertedVendors.filter((v) => v.status === "pending");
    const rejected = insertedVendors.filter((v) => v.status === "rejected");
    const suspended = insertedVendors.filter((v) => v.status === "suspended");
    console.log(`  Approved:  ${approved.length}`);
    console.log(`  Pending:   ${pending.length}`);
    console.log(`  Rejected:  ${rejected.length}`);
    console.log(`  Suspended: ${suspended.length}`);

    // Seed Carts
    console.log(`\n=== Seeding Carts ===`);
    console.log("Clearing existing cart items...");
    await Cart.deleteMany({});
    const insertedCarts = await Cart.insertMany(cartSeedData);
    console.log(`Successfully seeded ${insertedCarts.length} cart items!`);

    // Seed Vouchers
    console.log(`\n=== Seeding Vouchers ===`);
    console.log("Clearing existing vouchers...");
    await Voucher.deleteMany({});
    const insertedVouchers = await Voucher.insertMany(voucherSeedData);
    const platformVouchers = insertedVouchers.filter((v) => v.scope === "platform");
    const storeVouchers = insertedVouchers.filter((v) => v.scope === "store");
    const activeVouchers = insertedVouchers.filter((v) => v.status === "active");
    console.log(`Successfully seeded ${insertedVouchers.length} vouchers!`);
    console.log(`  Platform: ${platformVouchers.length}`);
    console.log(`  Store:    ${storeVouchers.length}`);
    console.log(`  Active:   ${activeVouchers.length}`);

    // Seed Notifications
    console.log(`\n=== Seeding Notifications ===`);
    console.log("Clearing existing notifications...");
    await Notification.deleteMany({});
    const insertedNotifications = await Notification.insertMany(notificationSeedData);
    const unreadCount = insertedNotifications.filter((n) => !n.isRead).length;
    console.log(`Successfully seeded ${insertedNotifications.length} notifications!`);
    console.log(`  Unread: ${unreadCount}`);

    // Seed Orders
    console.log(`\n=== Seeding Orders ===`);
    console.log("Clearing existing orders...");
    await Order.deleteMany({});
    const insertedOrders = await Order.insertMany(orderSeedData);
    const statusCounts: Record<string, number> = {};
    insertedOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    console.log(`Successfully seeded ${insertedOrders.length} orders!`);
    for (const [status, count] of Object.entries(statusCounts)) {
      console.log(`  ${status}: ${count}`);
    }

    // Seed Reviews
    console.log(`\n=== Seeding Reviews ===`);
    console.log("Clearing existing reviews...");
    await Review.deleteMany({});
    const insertedReviews = await Review.insertMany(reviewSeedData);
    console.log(`Successfully seeded ${insertedReviews.length} reviews!`);

    // Seed Wishlists
    console.log(`\n=== Seeding Wishlists ===`);
    console.log("Clearing existing wishlists...");
    await Wishlist.deleteMany({});
    const insertedWishlists = await Wishlist.insertMany(wishlistSeedData);
    console.log(`Successfully seeded ${insertedWishlists.length} wishlist items!`);

    // Seed StoreFollows
    console.log(`\n=== Seeding StoreFollows ===`);
    console.log("Clearing existing store follows...");
    await StoreFollow.deleteMany({});
    const insertedFollows = await StoreFollow.insertMany(storeFollowSeedData);
    console.log(`Successfully seeded ${insertedFollows.length} store follows!`);

    // Seed ReturnRequests
    console.log(`\n=== Seeding ReturnRequests ===`);
    console.log("Clearing existing return requests...");
    await ReturnRequest.deleteMany({});
    const insertedReturns = await ReturnRequest.insertMany(returnRequestSeedData);
    console.log(`Successfully seeded ${insertedReturns.length} return requests!`);

    // Seed VoucherUsages
    console.log(`\n=== Seeding VoucherUsages ===`);
    console.log("Clearing existing voucher usages...");
    await VoucherUsage.deleteMany({});
    const insertedUsages = await VoucherUsage.insertMany(voucherUsageSeedData);
    console.log(`Successfully seeded ${insertedUsages.length} voucher usages!`);

    // Seed Banners
    console.log(`\n=== Seeding Banners ===`);
    console.log("Clearing existing banners...");
    await Banner.deleteMany({});
    const insertedBanners = await Banner.insertMany(bannerSeedData);
    console.log(`Successfully seeded ${insertedBanners.length} banners!`);

    // Seed PaymentTransactions
    console.log(`\n=== Seeding PaymentTransactions ===`);
    console.log("Clearing existing payment transactions...");
    await PaymentTransaction.deleteMany({});
    const insertedPayments = await PaymentTransaction.insertMany(paymentTransactionSeedData);
    console.log(`Successfully seeded ${insertedPayments.length} payment transactions!`);

    // Seed ChatRooms
    console.log(`\n=== Seeding ChatRooms ===`);
    console.log("Clearing existing chat rooms...");
    await ChatRoom.deleteMany({});
    const insertedRooms = await ChatRoom.insertMany(chatRoomSeedData);
    console.log(`Successfully seeded ${insertedRooms.length} chat rooms!`);

    // Seed ChatMessages
    console.log(`\n=== Seeding ChatMessages ===`);
    console.log("Clearing existing chat messages...");
    await ChatMessage.deleteMany({});
    const insertedMessages = await ChatMessage.insertMany(chatMessageSeedData);
    console.log(`Successfully seeded ${insertedMessages.length} chat messages!`);

    console.log("\n--- Account Summary ---");
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
