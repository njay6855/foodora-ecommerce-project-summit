import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ProductGallery = ({ imageUrls }) => {
  if (!imageUrls || imageUrls.length === 0) {
    
    return (
      <div className="text-center p-4 bg-light">
        <span>No images available</span>
      </div>
    );
  }
  const galleryItems = imageUrls.map(url => ({
    original: url,
    thumbnail: url,
    originalAlt: 'Product image',
    thumbnailAlt: 'Product thumbnail'
  }));

  return (
    <ImageGallery
      items={galleryItems}
      showPlayButton={false}
      showFullscreenButton={true}
      showNav= {imageUrls.length > 1}
      thumbnailPosition="bottom"
    />
  );
};

export default ProductGallery;
