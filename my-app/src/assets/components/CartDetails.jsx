import React from 'react'
import { ShopContext } from './shopContex'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdAdd, IoMdRemove } from 'react-icons/io'

const CartDetails = ({item}) => {
    const {removeFromCart, decreaseItemQuantity, increaseQuantity} = React.useContext(ShopContext);
    const {id, title, price, image, quantity} = item;
  return (
    <>
    <div>
          <div>
              <img src={image} alt={title} />
          </div>
          <div>
              <h3>{title}</h3>
              <p>R$ {price.toFixed(2)}</p>
              <div>
                  <FiTrash2 onClick={() => removeFromCart(id)} />
              </div>
          </div>
          </div>
          <div>
            <button>
            <IoMdRemove onClick={() => decreaseItemQuantity(id)} />
            </button>
            <span>{quantity}</span>
            <button>
            <IoMdAdd onClick={() => increaseQuantity(id)} />
            </button>
            </div>
          <div>
            <div>R$ {(price * quantity).toFixed(2)}</div>
          </div>
          <div>
            <div>
                <button onClick={() => removeFromCart(id)}>Remove</button>
            </div>
          </div>
                


     
 </>
  )
}

export default CartDetails