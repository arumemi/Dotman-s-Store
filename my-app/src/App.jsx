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

import { useState } from 'react'

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

function App() {
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
        </Routes>
        
        {/* Footer - company info, links, social media */}
        <Footer/>
        
        {/* Floating WhatsApp button - fixed bottom-right on all pages */}
        <FloatingWhatsApp/>
      </div>
    </>
  )
}

export default App
