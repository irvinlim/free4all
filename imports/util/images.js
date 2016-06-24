import React from 'react/react';

export const getURL = (publicId, w=64, h=64) => $.cloudinary.url(publicId, { width: w, height: h, crop: 'fill', fetch_format: "auto" });
export const make = (publicId, w=64, h=64, style={}) => <img src={ getURL(publicId, w, h) } style={ style } />
