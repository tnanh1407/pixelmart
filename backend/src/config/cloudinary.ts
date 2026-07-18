import { v2 as cloudinary } from "cloudinary";
import env from "./env.ts";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDERS = {
  USERS: "pixelmart/users",
  VENDORS: "pixelmart/vendors",
  PRODUCTS: "pixelmart/products",
  STORES: "pixelmart/stores",
  CATEGORIES: "pixelmart/categories",
  CAMPAIGNS: "pixelmart/campaigns",
  BANNERS: "pixelmart/banners",
  REVIEWS: "pixelmart/reviews",
  CHAT: "pixelmart/chat",
  RETURNS: "pixelmart/returns",
} as const;

// Helper paths for sub-folder organization
export const getFolder = {
  user: (userId: string) => ({
    avatar: `${CLOUDINARY_FOLDERS.USERS}/${userId}/avatar`,
    reviewImages: `${CLOUDINARY_FOLDERS.USERS}/${userId}/reviews`,
  }),
  vendor: (vendorId: string) => ({
    avatar: `${CLOUDINARY_FOLDERS.VENDORS}/${vendorId}/avatar`,
    banner: `${CLOUDINARY_FOLDERS.VENDORS}/${vendorId}/banner`,
    identity: `${CLOUDINARY_FOLDERS.VENDORS}/${vendorId}/identity`,
    license: `${CLOUDINARY_FOLDERS.VENDORS}/${vendorId}/license`,
  }),
  product: (productId: string) => ({
    images: `${CLOUDINARY_FOLDERS.PRODUCTS}/${productId}/images`,
    gallery: `${CLOUDINARY_FOLDERS.PRODUCTS}/${productId}/gallery`,
  }),
  store: (storeId: string) => ({
    logo: `${CLOUDINARY_FOLDERS.STORES}/${storeId}/logo`,
  }),
  category: (categoryId: string) => ({
    image: `${CLOUDINARY_FOLDERS.CATEGORIES}/${categoryId}/image`,
  }),
  campaign: (campaignId: string) => ({
    source: `${CLOUDINARY_FOLDERS.CAMPAIGNS}/${campaignId}/source`,
  }),
  banner: (bannerId: string) => ({
    image: `${CLOUDINARY_FOLDERS.BANNERS}/${bannerId}/image`,
  }),
  review: (reviewId: string) => ({
    images: `${CLOUDINARY_FOLDERS.REVIEWS}/${reviewId}/images`,
  }),
  chat: (chatMessageId: string) => ({
    attachment: `${CLOUDINARY_FOLDERS.CHAT}/${chatMessageId}/attachment`,
  }),
  return: (returnId: string) => ({
    images: `${CLOUDINARY_FOLDERS.RETURNS}/${returnId}/images`,
  }),
};

// Backward compatibility
export const getUserFolder = (userId: string) => ({
  avatars: `${CLOUDINARY_FOLDERS.USERS}/${userId}/avatars`,
  reviews: `${CLOUDINARY_FOLDERS.USERS}/${userId}/reviews`,
});

export default cloudinary;
