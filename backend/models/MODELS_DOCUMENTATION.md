# ToyCart Database Models Documentation

This document provides a comprehensive overview of all Sequelize models used in the ToyCart e-commerce application.

---

## Database Models Overview

### 1. **User Model**
Manages user accounts for both customers and administrators.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `name` (STRING) - User's full name
- `email` (STRING, Unique) - User's email address with validation
- `password` (STRING) - Hashed password
- `role` (ENUM: 'customer', 'admin') - User role
- `address` (STRING) - Street address
- `phone` (STRING) - Phone number (numeric validation)
- `city` (STRING) - City name
- `state` (STRING) - State/Province
- `zipcode` (STRING) - Postal code
- `createdAt` (DATE) - Record creation timestamp
- `updatedAt` (DATE) - Last update timestamp

**Relationships:**
- One User → Many Carts
- One User → Many Orders
- One User → Many Reviews
- One User → Many WishList items

**Use Cases:**
- Customer registration and login
- Admin authentication
- User profile management

---

### 2. **Category Model**
Organizes products into different toy categories.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `name` (STRING, Unique) - Category name
- `description` (TEXT) - Category description
- `image_url` (STRING) - Category image/icon URL
- `createdAt` (DATE) - Record creation timestamp
- `updatedAt` (DATE) - Last update timestamp

**Relationships:**
- One Category → Many Products

**Use Cases:**
- Product categorization (e.g., Action Figures, Dolls, Board Games, etc.)
- Category-based filtering on the homepage
- Admin category management

---

### 3. **Product Model**
Stores detailed information about toy products available for purchase.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `name` (STRING) - Product name
- `description` (TEXT) - Detailed product description
- `short_description` (STRING, max 500 chars) - Brief description for listings
- `price` (DECIMAL 10,2) - Product price
- `categoryId` (INTEGER, Foreign Key) - Reference to Category
- `image_url` (STRING) - Primary product image URL
- `additional_images` (JSON) - Array of additional image URLs
- `stock` (INTEGER) - Number of units available
- `rating` (DECIMAL 3,2) - Average product rating (0-5)
- `number_of_reviews` (INTEGER) - Total review count
- `is_featured` (BOOLEAN) - Featured product flag
- `availability` (ENUM: 'in_stock', 'out_of_stock', 'discontinued') - Stock status
- `createdAt` (DATE) - Record creation timestamp
- `updatedAt` (DATE) - Last update timestamp

**Relationships:**
- One Product ← One Category
- One Product → Many Cart items
- One Product → Many OrderItems
- One Product → Many Reviews
- One Product → Many WishList items

**Use Cases:**
- Product display on home and listing pages
- Product detail page information
- Admin product management
- Stock tracking and availability

---

### 4. **Cart Model**
Manages shopping cart items for customers.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `userId` (INTEGER, Foreign Key) - Reference to User
- `productId` (INTEGER, Foreign Key) - Reference to Product
- `quantity` (INTEGER) - Number of items (minimum: 1)
- `price` (DECIMAL 10,2) - Unit price at time of adding to cart
- `createdAt` (DATE) - Item added timestamp
- `updatedAt` (DATE) - Last cart update timestamp

**Relationships:**
- One Cart ← One User
- One Cart ← One Product

**Use Cases:**
- Add to cart functionality
- Update cart quantity
- Remove from cart
- Display cart summary
- Calculate cart subtotal

---

### 5. **Order Model**
Represents completed or pending customer orders.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `order_number` (STRING, Unique) - Human-readable order number
- `userId` (INTEGER, Foreign Key) - Reference to User/Customer
- `total_amount` (DECIMAL 10,2) - Order total
- `status` (ENUM) - Order status:
  - 'pending' - Awaiting confirmation
  - 'confirmed' - Order confirmed
  - 'processing' - Being prepared for shipment
  - 'shipped' - In transit
  - 'delivered' - Received by customer
  - 'cancelled' - Order cancelled
- `delivery_address` (STRING) - Shipping street address
- `city` (STRING) - Shipping city
- `state` (STRING) - Shipping state/province
- `zipcode` (STRING) - Shipping postal code
- `phone` (STRING) - Contact phone number
- `payment_method` (ENUM) - Payment type:
  - 'credit_card'
  - 'debit_card'
  - 'upi'
  - 'net_banking'
  - 'cash_on_delivery'
- `payment_status` (ENUM: 'pending', 'completed', 'failed') - Payment status
- `shipping_date` (DATE) - When order was shipped
- `delivery_date` (DATE) - When order was delivered
- `tracking_number` (STRING) - Courier tracking number
- `special_notes` (TEXT) - Special delivery instructions
- `createdAt` (DATE) - Order creation timestamp
- `updatedAt` (DATE) - Last update timestamp

**Relationships:**
- One Order ← One User
- One Order → Many OrderItems

**Use Cases:**
- Order placement and confirmation
- Order tracking
- Order history display
- Admin order management
- Payment processing

---

### 6. **OrderItem Model**
Represents individual products within an order.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `orderId` (INTEGER, Foreign Key) - Reference to Order
- `productId` (INTEGER, Foreign Key) - Reference to Product
- `quantity` (INTEGER) - Quantity ordered (minimum: 1)
- `price` (DECIMAL 10,2) - Unit price at time of order
- `total_price` (DECIMAL 10,2) - Line item total (quantity × price)
- `createdAt` (DATE) - Item added timestamp
- `updatedAt` (DATE) - Last update timestamp

**Relationships:**
- One OrderItem ← One Order
- One OrderItem ← One Product

**Use Cases:**
- Storing order line items
- Order detail display
- Price history (captures price at purchase time)
- Invoice generation

---

### 7. **Review Model**
Stores product reviews and ratings from customers.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `userId` (INTEGER, Foreign Key) - Reference to User
- `productId` (INTEGER, Foreign Key) - Reference to Product
- `rating` (INTEGER) - Star rating (1-5)
- `title` (STRING) - Review title/headline
- `review_text` (TEXT) - Full review content
- `is_verified_purchase` (BOOLEAN) - Whether reviewer purchased the product
- `helpful_count` (INTEGER) - Number of users who found review helpful
- `createdAt` (DATE) - Review creation timestamp
- `updatedAt` (DATE) - Last update timestamp

**Relationships:**
- One Review ← One User
- One Review ← One Product

**Use Cases:**
- Product rating and review system
- Customer feedback collection
- Verified purchase badges
- Helpful review voting
- Product rating calculation (aggregated in Product model)

---

### 8. **WishList Model**
Manages customers' saved/favorite products.

**Fields:**
- `id` (INTEGER, Primary Key) - Unique identifier
- `userId` (INTEGER, Foreign Key) - Reference to User
- `productId` (INTEGER, Foreign Key) - Reference to Product
- `createdAt` (DATE) - Item saved timestamp
- `updatedAt` (DATE) - Last update timestamp

**Constraints:**
- Unique constraint on (userId, productId) - Prevents duplicate wishlist entries

**Relationships:**
- One WishList ← One User
- One WishList ← One Product

**Use Cases:**
- Save products for later
- Wishlist display
- Compare wishlist items
- Wishlist notifications (for admin features)

---

## Relationships Diagram

```
User
├── hasMany Cart
├── hasMany Order
├── hasMany Review
└── hasMany WishList

Category
└── hasMany Product

Product
├── belongsTo Category
├── hasMany Cart
├── hasMany OrderItem
├── hasMany Review
└── hasMany WishList

Cart
├── belongsTo User
└── belongsTo Product

Order
├── belongsTo User
└── hasMany OrderItem

OrderItem
├── belongsTo Order
└── belongsTo Product

Review
├── belongsTo User
└── belongsTo Product

WishList
├── belongsTo User
└── belongsTo Product
```

---

## Cascade and Constraint Rules

### Delete Operations
- **User deletion**: CASCADE to Cart, Order, Review, WishList
- **Category deletion**: CASCADE to Product
- **Product deletion**: RESTRICT on OrderItem (prevents deletion of products with order history), CASCADE on Cart, Review, WishList
- **Order deletion**: CASCADE to OrderItem

### Referential Integrity
All foreign key relationships maintain referential integrity with `onUpdate: CASCADE` to handle ID changes.

---

## Database Initialization

The models are automatically synced when the application starts via:
```javascript
await sequelize.sync({ alter: false });
```

Use `alter: true` during development only if you want automatic schema updates.

---

## Usage in Routes/Controllers

```javascript
const { User, Product, Order, Cart, Review } = require('../models');

// Example: Get user with all orders
const user = await User.findByPk(userId, {
  include: ['Orders']
});

// Example: Get product with reviews
const product = await Product.findByPk(productId, {
  include: ['Reviews', 'Category']
});

// Example: Get order with items
const order = await Order.findByPk(orderId, {
  include: ['OrderItems', 'User']
});
```

---

## Notes for Development

1. **Price Tracking**: Cart stores current price, OrderItem stores historical price
2. **Stock Management**: Update Product.stock when orders are placed
3. **Rating Aggregation**: Manually calculate Product.rating from Review ratings
4. **Timestamps**: All models include auto-managed createdAt and updatedAt
5. **Validation**: Email, phone, and rating fields have built-in validation
6. **Unique Constraints**: WishList prevents duplicate entries for the same user-product pair
