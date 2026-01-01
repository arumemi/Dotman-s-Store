import React from 'react'
import Hero from '../components/Hero'
import ProductList from '../components/productList'
import Banner from '../components/banner.jsx'
import Cart from '../cart/cart.jsx'



const homepage = () => {
  return (
    <div>
      
      <Hero/>
      <ProductList/>
      <Banner/>
      <Cart/>
      

      
    </div>
  )
}

export default homepage
