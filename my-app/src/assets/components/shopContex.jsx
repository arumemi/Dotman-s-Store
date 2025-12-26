
import { createContext, useState } from "react";
       
export const ShopContext = createContext();

import {productsData } from '../../data.jsx';

export const ShopContextProvider = ({children}) => {
    const[products, setProducts] = useState(productsData);
    
    const shopContextValue = {
        products: productsData,
    };

    return (
        <ShopContext.Provider value={shopContextValue}>
            {children}
        </ShopContext.Provider>
    );
};