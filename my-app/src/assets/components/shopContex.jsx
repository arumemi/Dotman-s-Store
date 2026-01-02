import { createContext, useState, useEffect } from "react";
import { productsData } from '../../data.jsx';

export const ShopContext = createContext();

export const ShopContextProvider = ({children}) => {
    const [products, setProducts] = useState(productsData);
    // Load cart from localStorage on initial render
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [orderDetails, setOrderDetails] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Cart updated:', cartItems);
    }, [cartItems]);
    
    //calculate total price
    useEffect(() => {
        const total = cartItems.reduce((accumulator, currentItem) => {
            const priceAsNumber = typeof currentItem.price === 'number' 
                ? currentItem.price 
                : parseFloat(String(currentItem.price).replace('R$ ', '').replace(',', '.'));
            
            if (!isNaN(priceAsNumber)) {
                return accumulator + (priceAsNumber * currentItem.quantity);
            }
            return accumulator;
        }, 0);
        setOrderDetails(total);
    }, [cartItems]);

    //calculate quantity of items in cart
    useEffect(() => {
        const amount = cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0);
        setTotalItems(amount);
    }, [cartItems]);
    

    //function to add item to cart
    const addToCart = (product) => {
        const existingItem = cartItems.find((item) => item.id === product.id);
        
        if (!existingItem) {
            setCartItems([...cartItems, {...product, quantity: 1}]);
        } else {
            const updatedCart = cartItems.map((item) => {
                if (item.id === product.id) {
                    return {...item, quantity: item.quantity + 1};
                }
                return item;
            });
            setCartItems(updatedCart);
        }
    };

    //function to remove item from cart
    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
    };
    
    //function to decrease item quantity in cart
    const decreaseItemQuantity = (id) => {
        const existingItem = cartItems.find((item) => item.id === id);
        if(existingItem && existingItem.quantity === 1){
            removeFromCart(id);
        } else {
            const updatedCart = cartItems.map((item) => {
                if (item.id === id) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            });
            setCartItems(updatedCart);
        }
    };
    //function to increase item quantity in cart
    const increaseQuantity = (id) => {
        const item = cartItems.find((item) => item.id === id)
        if(item) {
            addToCart(item)
        }
    }

    //function to clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <ShopContext.Provider value={{
            products, 
            cartItems, 
            addToCart, 
            totalItems, 
            orderDetails,
            removeFromCart, 
            decreaseItemQuantity, 
            clearCart,
            increaseQuantity

        }}>
            {children}
        </ShopContext.Provider>
    );
};

