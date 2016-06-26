import ImagesHelper from './images';

export const getUrl = (avatarId, size=64) => ImagesHelper.getUrl(avatarId, size, size);
