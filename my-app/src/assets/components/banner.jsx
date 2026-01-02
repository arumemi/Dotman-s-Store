/**
 * Banner Component
 * 
 * Featured product showcase banner.
 * Displays a specific product (Kids GPS Smartwatch) with:
 * - Heading text
 * - Description
 * - Product image
 * 
 * Fully responsive layout that adapts to different screen sizes.
 */

import React from 'react'
import bannerImg from '../product.img/kids.jpeg'

const banner = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-[60vh] md:min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12 text-center'>
      {/* Main heading - responsive text sizing */}
      <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800'>Discover High Standards</h2>
      
      {/* Product description - max width for readability */}
      <p className='max-w-xs sm:max-w-md md:max-w-lg text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-2'>Kids Smart Watch with GPS Tracking, Keep your children safe and connected with this smart watch</p>
      
      {/* Product image - responsive sizing */}
      <div className='relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
        <img src={bannerImg} alt='Banner' className='w-full h-auto object-contain rounded-lg'/>
      </div>
    </div>
  )
}

    



export default banner