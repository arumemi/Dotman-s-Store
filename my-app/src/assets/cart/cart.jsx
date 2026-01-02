import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { ShopContext } from '../components/shopContex'
import CartDetails from '../components/CartDetails.jsx';
import { Link } from 'react-router-dom';

const cart = () => {
  const {cartItems, totalItems, clearCart, orderDetails} = React.useContext(ShopContext);
  
  const handleCheckout = () => {
    const phoneNumber = '2348169429947'; // WhatsApp number
    
    // Build order details message
    let message = '*New Order from Website*\n\n';
    message += '*Order Details:*\n';
    message += '━━━━━━━━━━━━━━━━━\n\n';
    
    // Add each cart item
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₦${item.price.toFixed(2)}\n`;
      message += `   Subtotal: ₦${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += '━━━━━━━━━━━━━━━━━\n';
    message += `*Total Items:* ${totalItems}\n`;
    message += `*Total Amount:* ₦${orderDetails.toFixed(2)}\n`;
    message += `*Shipping:* Free\n\n`;
    message += '━━━━━━━━━━━━━━━━━\n';
    message += 'Please confirm this order and provide delivery details.';
    
    // Encode message and open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Shopping Cart</h1>
          <p className='text-gray-600'>{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
        </div>

        {/* Two Column Layout */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Column - Cart Items */}
          <div className='flex-1 lg:w-2/3'>
            {/* Cart Header */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-400 p-4 mb-4 flex justify-between items-center'>
              <h2 className='text-lg font-semibold text-gray-800'>Products</h2>
              {cartItems.length > 0 && (
                <button 
                  onClick={clearCart}
                  className='flex items-center text-red-500 hover:text-red-700 font-medium transition-colors duration-200'
                >
                  <RiDeleteBin6Line className='mr-2' size={18} />
                  Clear Cart
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartDetails key={item.id} item={item} />
                ))
              ) : (
                <div className='bg-white rounded-lg shadow-sm border border-gray-400 p-12 text-center'>
                  <div className='text-gray-500 mb-4'>
                    <svg className='mx-auto h-24 w-24' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>Your cart is empty</h3>
                  <p className='text-gray-600 mb-6'>Add products to the cart to continue shopping</p>
                  <Link 
                    to='/'
                    className='inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200'
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className='lg:w-1/3'>
            <div className='bg-white rounded-lg shadow-md border border-gray-400 p-6 lg:sticky lg:top-24'>
              <h2 className='text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-400'>Order Summary</h2>
              
              {/* Order Details */}
              <div className='space-y-4 mb-6'>
                <div className='flex justify-between text-gray-700'>
                  <span>Items ({totalItems}):</span>
                  <span className='font-semibold'>₦ {isNaN(orderDetails) ? "0.00" : orderDetails.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-700'>
                  <span>Shipping:</span>
                  <span className='text-sm text-green-600 font-medium'>Free</span>
                </div>
                <div className='flex justify-between text-gray-700'>
                  <span>Taxes:</span>
                  <span className='text-sm'>Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className='border-t border-gray-400 pt-4 mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-bold text-gray-800'>Total:</span>
                  <span className='text-2xl font-bold text-red-600'>₦ {isNaN(orderDetails) ? "0.00" : orderDetails.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  cartItems.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2'
                }`}
              >
                {cartItems.length > 0 && (
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                  </svg>
                )}
                Order via WhatsApp
              </button>

              {/* Continue Shopping Link */}
              <Link 
                to='/'
                className='block text-center text-blue-500 hover:text-blue-700 font-medium mt-4 transition-colors duration-200'
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className='mt-6 pt-6 border-t border-gray-400'>
                <div className='flex items-center justify-center text-gray-800 text-sm'>
                  <svg className='h-5 w-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  100% Secure Purchase
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default cart
