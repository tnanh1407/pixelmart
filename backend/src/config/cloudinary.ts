import { v2 as cloudinary } from "cloudinary";
import env from "./env.ts";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDERS = {
  USERS: "pixelmart/users",
  PRODUCTS: "pixelmart/products",
  CATEGORIES: "pixelmart/categories",
  CAMPAIGNS: "pixelmart/campaigns",
  BANNERS: "pixelmart/banners",
  RETURNS: "pixelmart/returns",
} as const;

// Helper paths for sub-folder organization
export const getFolder = {
  user: (userId: string) => ({
    avatar: `${CLOUDINARY_FOLDERS.USERS}/${userId}/avatar`,
    reviewImages: `${CLOUDINARY_FOLDERS.USERS}/${userId}/reviews`,
  }),
  product: (productId: string) => ({
    images: `${CLOUDINARY_FOLDERS.PRODUCTS}/${productId}/images`,
    gallery: `${CLOUDINARY_FOLDERS.PRODUCTS}/${productId}/gallery`,
  }),
  category: (categoryId: string) => ({
    image: `${CLOUDINARY_FOLDERS.CATEGORIES}/${categoryId}/image`,
  }),
  campaign: (campaignId: string) => ({
    source: `${CLOUDINARY_FOLDERS.CAMPAIGNS}/${campaignId}/source`,
  }),
  return: (returnId: string) => ({
    images: `${CLOUDINARY_FOLDERS.RETURNS}/${returnId}/images`,
  }),
};
export default cloudinary;
