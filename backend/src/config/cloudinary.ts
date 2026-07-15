import { v2 as cloudinary } from "cloudinary";
import env from "./env.ts";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDERS = {
  AVATARS: "pixelmart/avatars",
  BANNERS: "pixelmart/banners",
  PRODUCTS: "pixelmart/products",
  STORES: "pixelmart/stores",
};

export default cloudinary;

