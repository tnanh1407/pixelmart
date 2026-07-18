import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { hashPassword } from "../utils/bcrypt.js";

// Models
import User from "../models/user.model.js";
import Vendor from "../models/vendor.model.js";
import Category from "../models/category.model.js";
import Store from "../models/store.model.js";
import Product from "../models/product.model.js";
import FlashSale from "../models/flashSale.model.js";
import FlashSaleItem from "../models/flashSaleItem.model.js";
import Campaign from "../models/campaign.model.js";
import CampaignItem from "../models/campaignItem.model.js";
import Cart from "../models/cart.model.js";
import Voucher from "../models/voucher.model.js";
import VoucherUsage from "../models/voucherUsage.model.js";
import Order from "../models/order.model.js";
import PaymentTransaction from "../models/paymentTransaction.model.js";
import ReturnRequest from "../models/returnRequest.model.js";
import Review from "../models/review.model.js";
import Wishlist from "../models/wishlist.model.js";
import StoreFollow from "../models/storeFollow.model.js";
import Notification from "../models/notification.model.js";
import Banner from "../models/banner.model.js";
import ChatRoom from "../models/chatRoom.model.js";
import ChatMessage from "../models/chatMessage.model.js";

// Seed Data
import { userSeedData } from "../data/user_seed_data.js";
import { vendorSeedData } from "../data/vendor_seed_data.js";
import { categorySeedData } from "../data/category_seed_data.js";
import { storeSeedData } from "../data/store_seed_data.js";
import { productSeedData } from "../data/product_seed_data.js";
import { flashSaleSeedData } from "../data/flashSale_seed_data.js";
import { flashSaleItemSeedData } from "../data/flashSaleItem_seed_data.js";
import { campaignSeedData } from "../data/campaign_seed_data.js";
import { campaignItemSeedData } from "../data/campaignItem_seed_data.js";
import { cartSeedData } from "../data/cart_seed_data.js";
import { voucherSeedData } from "../data/voucher_seed_data.js";
import { voucherUsageSeedData } from "../data/voucherUsage_seed_data.js";
import { orderSeedData } from "../data/order_seed_data.js";
import { paymentTransactionSeedData } from "../data/paymentTransaction_seed_data.js";
import { returnRequestSeedData } from "../data/returnRequest_seed_data.js";
import { reviewSeedData } from "../data/review_seed_data.js";
import { wishlistSeedData } from "../data/wishlist_seed_data.js";
import { storeFollowSeedData } from "../data/storeFollow_seed_data.js";
import { notificationSeedData } from "../data/notification_seed_data.js";
import { bannerSeedData } from "../data/banner_seed_data.js";
import { chatRoomSeedData } from "../data/chatRoom_seed_data.js";
import { chatMessageSeedData } from "../data/chatMessage_seed_data.js";

dotenv.config();

// ─── CLI Args ───────────────────────────────────────────────
const args = process.argv.slice(2);
const SKIP_CLOUDINARY = args.includes("--skip-cloudinary");
const DRY_RUN = args.includes("--dry-run");
const RESET = !args.includes("--no-reset"); // reset by default

// ─── Config ─────────────────────────────────────────────────
const mongoUri = process.env.URL_MONGODB;
if (!mongoUri) {
  console.error("Missing URL_MONGODB env variable");
  process.exit(1);
}

if (!SKIP_CLOUDINARY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ─── Helpers ────────────────────────────────────────────────
const avatarCache = new Map<string, string>();

async function uploadAvatar(url: string, userId: string): Promise<string | null> {
  if (!url || SKIP_CLOUDINARY) return null;
  if (avatarCache.has(url)) return avatarCache.get(url)!;
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `pixelmart/users/${userId}/avatars`,
      resource_type: "image",
      public_id: "avatar",
    });
    avatarCache.set(url, result.secure_url);
    return result.secure_url;
  } catch {
    return null;
  }
}

// ─── Reset DB ───────────────────────────────────────────────
const allModels: any[] = [
  User, Vendor, Category, Store, Product,
  FlashSale, FlashSaleItem, Campaign, CampaignItem,
  Cart, Voucher, VoucherUsage, Order, PaymentTransaction,
  ReturnRequest, Review, Wishlist, StoreFollow,
  Notification, Banner, ChatRoom, ChatMessage,
];

async function resetDatabase() {
  console.log("Clearing all collections...");
  for (const model of allModels) {
    await model.deleteMany({});
  }
  console.log("All collections cleared.\n");
}

// ─── Seed Helpers ───────────────────────────────────────────
async function seedCollection(name: string, model: any, data: any[]) {
  if (!data || data.length === 0) {
    console.log(`  ⏭  ${name}: no data`);
    return [];
  }
  if (DRY_RUN) {
    console.log(`  🔍 ${name}: ${data.length} records (dry-run)`);
    return [];
  }
  const result = await model.insertMany(data as any[]);
  console.log(`  ✓  ${name}: ${result.length} records`);
  return result;
}

// ─── Main ───────────────────────────────────────────────────
async function seed() {
  const startTime = Date.now();
  console.log("╔══════════════════════════════════════╗");
  console.log("║     PixelMart — Database Seed        ║");
  console.log("╚══════════════════════════════════════╝\n");

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri as string);
  console.log(`Connected to: ${mongoose.connection.host}\n`);

  if (RESET) await resetDatabase();

  // ─── Tier 1: Users ──────────────────────────────────────
  console.log("─── Tier 1: Users & Auth ───");

  const usersToInsert = [];
  for (let i = 0; i < userSeedData.length; i++) {
    const data = userSeedData[i] as any;
    const userId = data._id || uuidv4();

    let avatarUrl = null;
    if (!SKIP_CLOUDINARY && data.avatar) {
      avatarUrl = await uploadAvatar(data.avatar, userId);
      if (avatarUrl) process.stdout.write(`  ${i + 1}/${userSeedData.length} ${data.name}\r`);
    }

    let hashedPassword: string | undefined;
    if (data.password) hashedPassword = await hashPassword(data.password);

    const doc: any = {
      _id: userId, name: data.name, email: data.email,
      gender: data.gender, dob: data.dob || null,
      role: data.role, phone: data.phone,
      provider: data.provider, avatar: avatarUrl,
      isEmailVerified: data.isEmailVerified,
      isPhoneVerified: data.isPhoneVerified,
      isActive: data.isActive,
      addresses: data.addresses || [],
    };

    if (data.provider === "google") {
      doc.googleId = `google_${i + 1}_${Math.random().toString(36).slice(2)}`;
    } else {
      doc.password = hashedPassword || await hashPassword("Password123!");
    }

    usersToInsert.push(doc);
  }

  const insertedUsers = await seedCollection("Users", User, usersToInsert);
  const roleCounts: Record<string, number> = { admin: 0, vendor: 0, user: 0 };
  insertedUsers.forEach((u: any) => { if (u.role in roleCounts) roleCounts[u.role]++; });
  console.log(`      admin=${roleCounts.admin} vendor=${roleCounts.vendor} user=${roleCounts.user}`);

  // ─── Tier 2: Core Entities ──────────────────────────────
  console.log("\n─── Tier 2: Core Entities ───");
  await seedCollection("Vendors", Vendor, vendorSeedData);
  await seedCollection("Categories", Category, categorySeedData);
  await seedCollection("Stores", Store, storeSeedData);
  await seedCollection("Products", Product, productSeedData);

  // ─── Tier 3: Marketing ──────────────────────────────────
  console.log("\n─── Tier 3: Marketing ───");
  await seedCollection("FlashSales", FlashSale, flashSaleSeedData);
  await seedCollection("FlashSaleItems", FlashSaleItem, flashSaleItemSeedData);
  await seedCollection("Campaigns", Campaign, campaignSeedData);
  await seedCollection("CampaignItems", CampaignItem, campaignItemSeedData);
  await seedCollection("Vouchers", Voucher, voucherSeedData);
  await seedCollection("Banners", Banner, bannerSeedData);

  // ─── Tier 4: User Data ──────────────────────────────────
  console.log("\n─── Tier 4: User Data ───");
  await seedCollection("Carts", Cart, cartSeedData);
  await seedCollection("Orders", Order, orderSeedData);
  await seedCollection("PaymentTransactions", PaymentTransaction, paymentTransactionSeedData);
  await seedCollection("VoucherUsages", VoucherUsage, voucherUsageSeedData);
  await seedCollection("ReturnRequests", ReturnRequest, returnRequestSeedData);
  await seedCollection("Reviews", Review, reviewSeedData);
  await seedCollection("Wishlists", Wishlist, wishlistSeedData);
  await seedCollection("StoreFollows", StoreFollow, storeFollowSeedData);

  // ─── Tier 5: Communication ──────────────────────────────
  console.log("\n─── Tier 5: Communication ───");
  await seedCollection("Notifications", Notification, notificationSeedData);
  await seedCollection("ChatRooms", ChatRoom, chatRoomSeedData);
  await seedCollection("ChatMessages", ChatMessage, chatMessageSeedData);

  // ─── Summary ─────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║   Seed completed in ${elapsed}s                  ║`);
  console.log(`╚══════════════════════════════════════╝`);

  console.log("\nAccounts for testing:");
  console.log("  Admin:   admin1@gmail.com  / Password123!");
  console.log("  Vendor:  vendor1@gmail.com / Password123!");
  console.log("  User:    user1@gmail.com   / Password123!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
