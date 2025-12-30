import React from 'react'

const cart = () => {
  const { cartItems, orderDetails, removeFromCart, decreaseItemQuantity, addToCart } = React.useContext(ShopContext);
  return (
    //left div for cart details
    <div>
      <div>
        <div></div>
      </div>

      {/* right div for order cart summary */}
      <div>
        <div></div>
      </div>
    </div>
  )
}

export default cart
