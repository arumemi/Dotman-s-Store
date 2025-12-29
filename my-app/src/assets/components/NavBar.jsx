import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className='bg-red-400 sticky top-0 z-50 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to="/" className='/flex-shrink-0'>
            <h1 className='font-bold text-xl sm:text-2xl text-white hover:text-gray-100 transition-colors duration-200'>MINHA LOJA</h1>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex'>
            <ul className='flex items-center gap-6 lg:gap-8'>
              <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>HOME</li>
              <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>PRODUTO</li>
              <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>CONTACTO</li>
              <Link to="/cart">
                <li className='font-bold text-sm lg:text-lg text-white hover:text-gray-100 cursor-pointer transition-colors duration-200'>CARRINHO(0)</li>
              </Link>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className='md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-100 hover:bg-red-500 transition-colors duration-200'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              {isMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-red-500'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link to='/' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-red-600 transition-colors duration-200'>
              HOME
            </Link>
            <div className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-red-600 transition-colors duration-200 cursor-pointer'>
              PRODUTO
            </div>
            <div className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-red-600 transition-colors duration-200 cursor-pointer'>
              CONTACTO
            </div>
            <Link to='/cart' className='block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-red-600 transition-colors duration-200'>
              CARRINHO(0)
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar