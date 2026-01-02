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
  const [offerAmount, setOfferAmount] = React.useState('');
  const [offerSubmitted, setOfferSubmitted] = React.useState(false);
  const [offerError, setOfferError] = React.useState('');

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

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const offer = parseFloat(offerAmount);
    
    // Validate offer
    if (!offerAmount || isNaN(offer)) {
      setOfferError('Please enter a valid amount');
      return;
    }
    
    if (offer <= 0) {
      setOfferError('Offer must be greater than 0');
      return;
    }
    
    if (offer >= product.price) {
      setOfferError(`Your offer must be less than the asking price of ₦${product.price.toFixed(2)}`);
      return;
    }
    
    // In a real app, this would send the offer to a backend
    // For now, we'll just show a success message
    setOfferError('');
    setOfferSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setOfferSubmitted(false);
      setOfferAmount('');
    }, 5000);
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
                {product.negotiable && (
                  <span className='block bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                    Negotiable
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
                  ₦ {product.price.toFixed(2)}
                </p>
                {product.onSale && (
                  <p className='text-sm text-green-600 font-medium mt-1'>
                    Promotional price!
                  </p>
                )}
                {product.negotiable && (
                  <p className='text-sm text-blue-600 font-medium mt-1 flex items-center'>
                    <svg className='h-4 w-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z' clipRule='evenodd' />
                    </svg>
                    Price is negotiable - Make an offer below!
                  </p>
                )}
              </div>

              {/* Negotiable Offer Section */}
              {product.negotiable && !product.outOfStock && (
                <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-3'>Make an Offer</h3>
                  {!offerSubmitted ? (
                    <form onSubmit={handleOfferSubmit}>
                      <div className='flex flex-col sm:flex-row gap-3'>
                        <div className='flex-1'>
                          <label htmlFor='offerAmount' className='sr-only'>Your offer amount</label>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold'>
                              ₦
                            </span>
                            <input
                              id='offerAmount'
                              type='number'
                              step='0.01'
                              min='0'
                              value={offerAmount}
                              onChange={(e) => {
                                setOfferAmount(e.target.value);
                                setOfferError('');
                              }}
                              placeholder='Enter your offer'
                              className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                          </div>
                        </div>
                        <button
                          type='submit'
                          className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95'
                        >
                          Submit Offer
                        </button>
                      </div>
                      {offerError && (
                        <p className='text-red-600 text-sm mt-2'>{offerError}</p>
                      )}
                      <p className='text-xs text-gray-600 mt-2'>
                        Tip: Your offer should be less than the asking price. The seller will review and respond.
                      </p>
                    </form>
                  ) : (
                    <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg'>
                      <p className='font-semibold'>Offer Submitted Successfully! 🎉</p>
                      <p className='text-sm mt-1'>Your offer of ₦{parseFloat(offerAmount).toFixed(2)} has been sent to the seller. They will contact you soon!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className='border-t border-gray-200 my-6'></div>

              {/* Description */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {product.description}
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
