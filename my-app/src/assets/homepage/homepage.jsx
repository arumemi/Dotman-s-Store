/**
 * Homepage Component
 * 
 * Main landing page that displays three sections:
 * 1. Hero - Full-screen banner with call-to-action
 * 2. ProductList - Grid of all available products
 * 3. Banner - Featured product showcase (Kids smartwatch)
 * 
 * Layout: Stacked vertically in full width
 */

import React from 'react'
import Hero from '../components/Hero'
import ProductList from '../components/productList'
import Banner from '../components/banner.jsx'

const homepage = () => {
  return (
    <div className='w-full overflow-x-hidden'>
      {/* Hero section: Full-screen image with text overlay and CTA button */}
      <Hero/>
      
      {/* Product grid: Displays all products with add to cart functionality */}
      <ProductList/>
      
      {/* Info banner: Featured product with description */}
      <Banner/>
    </div>
  )
}

export default homepage
