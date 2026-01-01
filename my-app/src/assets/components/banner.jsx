import React from 'react'
import bannerImg from '../product.img/kids.jpeg'


const banner = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-white px-4 text-center'>
      <h2 className='text-3xl  font-bold mb-4'>Descubra alto padrão</h2>
      <p className='max-w-md text-gray-600 mb-6'>Relógio Inteligente para Crianças com Rastreamento GPS, Mantenha seus filhos seguros e conectados com este relógio inteligent </p>
  <div className='relative '>
    <img src={bannerImg} alt='Banner' className='w-96 object-contain'/>
  </div>

  
  </div>
    
  )
}

    



export default banner