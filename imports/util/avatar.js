import React from 'react';
import ImagesHelper from './images';

export const getUrl = (avatarId, size=64) => ImagesHelper.getUrl(avatarId, size, size);
export const getImage = (avatarId, size=64) => <img src={ getUrl(avatarId, size) } />;
