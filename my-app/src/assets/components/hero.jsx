import React from 'react'
import bgImage from '../product.img/Samsung-s7.webp'

const Hero = () => {
  return (
    <div className='relative min-h-screen w-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: `url(${bgImage})`}}>
      {/* Dark overlay for better text readability */}
      <div className='absolute inset-0 bg-black/40 z-10'></div>
      
      {/* Content */}
      <div className='relative z-20 flex flex-col items-center justify-center text-black min-h-screen px-4 sm:px-6 lg:px-8 py-12 text-center'>
        <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 sm:mb-3 drop-shadow-2xl leading-tight'>
          Experimente o máximo
        </h1>
        <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 drop-shadow-2xl leading-tight'>
          Melhor qualidade
        </h1>
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl drop-shadow-lg px-4'>
          Descubra a inovação que transforma seu dia a dia.
        </p>
        <button className='bg-white hover:bg-red-700 active:bg-red-800 text-black font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-wider text-sm sm:text-base'>
          Coleção da Loja
        </button>
      </div>
    </div>
  )
}

export default Hero