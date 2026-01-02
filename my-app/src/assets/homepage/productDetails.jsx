import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { productsData } from '../../data'
import { ShopContext } from '../components/shopContex.jsx'
import { IoMdAdd, IoMdRemove } from 'react-icons/io'
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi'

const productDetails = () => {
  const {addToCart} = React.useContext(ShopContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = React.useState(1);

  const product = productsData.find((item) => item.id === parseInt(id));

  // If product not found, show error
  if (!product) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Product not found</h2>
          <Link to='/' className='text-blue-500 hover:text-blue-700 font-medium'>
            Back to store
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className='flex items-center text-blue-500 hover:text-blue-700 font-medium mb-6 transition-colors duration-200'
        >
          <FiArrowLeft className='mr-2' size={20} />
          Back
        </button>

        {/* Product Details Container */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12'>
            {/* Left Column - Image */}
            <div className='relative'>
              {/* Badges */}
              <div className='absolute top-4 right-4 z-10 space-y-2'>
                {product.onSale && !product.outOfStock && (
                  <span className='block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                    SALE
                  </span>
                )}
                {product.isNew && !product.outOfStock && (
                  <span className='block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                    NEW
                  </span>
                )}
                {product.outOfStock && (
                  <span className='block bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* Product Image */}
              <div className='bg-gray-100 rounded-lg p-8 flex items-center justify-center'>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className={`w-full max-w-md h-auto object-contain ${product.outOfStock ? 'opacity-50' : ''}`}
                />
              </div>

              {/* Category Badge */}
              <div className='mt-4'>
                <span className='inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full'>
                  {product.category}
                </span>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className='flex flex-col'>
              {/* Product Title */}
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-4'>
                {product.title}
              </h1>

              {/* Price */}
              <div className='mb-6'>
                <p className='text-4xl font-bold text-red-600'>
                  R$ {product.price.toFixed(2)}
                </p>
                {product.onSale && (
                  <p className='text-sm text-green-600 font-medium mt-1'>
                    Promotional price!
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className='border-t border-gray-200 my-6'></div>

              {/* Description */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {product.title}
                </p>
              </div>

              {/* Product Info */}
              <div className='mb-6 space-y-2'>
                <div className='flex justify-between py-2 border-b border-gray-200'>
                  <span className='text-gray-600'>Category:</span>
                  <span className='font-semibold text-gray-800'>{product.category}</span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-200'>
                  <span className='text-gray-600'>Product ID:</span>
                  <span className='font-semibold text-gray-800'>#{product.id}</span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-200'>
                  <span className='text-gray-600'>Availability:</span>
                  <span className={`font-semibold ${product.outOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {product.outOfStock ? 'Out of stock' : 'In stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {!product.outOfStock && (
                <div className='mb-6'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Quantity:
                  </label>
                  <div className='flex items-center space-x-4'>
                    <button 
                      onClick={decreaseQuantity}
                      className='w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center transition-colors duration-200 active:scale-95'
                    >
                      <IoMdRemove size={20} className='text-gray-700' />
                    </button>
                    <span className='text-2xl font-bold text-gray-800 /min-w-[3rem] text-center'>
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQuantity}
                      className='w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex justify-center items-center transition-colors duration-200 active:scale-95'
                    >
                      <IoMdAdd size={20} className='text-white' />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='space-y-3 mt-auto'>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.outOfStock}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 flex items-center justify-center ${
                    product.outOfStock
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 hover:shadow-lg transform hover:scale-105 active:scale-95'
                  }`}
                >
                  <FiShoppingCart className='mr-2' size={24} />
                  {product.outOfStock ? 'Unavailable' : 'Add to Cart'}
                </button>

                <Link 
                  to='/cart'
                  className='block w-full py-4 px-6 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg transition-all duration-200 text-center'
                >
                  View Cart
                </Link>
              </div>

              {/* Trust Badges */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                  <div className='flex items-center'>
                    <svg className='h-5 w-5 mr-2 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                    </svg>
                    Free Shipping
                  </div>
                  <div className='flex items-center'>
                    <svg className='h-5 w-5 mr-2 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                    </svg>
                    Secure Purchase
                  </div>
                  <div className='flex items-center'>
                    <svg className='h-5 w-5 mr-2 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    Quality Guarantee
                  </div>
                  <div className='flex items-center'>
                    <svg className='h-5 w-5 mr-2 text-purple-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                    </svg>
                    Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Related Products</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            {productsData
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/product/${relatedProduct.id}`}
                  className='bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200'
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.title} 
                    className='w-full h-32 object-contain mb-2'
                  />
                  <h3 className='text-sm font-semibold text-gray-800 line-clamp-2 mb-1'>
                    {relatedProduct.title}
                  </h3>
                  <p className='text-red-600 font-bold'> ₦ {relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default productDetails
