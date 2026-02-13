import React from 'react';
import { ShopContext } from '../components/shopContex';

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
  description: '',
  isNew: false,
  onSale: false,
  outOfStock: false,
  negotiable: false,
};

const admin = () => {
  const { products, addProduct, updateProduct, removeProduct, isAdminAuthenticated, loginAdmin, logoutAdmin } = React.useContext(ShopContext);
  const [formData, setFormData] = React.useState(initialFormState);
  const [editingProductId, setEditingProductId] = React.useState(null);
  const [error, setError] = React.useState('');
  const [formSuccess, setFormSuccess] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [isCompressingImage, setIsCompressingImage] = React.useState(false);
  const [compressionInfo, setCompressionInfo] = React.useState('');
  const [uploadSuccess, setUploadSuccess] = React.useState('');
  const imageInputRef = React.useRef(null);

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
      setCompressionInfo('Compressing image...');
      setUploadSuccess('');
      setFormSuccess('');
      const originalSizeKB = file.size / 1024;
      const { dataUrl, sizeKB } = await compressImageForStorage(file);

      setFormData((prev) => ({
        ...prev,
        image: dataUrl,
      }));
      setError('');
      setCompressionInfo(`Compressed from ${originalSizeKB.toFixed(0)}KB to ${sizeKB.toFixed(0)}KB`);
      setUploadSuccess('✅ Image uploaded successfully.');
    } catch {
      setError('Could not read the selected image. Please try again.');
      setCompressionInfo('');
      setUploadSuccess('');
    } finally {
      setIsCompressingImage(false);
    }
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
      price: parsedPrice,
    };

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
  };

  const handleEditStart = (product) => {
    setEditingProductId(product.id);
    setError('');
    setFormSuccess('');
    setCompressionInfo('');
    setUploadSuccess('');
    setFormData({
      title: product.title || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      image: product.image || '',
      description: product.description || '',
      isNew: Boolean(product.isNew),
      onSale: Boolean(product.onSale),
      outOfStock: Boolean(product.outOfStock),
      negotiable: Boolean(product.negotiable),
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
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
                {compressionInfo && (
                  <p className='text-xs text-green-700 mt-1'>{compressionInfo}</p>
                )}
                {uploadSuccess && (
                  <p className='text-sm text-green-700 bg-green-50 border border-green-300 mt-2 px-3 py-2 rounded-lg'>
                    {uploadSuccess}
                  </p>
                )}
              </div>

              {formData.image && (
                <div>
                  <p className='text-sm font-medium text-gray-700 mb-2'>Image Preview</p>
                  <img
                    src={formData.image}
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
                        src={product.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                        alt={product.title}
                        className='w-16 h-16 object-cover rounded-md border border-gray-200'
                      />

                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-gray-800 truncate'>{product.title}</p>
                        <p className='text-sm text-gray-600'>Category: {product.category || 'N/A'}</p>
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
