import React from 'react'
/**
 * App Component - Main Application Container
 * 
 * This is the root component that defines the overall application structure:
 * - Navigation bar (appears on all pages)
 * - Route definitions for different pages
 * - Footer (appears on all pages)
 * - Floating WhatsApp button (appears on all pages)
 * 
 * Routes:
 * - / : Homepage (Hero section, product list, banner)
 * - /cart : Shopping cart page
 * - /product/:id : Individual product details page
 * - /contact : Contact form page
 */

// Layout Components
import Navbar from './assets/components/NavBar'
import Footer from './assets/components/footer'
import FloatingWhatsApp from './assets/components/FloatingWhatsApp'

// Routing
import { Routes, Route } from 'react-router-dom'

// Page Components
import Homepage from './assets/homepage/homepage'
import Cart from './assets/cart/cart'
import ProductDetails from './assets/homepage/productDetails'
import Contact from './assets/components/contact'
import Admin from './assets/admin/admin'
import { ShopContext } from './assets/components/shopContex'

function App() {
 const { toast, dismissToast } = React.useContext(ShopContext)

 return (
    <>
      <div>
        {/* Navigation bar - sticky at top, visible on all pages */}
        <Navbar/>
        
        {/* Route definitions - determines which page component to render based on URL */}
        <Routes>
          {/* Homepage: Hero banner + Product grid + Info banner */}
          <Route path='/' element={<Homepage/>}/>
          
          {/* Shopping cart: View items, update quantities, checkout via WhatsApp */}
          <Route path='/cart' element={<Cart/>}/>
          
          {/* Product details: Detailed view of individual product with add to cart */}
          <Route path='/product/:id' element={<ProductDetails/>}/>
          
          {/* Contact form: Send messages to business email */}
          <Route path='/contact' element={<Contact/>}/>

          {/* Admin panel: Manage product catalog */}
          <Route path='/admin' element={<Admin/>}/>
        </Routes>
        
        {/* Footer - company info, links, social media */}
        <Footer/>
        
        {/* Floating WhatsApp button - fixed bottom-right on all pages */}
        <FloatingWhatsApp/>

        {/* Global toast */}
        {toast && (
          <div className='fixed top-20 right-4 left-4 sm:left-auto sm:max-w-sm z-70'>
            <div className='bg-gray-900 text-white border border-gray-700 rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3 transition-all duration-200'>
              <span className='mt-1 h-2.5 w-2.5 rounded-full bg-green-400 shrink-0' />
              <p className='text-sm leading-5 flex-1'>{toast.message}</p>
              <button
                type='button'
                onClick={dismissToast}
                className='text-gray-300 hover:text-white text-sm font-semibold transition-colors duration-200'
                aria-label='Close notification'
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
