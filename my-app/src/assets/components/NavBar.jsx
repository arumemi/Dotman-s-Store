import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from './shopContex'

/**
 * NavBar Component
 * Responsive navigation bar with mobile menu toggle
 * Displays cart item count dynamically from ShopContext
 */
const NavBar = () => {
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Get total cart items count from global context
  const { totalItems } = useContext(ShopContext);

  return (
    <nav className='bg-blue-400 sticky top-0 z-50 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to="/" className='/flex-shrink-0'>
            <h1 className='font-bold text-xl sm:text-2xl text-black hover:text-gray-100 transition-colors duration-200'>Rolfad Resources International</h1>
          </Link>

          {/* Desktop Menu - Hidden on mobile, visible on medium+ screens */}
          <div className='hidden md:flex'>
            <ul className='flex items-center gap-6 lg:gap-8'>
              <Link to='/'>
                <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>HOME</li>
              </Link>
              
              <Link to='/contact'>
                <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>CONTACT</li>
              </Link>
              {/* Cart link with dynamic item count */}
              <Link to="/cart">
                <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>CART({totalItems})</li>
              </Link>
            </ul>
          </div>

          {/* Mobile Menu Button - Toggles hamburger/close icon */}
          <button 
            className='md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-100 hover:bg-blue-500 transition-colors duration-200'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              {/* Show X icon when menu is open, hamburger icon when closed */}
              {isMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Conditionally rendered when isMenuOpen is true */}
      {isMenuOpen && (
        <div className='md:hidden bg-blue-500'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link to='/' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
              HOME
            </Link>
            <div className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer'>
              PRODUCT
            </div>
            <Link to='/contact' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
              CONTACT
            </Link>
            {/* Mobile cart link with dynamic item count */}
            <Link to='/cart' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
              CART({totalItems})
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar