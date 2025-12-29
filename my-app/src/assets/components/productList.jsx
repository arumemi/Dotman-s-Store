import React from 'react'
import { ShopContext } from './shopContex'
import { Link } from 'react-router-dom'

const productList = () => {
  const { products } = React.useContext(ShopContext);
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12' >
      <h2 className='text-3xl md:text-4xl font-bold mb-12 text-gray-800 text-center'>Nossa coleção elegante</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12'>
       {
        products.map((product) => {
          const {id, name, price, image} = product;
          return (
            <div key={id} className='bg-white border border-gray-400 rounded-xl p-5 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full'>
              <Link to={`/product/${id}`}>
                <img src={image} alt={name} className='w-full h-\[250px] object-contain mb-4 rounded-lg' />
              </Link>
              <div className='space-y-2 \flex-grow'>
                <h4 className='text-lg font-semibold text-gray-800 line-clamp-2 min-h-\[56px]'>{name}</h4>
                <p className='text-red-600 font-bold text-xl'>R$ {price.toFixed(2)}</p>
              </div>
              <button className='mt-auto w-full bg-red-500 hover:bg-red-700 active:bg-red-800 text-black font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300'>
                Adicionar ao Carrinho
              </button>
            </div>
          )
        })
       }
      </div>
    </div>
  )
}

export default productList