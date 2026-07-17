import { v2 as cloudinary } from "cloudinary";
import env from "./env.ts";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDERS = {
  USERS: "pixelmart/users",
  CAMPAIGNS: "pixelmart/campaigns",
  PRODUCTS: "pixelmart/products",
  STORES: "pixelmart/stores",
  CATEGORIES: "pixelmart/categories",
};

export const getUserFolder = (userId: string) => ({
  avatars: `${CLOUDINARY_FOLDERS.USERS}/${userId}/avatars`,
  reviews: `${CLOUDINARY_FOLDERS.USERS}/${userId}/reviews`,
});

export default cloudinary;

