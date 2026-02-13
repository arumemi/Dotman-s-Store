import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from './shopContex'

/**
 * NavBar Component
 * Responsive navigation bar with mobile menu toggle
 * Displays cart item count dynamically from ShopContext
 */
const NavBar = () => {
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  
  // Get total cart items count from global context
  const { totalItems, isAdminAuthenticated, logoutAdmin } = useContext(ShopContext);

  const handleLogout = () => {
    logoutAdmin();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className='bg-blue-400 sticky top-0 z-50 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 gap-3'>
          {/* Logo */}
          <Link to="/" className='shrink min-w-0'>
            <h1 className='font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-black hover:text-gray-100 transition-colors duration-200 truncate'>
              <span className='inline sm:hidden'>Rolfad</span>
              <span className='hidden sm:inline lg:hidden'>Rolfad Resources</span>
              <span className='hidden lg:inline'>Rolfad Resources International</span>
            </h1>
          </Link>

          {/* Desktop Menu - visible on laptop+ */}
          <div className='hidden lg:flex'>
            <ul className='flex items-center gap-5 xl:gap-8'>
              <Link to='/'>
                <li className='font-bold text-sm xl:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>home</li>
              </Link>
              
              <Link to='/contact'>
                <li className='font-bold text-sm xl:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>contact</li>
              </Link>
              {!isAdminAuthenticated ? (
                <Link to='/admin'>
                  <li className='font-bold text-sm xl:text-lg text-red-600 hover:text-gray-100 cursor-pointer transition-colors duration-200'>login</li>
                </Link>
              ) : (
                <li>
                  <button
                    onClick={handleLogout}
                    className='font-bold text-sm xl:text-lg text-red-600 hover:text-gray-100 cursor-pointer transition-colors duration-200'
                  >
                    logout
                  </button>
                </li>
              )}
              {/* Cart link with dynamic item count */}
              <Link to="/cart">
                <li className='font-bold text-sm xl:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>cart({totalItems})</li>
              </Link>
            </ul>
          </div>

          {/* Mobile Menu Button - Toggles hamburger/close icon */}
          <button 
            className='lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-100 hover:bg-blue-500 transition-colors duration-200 shrink-0'
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
        <div className='lg:hidden bg-blue-500'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link to='/' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
              home
            </Link>
            <Link to='/contact' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
              contact
            </Link>
            {!isAdminAuthenticated ? (
              <Link to='/admin' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
                login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className='block w-full text-left px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200'
              >
                logout
              </button>
            )}
            {/* Mobile cart link with dynamic item count */}
            <Link to='/cart' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsMenuOpen(false)}>
              cart({totalItems})
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar