import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { ShopContext } from '../components/shopContex'
import CartDetails from '../components/CartDetails.jsx';

const cart = () => {
  const {cartItems, totalItems, clearCart, orderDetails} = React.useContext(ShopContext);
  return (
    // main container div for cart page
    <div>
      <div>
        <div>
          <h1>Shopping Cart</h1>
          <h1>Items: {totalItems}</h1>
          <RiDeleteBin6Line onClick={clearCart} />
        </div>
        <div>
          <span>Product Description</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Total</span>
        </div>
        <div>
          {
            cartItems.length > 0 ? (
              cartItems.map((item) => {
                return (
                  <CartDetails key={item.id} item={item} />
                )
              })
            ) : (
              <p>Your Cart is Empty</p>
            )
          }
        </div>
      </div>

      {/* right div for order cart summary */}
      <div>
        <h2>Order Summary</h2>
        <div>
          <span>Item(s):</span>
          <span>{totalItems}</span>
        </div>
      </div>
      <div>
        <span>Subtotal</span>
        <span>${isNaN(orderDetails) ? "0.00" : orderDetails.toFixed(2)}</span>
      </div>
      <div>
        <span>Taxes and Shipping:</span>
        <span>Calculated at checkout</span>
      </div>
      <div>
        <span>Total cost</span>
        <span>${isNaN(orderDetails) ? "0.00" : orderDetails.toFixed(2)} </span>
      </div>
      <div>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  )
}

export default cart
