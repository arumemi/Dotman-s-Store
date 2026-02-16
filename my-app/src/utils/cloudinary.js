const CLOUDINARY_BASE_HOST = 'res.cloudinary.com';

const getCloudName = () => (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
const getUploadPreset = () => (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();

export const isCloudinaryConfigured = () => Boolean(getCloudName() && getUploadPreset());

export const isCloudinaryUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  return /^https?:\/\/res\.cloudinary\.com\//i.test(value);
};

export const extractCloudinaryPublicId = (url) => {
  if (!isCloudinaryUrl(url)) return null;

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.findIndex((segment) => segment === 'upload');

    if (uploadIndex < 0) return null;

    let publicIdSegments = segments.slice(uploadIndex + 1);

    // Strip version segment like "v1733459876"
    if (publicIdSegments[0] && /^v\d+$/.test(publicIdSegments[0])) {
      publicIdSegments = publicIdSegments.slice(1);
    }

    if (publicIdSegments.length === 0) return null;

    const joined = publicIdSegments.join('/');
    return decodeURIComponent(joined.replace(/\.[a-zA-Z0-9]+$/, ''));
  } catch {
    return null;
  }
};

export const getOptimizedCloudinaryImageUrl = (
  imageUrl,
  { width = 800, height = 800, crop = 'fill', quality = 'auto', format = 'auto' } = {}
) => {
  if (!isCloudinaryUrl(imageUrl)) return imageUrl;

  const cloudName = getCloudName();
  const publicId = extractCloudinaryPublicId(imageUrl);

  if (!cloudName || !publicId) return imageUrl;

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    `w_${width}`,
    `h_${height}`,
  ].join(',');

  return `https://${CLOUDINARY_BASE_HOST}/${cloudName}/image/upload/${transformations}/${encodeURI(publicId)}`;
};

export const uploadImageToCloudinary = async (file, options = {}) => {
  const cloudName = getCloudName();
  const uploadPreset = getUploadPreset();

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  if (options.folder) {
    formData.append('folder', options.folder);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    const errorMessage = payload?.error?.message || 'Cloudinary upload failed.';
    throw new Error(errorMessage);
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id,
    bytes: payload.bytes,
    width: payload.width,
    height: payload.height,
    format: payload.format,
  };
};
