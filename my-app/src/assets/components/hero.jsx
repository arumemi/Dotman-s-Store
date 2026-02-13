/**
 * Hero Component
 * 
 * Responsive hero carousel for the homepage.
 * Features:
 * - Auto-slide background carousel
 * - Random initial image from local assets
 * - Manual next/previous controls
 * - Mobile-first responsive text and controls
 */

import React from 'react'
import img1 from '../product.img/Samsung-s7.webp'
import img2 from '../product.img/virtual3d.jpeg'
import img3 from '../product.img/iphone-xs-64gb-back.jpeg'
import img4 from '../product.img/iphone-xs-64gb-front.jpeg'
import img5 from '../product.img/dot.img/iphone12-pro-max-back.jpeg'
import img6 from '../product.img/dot.img/iphone12-pro-max-front.jpeg'
import img7 from '../product.img/dot.img/samsung-galaxy-a26-back.jpeg'
import img8 from '../product.img/dot.img/samsung-galaxy-a26-front.jpeg'
import img9 from '../product.img/dot.img/samsung-galaxy-s23ultra-back.jpeg'
import img10 from '../product.img/dot.img/samsung-galaxy-s23ultra-front-back-cream.jpeg'
import img11 from '../product.img/dot.img/samsung-galaxy-s23ultra-front.jpeg'

const heroImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];
const CAROUSEL_INTERVAL_MS = 4500;

const Hero = () => {
  const [currentIndex, setCurrentIndex] = React.useState(() => Math.floor(Math.random() * heroImages.length));

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    const timerId = setInterval(goToNext, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timerId);
  }, [goToNext]);

  return (
    <section className='relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen w-full overflow-hidden'>
      {/* Slides */}
      <div className='absolute inset-0'>
        {heroImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
              currentIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden={currentIndex !== index}
          />
        ))}
      </div>

      {/* Dark overlay for better text readability - 40% black opacity */}
      <div className='absolute inset-0 bg-black/50 z-10'></div>
      
      {/* Content */}
      <div className='relative z-20 flex flex-col items-center justify-center text-white min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen px-4 sm:px-6 lg:px-8 py-12 text-center'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 drop-shadow-2xl leading-tight'>
          Experience the Ultimate
        </h1>
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-2xl leading-tight'>
          Best Quality
        </h1>
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl drop-shadow-lg px-4'>
          Discover innovation that transforms your daily life.
        </p>
        <button className='bg-white hover:bg-blue-700 active:bg-blue-800 text-black hover:text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-wider text-sm sm:text-base'>
          Shop Collection
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className='absolute z-30 left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-colors duration-300'
        aria-label='Previous slide'
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        className='absolute z-30 right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-colors duration-300'
        aria-label='Next slide'
      >
        ›
      </button>

      {/* Dots */}
      <div className='absolute z-30 bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3'>
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-6 sm:w-8 bg-white' : 'w-2.5 sm:w-3 bg-white/60 hover:bg-white/90'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero