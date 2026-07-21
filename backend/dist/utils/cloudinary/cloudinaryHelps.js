export const extractPublicId = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes("cloudinary"))
        return null;
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1)
        return null;
    const pathWithFile = parts.slice(uploadIndex + 1).join("/");
    const withoutVersion = pathWithFile.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
};
