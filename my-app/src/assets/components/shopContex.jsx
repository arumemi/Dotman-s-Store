import { createContext, useState, useEffect } from "react";
import { productsData } from '../../data.jsx';

const ADMIN_PASSWORD = '1914';
const ADMIN_SESSION_KEY = 'isAdminAuthenticated';
const PRODUCT_FALLBACK_IMAGE = 'https://via.placeholder.com/500x500?text=Product+Image';

const normalizeProductImages = (productLike) => {
    const fromArray = Array.isArray(productLike?.images)
        ? productLike.images.map((image) => String(image || '').trim()).filter(Boolean)
        : [];

    const singleImage = String(productLike?.image || '').trim();

    if (fromArray.length > 0) {
        return singleImage && !fromArray.includes(singleImage)
            ? [singleImage, ...fromArray]
            : fromArray;
    }

    if (singleImage) return [singleImage];
    return [PRODUCT_FALLBACK_IMAGE];
};

const normalizeProductRecord = (productLike) => {
    const images = normalizeProductImages(productLike);
    return {
        ...productLike,
        image: images[0],
        images,
    };
};

export const ShopContext = createContext();

export const ShopContextProvider = ({children}) => {
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('products');
        const sourceProducts = savedProducts ? JSON.parse(savedProducts) : productsData;
        return sourceProducts.map(normalizeProductRecord);
    });
    // Load cart from localStorage on initial render
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [orderDetails, setOrderDetails] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Cart updated:', cartItems);
    }, [cartItems]);

    // Save products to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);
    
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

    // Admin authentication helpers
    const loginAdmin = (password) => {
        if (password !== ADMIN_PASSWORD) return false;

        setIsAdminAuthenticated(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        return true;
    };

    const logoutAdmin = () => {
        setIsAdminAuthenticated(false);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    };

    // Add product from admin panel
    const addProduct = (newProduct) => {
        setProducts((prevProducts) => {
            const maxId = prevProducts.length > 0 ? Math.max(...prevProducts.map((item) => item.id)) : 0;
            const normalizedImages = normalizeProductImages(newProduct);

            const productToInsert = {
                id: maxId + 1,
                title: newProduct.title,
                price: Number(newProduct.price),
                category: newProduct.category,
                description: newProduct.description || 'Product added by admin.',
                image: normalizedImages[0],
                images: normalizedImages,
                isNew: Boolean(newProduct.isNew),
                onSale: Boolean(newProduct.onSale),
                outOfStock: Boolean(newProduct.outOfStock),
                negotiable: Boolean(newProduct.negotiable),
            };

            return [productToInsert, ...prevProducts];
        });
    };

    // Update existing product from admin panel
    const updateProduct = (updatedProduct) => {
        const normalizedImages = normalizeProductImages(updatedProduct);
        const normalizedProduct = {
            id: updatedProduct.id,
            title: updatedProduct.title,
            price: Number(updatedProduct.price),
            category: updatedProduct.category,
            description: updatedProduct.description || 'Product updated by admin.',
            image: normalizedImages[0],
            images: normalizedImages,
            isNew: Boolean(updatedProduct.isNew),
            onSale: Boolean(updatedProduct.onSale),
            outOfStock: Boolean(updatedProduct.outOfStock),
            negotiable: Boolean(updatedProduct.negotiable),
        };

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === normalizedProduct.id ? { ...product, ...normalizedProduct } : product
            )
        );

        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item.id === normalizedProduct.id
                    ? {
                        ...item,
                        title: normalizedProduct.title,
                        price: normalizedProduct.price,
                        category: normalizedProduct.category,
                        image: normalizedProduct.image,
                        images: normalizedProduct.images,
                        outOfStock: normalizedProduct.outOfStock,
                        onSale: normalizedProduct.onSale,
                        isNew: normalizedProduct.isNew,
                        negotiable: normalizedProduct.negotiable,
                    }
                    : item
            )
        );
    };

    // Remove product from catalog and cart
    const removeProduct = (id) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== id));
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
            increaseQuantity,
            addProduct,
            updateProduct,
            removeProduct,
            isAdminAuthenticated,
            loginAdmin,
            logoutAdmin

        }}>
            {children}
        </ShopContext.Provider>
    );
};

