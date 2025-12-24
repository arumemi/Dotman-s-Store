import { useState } from 'react'
import Navbar from './assets/components/NavBar'
import { Routes, Route } from 'react-router-dom'
import Homepage from './assets/homepage/homepage'
import Cart from './assets/cart/cart'
import ProductDetails from './assets/homepage/productDetails'
import Footer from './assets/components/footer'
//import servicespage from './pages/servicespage'

function App() {
 return (
    <>
      <div>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/product/:id' element={<ProductDetails/>}/>
          
        </Routes>
        <Footer/>
      </div>
      
    </>
  )
}

export default App
