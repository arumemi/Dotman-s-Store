import React from 'react';
import { ShopContext } from '../components/shopContex';
import {
  getOptimizedCloudinaryImageUrl,
  isCloudinaryConfigured,
  uploadImageToCloudinary,
} from '../../utils/cloudinary';

const MAX_IMAGE_WIDTH = 1280;
const MAX_IMAGE_HEIGHT = 1280;
const TARGET_IMAGE_SIZE_KB = 220;

const estimateDataUrlSizeKB = (dataUrl) => {
  const base64 = dataUrl.split(',')[1] || '';
  return (base64.length * 3) / 4 / 1024;
};

const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(img);
  };

  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Failed to load image'));
  };

  img.src = objectUrl;
});

const toCompressedDataUrl = (img, width, height, quality) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not initialize canvas context');

  context.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
};

const compressImageForStorage = async (file) => {
  const image = await loadImageFromFile(file);

  let width = image.width;
  let height = image.height;
  const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height, 1);
  width = Math.max(1, Math.floor(width * ratio));
  height = Math.max(1, Math.floor(height * ratio));

  let bestDataUrl = '';

  for (let attempt = 0; attempt < 6; attempt += 1) {
    for (let quality = 0.85; quality >= 0.45; quality -= 0.1) {
      const compressedDataUrl = toCompressedDataUrl(image, width, height, Number(quality.toFixed(2)));
      const compressedSizeKB = estimateDataUrlSizeKB(compressedDataUrl);

      bestDataUrl = compressedDataUrl;
      if (compressedSizeKB <= TARGET_IMAGE_SIZE_KB) {
        return { dataUrl: compressedDataUrl, sizeKB: compressedSizeKB };
      }
    }

    width = Math.max(320, Math.floor(width * 0.85));
    height = Math.max(320, Math.floor(height * 0.85));
  }

  return {
    dataUrl: bestDataUrl,
    sizeKB: estimateDataUrlSizeKB(bestDataUrl),
  };
};

const initialFormState = {
  title: '',
  price: '',
  category: '',
  image: '',
  images: [],
  description: '',
  isNew: false,
  onSale: false,
  outOfStock: false,
  negotiable: false,
};

const admin = () => {
  const { products, addProduct, updateProduct, removeProduct, isAdminAuthenticated, loginAdmin, logoutAdmin } = React.useContext(ShopContext);
  const cloudinaryReady = React.useMemo(() => isCloudinaryConfigured(), []);
  const [formData, setFormData] = React.useState(initialFormState);
  const [editingProductId, setEditingProductId] = React.useState(null);
  const [error, setError] = React.useState('');
  const [formSuccess, setFormSuccess] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [isCompressingImage, setIsCompressingImage] = React.useState(false);
  const [compressionInfo, setCompressionInfo] = React.useState('');
  const [uploadSuccess, setUploadSuccess] = React.useState('');
  const [isDraggingGallery, setIsDraggingGallery] = React.useState(false);
  const imageInputRef = React.useRef(null);
  const galleryInputRef = React.useRef(null);

  const uploadImageFile = async (file) => {
    if (cloudinaryReady) {
      const upload = await uploadImageToCloudinary(file, { folder: 'products' });
      return {
        url: upload.secureUrl,
        info: `Uploaded to Cloudinary (${(upload.bytes / 1024).toFixed(0)}KB)`,
      };
    }

    const originalSizeKB = file.size / 1024;
    const { dataUrl, sizeKB } = await compressImageForStorage(file);
    return {
      url: dataUrl,
      info: `Compressed from ${originalSizeKB.toFixed(0)}KB to ${sizeKB.toFixed(0)}KB (Cloudinary preset missing).`,
    };
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();

    if (loginAdmin(passwordInput)) {
      setAuthError('');
      setPasswordInput('');
      return;
    }

    setAuthError('Incorrect password. Please try again.');
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthError('');
    setPasswordInput('');
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormSuccess('');
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'image') {
      setCompressionInfo('');
      setUploadSuccess('');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setUploadSuccess('');
      setFormSuccess('');
      return;
    }

    try {
      setIsCompressingImage(true);
      setCompressionInfo(cloudinaryReady ? 'Uploading image to Cloudinary...' : 'Compressing image...');
      setUploadSuccess('');
      setFormSuccess('');

      const uploadResult = await uploadImageFile(file);

      setFormData((prev) => ({
        ...prev,
        image: uploadResult.url,
      }));
      setError('');
      setCompressionInfo(uploadResult.info);
      setUploadSuccess(cloudinaryReady
        ? '✅ Cover image uploaded to Cloudinary successfully.'
        : '✅ Cover image uploaded locally. Add Cloudinary preset to upload to cloud.');
    } catch (uploadError) {
      setError(uploadError?.message || 'Could not upload the selected image. Please try again.');
      setCompressionInfo('');
      setUploadSuccess('');
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleGalleryImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const hasInvalidFile = files.some((file) => !file.type.startsWith('image/'));
    if (hasInvalidFile) {
      setError('Please select only image files for additional pictures.');
      return;
    }

    try {
      setIsCompressingImage(true);
      setCompressionInfo(cloudinaryReady
        ? `Uploading ${files.length} image(s) to Cloudinary...`
        : `Compressing ${files.length} image(s)...`);
      setUploadSuccess('');
      setFormSuccess('');

      const uploadedImages = [];
      for (const file of files) {
        const result = await uploadImageFile(file);
        uploadedImages.push(result.url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      setError('');
      setCompressionInfo('');
      setUploadSuccess(cloudinaryReady
        ? `✅ ${uploadedImages.length} additional image(s) uploaded to Cloudinary.`
        : `✅ ${uploadedImages.length} additional image(s) uploaded locally.`);
    } catch (uploadError) {
      setError(uploadError?.message || 'Could not upload one or more images. Please try again.');
      setCompressionInfo('');
      setUploadSuccess('');
    } finally {
      setIsCompressingImage(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
    }
  };

  const handleGalleryDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingGallery(false);

    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length === 0) return;

    const hasInvalidFile = files.some((file) => !file.type.startsWith('image/'));
    if (hasInvalidFile) {
      setError('Only image files can be dropped here.');
      return;
    }

    await handleGalleryImageUpload({ target: { files } });
  };

  const handleMakeCover = (indexToPromote) => {
    setFormData((prev) => {
      const promotedImage = prev.images[indexToPromote];
      if (!promotedImage) return prev;

      const remainingImages = prev.images.filter((_, index) => index !== indexToPromote);
      const nextAdditional = [...remainingImages];

      if (prev.image && prev.image !== promotedImage && !nextAdditional.includes(prev.image)) {
        nextAdditional.unshift(prev.image);
      }

      return {
        ...prev,
        image: promotedImage,
        images: nextAdditional,
      };
    });
    setUploadSuccess('✅ Cover image updated from gallery.');
  };

  const handleRemoveAdditionalImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isCompressingImage) {
      setError('Please wait for image compression to finish.');
      return;
    }

    if (!formData.title.trim() || !formData.category.trim()) {
      setError('Please fill in title and category.');
      return;
    }

    const parsedPrice = Number(formData.price);
    if (!formData.price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    const normalizedProduct = {
      ...formData,
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      images: formData.images,
      price: parsedPrice,
    };

    const cleanAdditionalImages = normalizedProduct.images
      .map((img) => String(img || '').trim())
      .filter(Boolean);

    const mergedImages = [normalizedProduct.image, ...cleanAdditionalImages].filter(Boolean);
    normalizedProduct.images = [...new Set(mergedImages)];
    normalizedProduct.image = normalizedProduct.images[0] || '';

    if (editingProductId !== null) {
      updateProduct({ ...normalizedProduct, id: editingProductId });
      setFormSuccess('✅ Product updated successfully.');
    } else {
      addProduct(normalizedProduct);
      setFormSuccess('✅ Product added successfully.');
    }

    setError('');
    setCompressionInfo('');
    setUploadSuccess('');
    setFormData(initialFormState);
    setEditingProductId(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleEditStart = (product) => {
    setEditingProductId(product.id);
    setError('');
    setFormSuccess('');
    setCompressionInfo('');
    setUploadSuccess('');
    const productImages = Array.isArray(product.images)
      ? product.images.map((img) => String(img || '').trim()).filter(Boolean)
      : [];
    const coverImage = (product.image || productImages[0] || '').trim();
    const additionalImages = productImages.filter((img) => img !== coverImage);

    setFormData({
      title: product.title || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      image: coverImage,
      images: additionalImages,
      description: product.description || '',
      isNew: Boolean(product.isNew),
      onSale: Boolean(product.onSale),
      outOfStock: Boolean(product.outOfStock),
      negotiable: Boolean(product.negotiable),
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData(initialFormState);
    setError('');
    setFormSuccess('');
    setCompressionInfo('');
    setUploadSuccess('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleRemove = (id, title) => {
    const confirmed = window.confirm(`Remove "${title}" from catalog?`);
    if (!confirmed) return;
    removeProduct(id);

    if (editingProductId === id) {
      handleCancelEdit();
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white border border-gray-300 rounded-xl shadow-md p-6 mt-10'>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>Admin Login</h1>
            <p className='text-gray-600 mb-6'>Enter the admin password to continue.</p>

            {authError && (
              <div className='mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg'>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                <input
                  type='password'
                  value={passwordInput}
                  onChange={(event) => {
                    setPasswordInput(event.target.value);
                    setAuthError('');
                  }}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter admin password'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5'
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>Admin Panel</h1>
            <p className='text-gray-600 mt-2'>Add or remove products from your store catalog.</p>
          </div>
          <button
            onClick={handleLogout}
            className='bg-gray-700 hover:bg-gray-800 active:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200'
          >
            Logout
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-white border border-gray-300 rounded-xl shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              {editingProductId !== null ? `Edit Product #${editingProductId}` : 'Add New Product'}
            </h2>

            {error && (
              <div className='mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg'>
                {error}
              </div>
            )}

            {formSuccess && (
              <div className='mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg'>
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                <input
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  type='text'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Product title'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                  <input
                    name='price'
                    value={formData.price}
                    onChange={handleChange}
                    type='number'
                    min='0'
                    step='0.01'
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='0.00'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                  <input
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                    type='text'
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Category'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Upload Image (phone/gallery)</label>
                <input
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  disabled={isCompressingImage}
                  type='file'
                  accept='image/*'
                  capture='environment'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-4 file:py-2 file:px-3 file:border-0 file:rounded-md file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200'
                />
                <p className='text-xs text-gray-500 mt-1'>On phone, this lets you choose from camera or gallery.</p>
                <p className='text-xs mt-1 text-gray-600'>
                  {cloudinaryReady
                    ? 'Cloudinary upload is active for this project.'
                    : 'Cloudinary upload preset not configured. Using local compressed image fallback.'}
                </p>
                {compressionInfo && (
                  <p className='text-xs text-green-700 mt-1'>{compressionInfo}</p>
                )}
                {uploadSuccess && (
                  <p className='text-sm text-green-700 bg-green-50 border border-green-300 mt-2 px-3 py-2 rounded-lg'>
                    {uploadSuccess}
                  </p>
                )}
              </div>

              <div className='bg-blue-50/70 border border-blue-200 rounded-xl p-4 sm:p-5'>
                <div className='flex items-start justify-between gap-3 mb-3'>
                  <div>
                    <h3 className='text-sm sm:text-base font-semibold text-gray-800'>More product pictures</h3>
                    <p className='text-xs sm:text-sm text-gray-600'>Upload extra photos to show different angles and details.</p>
                  </div>
                  <span className='text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                    {formData.images.length} added
                  </span>
                </div>

                <input
                  ref={galleryInputRef}
                  onChange={handleGalleryImageUpload}
                  disabled={isCompressingImage}
                  type='file'
                  multiple
                  accept='image/*'
                  className='hidden'
                />

                <div
                  onDragEnter={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDraggingGallery(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDraggingGallery(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDraggingGallery(false);
                  }}
                  onDrop={handleGalleryDrop}
                  className={`mt-2 rounded-xl border-2 border-dashed p-4 sm:p-5 text-center transition-all duration-200 ${
                    isDraggingGallery
                      ? 'border-blue-500 bg-blue-100 shadow-inner'
                      : 'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <p className='text-sm sm:text-base font-semibold text-gray-800'>Drag & drop images here</p>
                  <p className='text-xs sm:text-sm text-gray-600 mt-1'>or choose files from your device</p>
                  <button
                    type='button'
                    onClick={() => galleryInputRef.current?.click()}
                    className='mt-3 inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md'
                  >
                    upload pictures
                  </button>
                </div>

                {formData.images.length > 0 ? (
                  <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mt-4'>
                    {formData.images.map((imageUrl, index) => (
                      <div key={`${imageUrl}-${index}`} className='relative group border border-gray-200 rounded-lg overflow-hidden bg-white'>
                        <img
                          src={getOptimizedCloudinaryImageUrl(imageUrl, { width: 260, height: 260 })}
                          alt={`Additional product ${index + 1}`}
                          className='w-full h-24 sm:h-28 object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveAdditionalImage(index)}
                          className='absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow transition-colors duration-200'
                        >
                          remove
                        </button>
                        <button
                          type='button'
                          onClick={() => handleMakeCover(index)}
                          className='absolute bottom-1.5 left-1.5 bg-blue-500/95 hover:bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow transition-colors duration-200'
                        >
                          make cover
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-gray-500 mt-3'>No extra images yet. Upload multiple for a better product gallery.</p>
                )}
              </div>

              {formData.image && (
                <div>
                  <p className='text-sm font-medium text-gray-700 mb-2'>Image Preview</p>
                  <img
                    src={getOptimizedCloudinaryImageUrl(formData.image, { width: 220, height: 220 })}
                    alt='Product preview'
                    className='w-28 h-28 object-cover rounded-lg border border-gray-300'
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Image URL (optional)</label>
                <input
                  name='image'
                  value={formData.image}
                  onChange={handleChange}
                  type='text'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://...'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description (optional)</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                  placeholder='Describe the product...'
                />
              </div>

              <div className='grid grid-cols-2 gap-3 text-sm text-gray-700'>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' name='isNew' checked={formData.isNew} onChange={handleChange} />
                  New
                </label>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' name='onSale' checked={formData.onSale} onChange={handleChange} />
                  On sale
                </label>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' name='negotiable' checked={formData.negotiable} onChange={handleChange} />
                  Negotiable
                </label>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' name='outOfStock' checked={formData.outOfStock} onChange={handleChange} />
                  Out of stock
                </label>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  type='submit'
                  className='w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5'
                >
                  {editingProductId !== null ? 'Update Product' : 'Add Product'}
                </button>

                {editingProductId !== null && (
                  <button
                    type='button'
                    onClick={handleCancelEdit}
                    className='w-full sm:w-auto bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className='bg-white border border-gray-300 rounded-xl shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Current Products ({products.length})</h2>
            <div className='max-h-[70vh] overflow-auto pr-1'>
              {products.length === 0 ? (
                <p className='text-gray-600'>No products available.</p>
              ) : (
                <div className='space-y-3'>
                  {products.map((product) => (
                    <div key={product.id} className='border border-gray-300 rounded-lg p-3 flex items-center gap-3'>
                      <img
                        src={getOptimizedCloudinaryImageUrl(product.image || 'https://via.placeholder.com/80x80?text=No+Image', { width: 160, height: 160 })}
                        alt={product.title}
                        className='w-16 h-16 object-cover rounded-md border border-gray-200'
                      />

                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-gray-800 truncate'>{product.title}</p>
                        <p className='text-sm text-gray-600'>Category: {product.category || 'N/A'}</p>
                        <p className='text-xs text-blue-700'>Photos: {Array.isArray(product.images) ? product.images.length : (product.image ? 1 : 0)}</p>
                        <p className='text-sm font-semibold text-red-600'>₦ {Number(product.price).toFixed(2)}</p>
                      </div>

                      <div className='flex flex-col sm:flex-row gap-2'>
                        <button
                          onClick={() => handleEditStart(product)}
                          className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-200'
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleRemove(product.id, product.title)}
                          className='bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-200'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default admin;
