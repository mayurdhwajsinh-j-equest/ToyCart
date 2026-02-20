# Frontend Data Architecture Guide

## Overview
This architecture allows you to easily swap static data with backend API calls with minimal code changes.

## Structure

```
src/
├── services/
│   └── api.js              # All API calls in ONE place
├── data/
│   ├── productsData.js
│   ├── productDetailsData.js
│   ├── featuredItemsData.js
│   ├── furtherDetailsData.js
│   └── toyBoxData.js       # Static data files
├── hooks/
│   └── useData.js          # Custom hooks for components
└── ...
```

## How It Works

### 1. **API Service** (`src/services/api.js`)
- Centralized location for ALL data fetching
- Currently uses static data from `src/data/` files
- **THIS IS THE ONLY FILE YOU'LL UPDATE WHEN BACKEND IS READY**

### 2. **Data Files** (`src/data/`)
- Store static/default data
- Organized by feature (products, details, etc.)
- Easy to find and manage

### 3. **Custom Hooks** (`src/hooks/useData.js`)
- React hooks for loading data in components
- Handle loading/error states automatically
- Provides clean component integration

## Usage Examples

### Getting Products in a Component
```jsx
import { useProducts } from '../hooks/useData';

function AllProducts() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Getting Single Product by ID
```jsx
import { useProductById } from '../hooks/useData';

function ProductPage({ productId }) {
  const { product, loading, error } = useProductById(productId);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return <ProductDetails product={product} />;
}
```

### Getting Product Details (for PDP)
```jsx
import { useProductDetails } from '../hooks/useData';

function PDP({ productId }) {
  const { details, loading, error } = useProductDetails(productId);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      <h1>{details.title}</h1>
      <p>Price: ${details.price}</p>
      {/* ... */}
    </div>
  );
}
```

## When Your Backend is Ready

### Step 1: Update API Service
Simply replace the static data imports with API calls:

```jsx
// In src/services/api.js
static async getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return await response.json();
}

static async getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return await response.json();
}

// Do the same for other methods...
```

### Step 2: That's It! ✅
- All components automatically get data from your backend
- No changes needed in components or pages
- No changes needed in hooks

## API Endpoints Expected

Your backend should provide these endpoints:

```
GET /api/products                    # Get all products
GET /api/products/:id                # Get single product
GET /api/products/:id/details        # Get product details
GET /api/featured-items?productId=X  # Get featured items
GET /api/further-details?productId=X # Get further details
GET /api/toybox-items                # Get toy box items
```

## Environment Variables

Add to your `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Benefits

✅ **Single Source of Change** - Only update `api.js` when backend is ready
✅ **Clean Components** - Components don't know about data sources
✅ **Easy Testing** - Mock API service for unit tests
✅ **Loading/Error States** - Automatically handled by hooks
✅ **Type Safe** - Can easily add TypeScript later

## Next Steps

1. Replace the TODO comments in `api.js` with actual API calls
2. Ensure your backend returns data in the same structure as the static files
3. Test with loading and error states
