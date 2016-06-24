import ImagesHelper from './images';

export const getAvatar = (avatarId, size = 64) => ImagesHelper.getURL(avatarId, 64, 64);
