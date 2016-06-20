export const getAvatar = (avatarId, size = 64) => $.cloudinary.url(avatarId, { width: size, height: size, crop: 'fill', fetch_format: "auto" });
