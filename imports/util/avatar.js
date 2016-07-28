import React from 'react';
import ImagesHelper from './images';

import Avatar from 'material-ui/Avatar';

export const getUrl = (avatarId, size=64) => ImagesHelper.getUrl(avatarId, size, size, { dpr: 2.0 });
export const getImage = (avatarId, size=64) => <img src={ getUrl(avatarId, size) } />;

export const makeAvatar = (avatarId, size=64, style={}) => <Avatar src={ ImagesHelper.getUrl(avatarId, size, size, { dpr: 2.0 }) } size={ size } style={ style } />;
export const makeAvatarIcon = (icon, backgroundColor, size=64, style={}) => <Avatar icon={ icon } size={ size } backgroundColor={ backgroundColor } style={ style } />;
