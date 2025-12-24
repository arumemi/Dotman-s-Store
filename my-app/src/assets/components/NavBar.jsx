import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div>
    <nav className='flex justify-between p-[1.4rem] bg-neutral-400'>
      <Link to="/">
       <h1 className='font-bold text-2xl text-black'>MINHA LOJA</h1>
      </Link>
      <div>
        <ul className='flex justify-between gap-8'>
          <li className='font-bold text-lg text-black cursor-pointer'>HOME</li>
          <li className='font-bold text-lg text-black cursor-pointer'>PRODUTO</li>
          <li className='font-bold text-lg text-black cursor-pointer'>CONTACTO</li>
         <Link to="/cart"><li className='font-bold text-lg text-black cursor-pointer'>CARRINHO(0)</li></Link>

        </ul>
      </div>
     
    </nav>
    </div>
  )
}

export default NavBar