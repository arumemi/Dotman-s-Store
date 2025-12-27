# Copilot Instructions for Product Card E-commerce

## Project Overview
This is a React e-commerce application built with Vite, React Router, and Tailwind CSS v4. The app displays products with a shopping cart (currently under development). Content is in Portuguese (pt-BR).

## Architecture & Key Patterns

### Component Organization
- **Pages**: `src/assets/homepage/` and `src/assets/cart/`
- **Reusable Components**: `src/assets/components/`
- **Inconsistent naming**: Components use lowercase filenames but PascalCase exports (e.g., `productList.jsx` exports `productList` but should export `ProductList`)

### State Management
- Uses React Context API via `ShopContext` in [src/assets/components/shopContex.jsx](../src/assets/components/shopContex.jsx)
- Context provides `products` array globally
- **Pattern**: Always wrap component imports with `ShopContextProvider` in [main.jsx](../src/main.jsx)
- Access products: `const { products } = React.useContext(ShopContext);`

### Routing Structure
```javascript
/ -> Homepage (Hero + ProductList)
/cart -> Cart page (empty, needs implementation)
/product/:id -> Product details (empty, needs implementation)
```

### Data Model
Product data lives in [src/data.jsx](../src/data.jsx) with structure:
```javascript
{ id, image, title, price, category }
```
**Note**: ProductList expects `name` property but data uses `title` - this is a bug

## Styling Conventions
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (not v3 PostCSS setup)
- Import in CSS: `@import "tailwindcss";` (see [index.css](../src/index.css))
- **Color scheme**: Red accent (#ef4444), white backgrounds, gray text
- **Interactive states**: Always include hover, active, and transform transitions
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- **Pattern**: Cards use `hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`

## Development Commands
```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Production build
npm run preview  # Preview production build
```

## Critical Bugs to Be Aware Of
1. **ProductList mapping bug**: Destructures `name` but data has `title` property
2. **Cart not implemented**: [cart.jsx](../src/assets/cart/cart.jsx) is empty stub
3. **ProductDetails not implemented**: [productDetails.jsx](../src/assets/homepage/productDetails.jsx) is empty stub
4. **No cart state management**: ShopContext doesn't track cart items yet
5. **Static cart count**: NavBar shows hardcoded "(0)" instead of dynamic count

## When Adding Features
- **Cart functionality**: Extend ShopContext with cart state (items, addToCart, removeFromCart, updateQuantity)
- **Product details**: Fetch product by ID from context using `useParams()` hook
- **New components**: Follow existing pattern with lowercase filename, place in appropriate subdirectory
- **Images**: Store in `src/assets/product.img/` and import at top of data.jsx
- **Routes**: Add to [App.jsx](../src/App.jsx) Routes component

## Testing & Debugging
- No test framework configured yet
- Use React DevTools to inspect ShopContext state
- Vite provides fast HMR - check browser console for errors immediately

## External Dependencies
- `react-router-dom`: v7.11.0 for routing
- `react`: v19.2.0 (latest)
- Tailwind CSS v4 via Vite plugin (not PostCSS)
