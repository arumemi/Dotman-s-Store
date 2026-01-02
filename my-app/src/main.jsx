/**
 * Main Entry Point for the E-commerce Application
 * 
 * This file initializes the React application and sets up:
 * - React Router for client-side navigation
 * - ShopContext for global state management (cart, products)
 * - Root component rendering
 */

// React DOM rendering utilities
import { createRoot } from 'react-dom/client'

// Global styles (includes Tailwind CSS)
import './index.css'

// Main application component
import App from './App.jsx'

// React Router for handling navigation between pages
import { BrowserRouter } from 'react-router-dom'

// Global state provider for cart and products
import { ShopContextProvider } from './assets/components/shopContex.jsx'

// Render the application into the DOM
// Wrapping order:
// 1. BrowserRouter - enables routing
// 2. ShopContextProvider - provides cart and product state to all components
// 3. App - main application component
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
)
