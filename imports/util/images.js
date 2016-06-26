import React from 'react/react';

export const getUrl = (publicId, w=64, h=64) => $.cloudinary.url(publicId, { width: w, height: h, crop: 'fill', fetch_format: "auto" });
export const make = (publicId, w=64, h=64, className="", style={}) => <img src={ getUrl(publicId, w, h) } className={ className } style={ style } />
