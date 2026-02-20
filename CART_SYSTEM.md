# Shopping Cart System Documentation

## Overview
A global cart system has been implemented using React Context that allows users to:
- Add items to cart from any page
- View cart count in the header
- Update quantities
- Remove items
- View total price

## Architecture

### 1. **CartContext** (`src/context/CartContext.jsx`)
Manages global cart state with the following methods:
- `addToCart(product)` - Add item or increase quantity
- `removeFromCart(productId)` - Remove item completely
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear all items
- `getCartCount()` - Get total number of items
- `getTotalPrice()` - Get total price of all items

### 2. **useCart Hook** (`src/hooks/useCart.js`)
Custom React hook to access cart anywhere in the app:
```jsx
const { cartItems, addToCart, removeFromCart, updateQuantity, getCartCount, getTotalPrice } = useCart();
```

## How It Works

### Adding Items to Cart

**From Product Cards:**
```jsx
import { useCart } from "../../hooks/useCart";

function MyComponent() {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id: 1,
      ProductImage: "image-url",
      ProductName: "Product Name",
      Price: "99"
    });
  };
}
```

**From Product Description (PDP):**
The ProductDescription component automatically handles adding to cart when the user clicks the "Add to cart" button.

### Displaying Cart Count in Header

The Navbar automatically displays:
- Cart icon
- Red badge with the count of items
- Badge animates when item is added

### Managing Cart Items

The ToyBox component (accessible from `/Order` route) shows:
- List of all items in cart
- Quantity controls
- Remove button for each item
- Total price calculation

## Components Updated

### 1. **App.jsx**
- Wrapped with `<CartProvider>` to provide cart context to all routes

### 2. **Navbar.jsx**
- Shows cart count in header
- Cart icon is clickable and navigates to Checkout
- Badge displays count and animates on add

### 3. **Productcard.jsx**
- "Add to toybox" button now adds to cart
- No longer navigates away

### 4. **ProductDescription.jsx** (PDP)
- "Add to cart" button adds product to cart
- Passes product ID and details to cart

### 5. **ToyBox.jsx**
- Now uses cart context instead of local state
- Shows all items currently in cart
- Allows quantity updates and removals
- Shows message if cart is empty

## Usage Flow

1. **User browses products** → Clicks "Add to toybox"
2. **Item added to cart** → Count appears in header badge
3. **User can continue shopping** → Or click cart icon
4. **Cart icon takes user to Checkout** → Shows ToyBox component
5. **In ToyBox/Order page** → User can adjust quantities or remove items
6. **Click "Check Out Now"** → Proceeds to checkout form

## Styling

### Cart Badge Styling (`Navbar.css`)
- Red background (#FF6B6B)
- White text
- Positioned at top-right of cart icon
- Pulse animation on add

### Responsive
- Works on all screen sizes
- Badge scales appropriately
- Touch-friendly buttons

## Data Structure

When adding a product to cart, ensure it has:
```javascript
{
  id: number,              // Unique product ID
  ProductImage: string,    // Image URL
  ProductName: string,     // Product name
  Price: string|number,    // Product price
  quantity: number         // Auto-set to 1 on add
}
```

## Future Enhancements

- Local storage persistence (cart survives page refresh)
- Wishlist functionality
- Coupon/discount code support
- Tax calculation
- Shipping options
- Order history backend integration

## Troubleshooting

### Cart count not updating?
- Make sure component is wrapped with CartProvider (check App.jsx)
- Verify useCart() hook is imported correctly from `../../hooks/useCart`

### Items not persisting?
- Currently cart data is lost on page refresh
- Will add localStorage support in future

### Cart badge not showing?
- Check Navbar.css for cart-badge styling
- Verify getCartCount() is being called correctly
