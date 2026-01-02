import React from 'react'
import { ShopContext } from './shopContex'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdAdd, IoMdRemove } from 'react-icons/io'

const CartDetails = ({item}) => {
    const {removeFromCart, decreaseItemQuantity, increaseQuantity} = React.useContext(ShopContext);
    const {id, title, price, image, quantity} = item;
  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200'>
      {/* Product Info Section */}
      <div className='flex items-start space-x-4 flex-1 mb-4 md:mb-0'>
        <img 
          src={image} 
          alt={title} 
          className='w-20 h-20 md:w-24 md:h-24 object-contain rounded-lg border border-gray-200 bg-gray-50'
        />
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-800 text-sm md:text-base line-clamp-2 mb-1'>{title}</h3>
          <p className='text-red-600 font-bold text-lg'>₦ {price.toFixed(2)}</p>
          <button 
            onClick={() => removeFromCart(id)}
            className='flex items-center text-red-500 hover:text-red-700 mt-2 text-sm font-medium transition-colors duration-200'
          >
            <FiTrash2 className='mr-1' size={16} />
            Remove
          </button>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center justify-center md:justify-start space-x-3 mb-4 md:mb-0 md:mx-6'>
        <button 
          onClick={() => decreaseItemQuantity(id)}
          className='w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center transition-colors duration-200 active:scale-95'
          aria-label="Decrease quantity"
        >
          <IoMdRemove size={18} className='text-gray-700' />
        </button>
        <span className='font-semibold text-gray-800 /min-w-[2rem] text-center text-lg'>{quantity}</span>
        <button 
          onClick={() => increaseQuantity(id)}
          className='w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex justify-center items-center transition-colors duration-200 active:scale-95'
          aria-label="Increase quantity"
        >
          <IoMdAdd size={18} className='text-white' />
        </button>
      </div>

      {/* Total Price */}
      <div className='text-right /md:min-w-[100px]'>
        <p className='text-sm text-gray-500 mb-1'>Total</p>
        <p className='text-xl font-bold text-gray-800'> ₦ {(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}

export default CartDetails