import React from 'react'
import { ShopContext } from './shopContex'
import { Link } from 'react-router-dom'

/**
 * ProductList Component
 * Displays all products in a responsive grid layout
 * Each product card shows image, title, price, and add to cart button
 */
const productList = () => {
  // Get products array and addToCart function from global context
  const { products, addToCart } = React.useContext(ShopContext);
  
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12' >
      {/* Section heading */}
      <h2 className='text-3xl md:text-4xl font-bold mb-12 text-gray-800 text-center'>Our Stylish Collection</h2>
      
      {/* Responsive grid: 1 col on mobile, 2 on sm, 3 on md, 4 on lg+ */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12'>
       {
        // Map through products array and render a card for each product
        products.map((product) => {
          // Destructure product properties for easier access
          const {id, title, price, image, isNew, onSale, outOfStock} = product;
          return (
            // Product card with hover effects
            <div key={id} className='bg-white border border-gray-400 rounded-xl p-5 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative'>
              {/* Out of stock badge - positioned over image */}
              {outOfStock && (
                <div className='absolute top-32 left-1/2 transform -translate-x-1/2 z-20'>
                  <span className='bg-gray-800 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-2xl'>SOLD</span>
                </div>
              )}
              
              {/* Badge for New or Sale products */}
              {onSale && !outOfStock && (
                <div className='absolute top-2 right-2 z-10'>
                  <span className='bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>SALE</span>
                </div>
              )}
              {isNew && !outOfStock && (
                <div className='absolute top-2 right-2 z-10'>
                  <span className='bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>NEW</span>
                </div>
              )}
              
              {/* Product image - clickable link to product details page */}
              <Link to={`/product/${id}`}>
                <img src={image} alt={title} className={`w-full h-\[250px] object-contain mb-4 rounded-lg ${outOfStock ? 'opacity-50' : ''}`} />
              </Link>
              
              {/* Product information section */}
              <div className='space-y-2 \flex-grow'>
                {/* Product title - limited to 2 lines with ellipsis */}
                <h4 className='text-lg font-semibold text-gray-800 line-clamp-2 min-h-\[56px]'>{title}</h4>
                {/* Product price formatted to 2 decimal places */}
                <p className='text-red-600 font-bold text-xl'>₦ {price.toFixed(2)}</p>
              </div>
              
              {/* Add to cart button - disabled when out of stock */}
              <button 
                onClick={() => addToCart(product)} 
                disabled={outOfStock}
                className={`mt-auto w-full font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ₦{
                  outOfStock 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                    : 'bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-black hover:shadow-lg transform hover:scale-105 active:scale-95'
                }`}
              >
                {outOfStock ? 'Unavailable' : 'Add to cart'}
              </button>
            </div>
          )
        })
       }
      </div>
    </div>
  )
}

export default productList