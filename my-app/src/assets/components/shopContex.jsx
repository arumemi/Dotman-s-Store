import { createContext, useState, useEffect } from "react";
import { productsData } from '../../data.jsx';

const ADMIN_PASSWORD = '1914';
const ADMIN_SESSION_KEY = 'isAdminAuthenticated';
const PRODUCT_FALLBACK_IMAGE = 'https://via.placeholder.com/500x500?text=Product+Image';
const FIREBASE_DATABASE_URL = (import.meta.env.VITE_FIREBASE_DATABASE_URL || '').trim();
const PRODUCTS_SYNC_MODE = (import.meta.env.VITE_PRODUCTS_SYNC_MODE || 'firebase').trim().toLowerCase();
const PRODUCTS_API_BASE_URL = (import.meta.env.VITE_PRODUCTS_API_BASE_URL || '').trim();

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

const normalizeProductCollection = (rawValue) => {
    if (Array.isArray(rawValue)) {
        return rawValue.map(normalizeProductRecord);
    }

    if (rawValue && typeof rawValue === 'object') {
        return Object.values(rawValue).map(normalizeProductRecord);
    }

    return [];
};

const getFirebaseProductsSyncUrl = () => {
    if (!FIREBASE_DATABASE_URL) return '';
    return `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/products.json`;
};

const getMongoProductsSyncUrl = () => {
    if (!PRODUCTS_API_BASE_URL) return '/api/products';
    return `${PRODUCTS_API_BASE_URL.replace(/\/$/, '')}/api/products`;
};

const getProductsSyncTarget = () => {
    if (PRODUCTS_SYNC_MODE === 'mongodb') {
        return {
            url: getMongoProductsSyncUrl(),
            source: 'mongodb',
        };
    }

    if (PRODUCTS_SYNC_MODE === 'firebase') {
        return {
            url: getFirebaseProductsSyncUrl(),
            source: 'firebase',
        };
    }

    return {
        url: '',
        source: 'local',
    };
};

const getSyncingLabel = (source) => {
    if (source === 'mongodb') return 'Syncing (MongoDB)...';
    if (source === 'firebase') return 'Syncing (Firebase)...';
    return 'Offline fallback';
};

const getSyncedLabel = (source) => {
    if (source === 'mongodb') return 'Synced (MongoDB)';
    if (source === 'firebase') return 'Synced (Firebase)';
    return 'Offline fallback';
};

export const ShopContext = createContext();

export const ShopContextProvider = ({children}) => {
    const syncTarget = getProductsSyncTarget();
    const [isRemoteProductsHydrated, setIsRemoteProductsHydrated] = useState(false);
    const [syncStatus, setSyncStatus] = useState(() => ({
        state: syncTarget.url ? 'syncing' : 'offline',
        label: syncTarget.url ? getSyncingLabel(syncTarget.source) : 'Offline fallback',
    }));
    const [toast, setToast] = useState(null);

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

    const showToast = (message) => {
        setToast({ id: Date.now(), message });
    };

    const dismissToast = () => {
        setToast(null);
    };

    useEffect(() => {
        if (!toast) return undefined;

        const timeoutId = setTimeout(() => {
            setToast(null);
        }, 2600);

        return () => clearTimeout(timeoutId);
    }, [toast]);
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Cart updated:', cartItems);
    }, [cartItems]);

    // Save products to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    // Hydrate products from shared database if configured
    useEffect(() => {
        const target = getProductsSyncTarget();
        const productsUrl = target.url;

        if (!productsUrl) {
            setSyncStatus({ state: 'offline', label: target.source === 'local' ? 'Local only' : 'Offline fallback' });
            setIsRemoteProductsHydrated(true);
            return;
        }

        const controller = new AbortController();

        const hydrateProducts = async () => {
            try {
                const response = await fetch(productsUrl, {
                    method: 'GET',
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Could not load shared products');
                }

                const payload = await response.json();
                const sharedProducts = normalizeProductCollection(payload);

                setProducts(sharedProducts);

                setSyncStatus({ state: 'synced', label: getSyncedLabel(target.source) });
            } catch (error) {
                if (error?.name !== 'AbortError') {
                    console.warn('Shared product sync unavailable. Using local catalog fallback.');
                    setSyncStatus({ state: 'offline', label: 'Offline fallback' });
                }
            } finally {
                setIsRemoteProductsHydrated(true);
            }
        };

        hydrateProducts();

        return () => controller.abort();
    }, []);

    // Sync products to shared database after hydration
    useEffect(() => {
        const target = getProductsSyncTarget();
        const productsUrl = target.url;

        if (!productsUrl || !isRemoteProductsHydrated) return;

        const controller = new AbortController();

        const syncProducts = async () => {
            try {
                setSyncStatus({ state: 'syncing', label: getSyncingLabel(target.source) });
                const response = await fetch(productsUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(products),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Remote products sync failed');
                }

                setSyncStatus({ state: 'synced', label: getSyncedLabel(target.source) });
            } catch (error) {
                if (error?.name !== 'AbortError') {
                    console.warn('Unable to sync products to shared database.');
                    setSyncStatus({ state: 'offline', label: 'Offline fallback' });
                }
            }
        };

        syncProducts();

        return () => controller.abort();
    }, [products, isRemoteProductsHydrated]);
    
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
    const addToCart = (product, quantityToAdd = 1) => {
        const safeQuantity = Number.isFinite(quantityToAdd) && quantityToAdd > 0
            ? Math.floor(quantityToAdd)
            : 1;

        const existingItem = cartItems.find((item) => item.id === product.id);
        
        if (!existingItem) {
            setCartItems([...cartItems, {...product, quantity: safeQuantity}]);
            showToast(`Added ${safeQuantity} × ${product.title} to cart.`);
        } else {
            const updatedCart = cartItems.map((item) => {
                if (item.id === product.id) {
                    return {...item, quantity: item.quantity + safeQuantity};
                }
                return item;
            });
            setCartItems(updatedCart);
            showToast(`Updated ${product.title} quantity in cart.`);
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
            logoutAdmin,
            syncStatus,
            toast,
            dismissToast

        }}>
            {children}
        </ShopContext.Provider>
    );
};

