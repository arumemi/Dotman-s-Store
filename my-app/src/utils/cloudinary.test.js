import { describe, expect, it } from 'vitest';
import {
  extractCloudinaryPublicId,
  getOptimizedCloudinaryImageUrl,
  isCloudinaryUrl,
} from './cloudinary';

describe('cloudinary utility helpers', () => {
  it('detects valid cloudinary urls', () => {
    expect(isCloudinaryUrl('https://res.cloudinary.com/demo/image/upload/v1/sample.jpg')).toBe(true);
    expect(isCloudinaryUrl('http://res.cloudinary.com/demo/image/upload/sample.jpg')).toBe(true);
    expect(isCloudinaryUrl('https://example.com/image.jpg')).toBe(false);
    expect(isCloudinaryUrl('')).toBe(false);
  });

  it('extracts public id from cloudinary URL with version and extension', () => {
    const publicId = extractCloudinaryPublicId(
      'https://res.cloudinary.com/demo/image/upload/v1733459876/products/my-phone-front.jpeg'
    );

    expect(publicId).toBe('products/my-phone-front');
  });

  it('applies optimization only when cloud name is configured', () => {
    const original = 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg';
    const transformed = getOptimizedCloudinaryImageUrl(original, { width: 300, height: 300 });
    const hasCloudName = Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    if (!hasCloudName) {
      expect(transformed).toBe(original);
      return;
    }

    expect(transformed).toContain('/image/upload/f_auto,q_auto,c_fill,w_300,h_300/');
    expect(transformed).toContain('/sample');
  });

  it('returns original value for non-cloudinary images', () => {
    const imageUrl = 'https://images.example.com/products/1.jpg';
    expect(getOptimizedCloudinaryImageUrl(imageUrl)).toBe(imageUrl);
  });
});
