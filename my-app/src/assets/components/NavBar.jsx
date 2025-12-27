import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div>
    <nav className='flex justify-between p-[1.4rem] bg-red-400'>
      <Link to="/">
       <h1 className='font-bold text-2xl text-white'>MINHA LOJA</h1>
      </Link>
      <div>
        <ul className='flex justify-between gap-8'>
          <li className='font-bold text-lg text-white cursor-pointer'>HOME</li>
          <li className='font-bold text-lg text-white cursor-pointer'>PRODUTO</li>
          <li className='font-bold text-lg text-white cursor-pointer'>CONTACTO</li>
         <Link to="/cart"><li className='font-bold text-lg text-white cursor-pointer'>CARRINHO(0)</li></Link>

        </ul>
      </div>
     
    </nav>
    </div>
  )
}

export default NavBar