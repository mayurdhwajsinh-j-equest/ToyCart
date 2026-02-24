# ToyCart Database Schema Diagram & Reference

## ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TOYCART DATABASE SCHEMA                            │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │     USER     │
                                    ├──────────────┤
                                    │ id (PK)      │
                                    │ name         │
                                    │ email(UQ)    │
                                    │ password     │
                                    │ role         │
                                    │ address      │
                                    │ phone        │
                                    │ city         │
                                    │ state        │
                                    │ zipcode      │
                                    └──┬───────┬───┘
                                       │       │
                        ┌──────────────┼───┐  ┌┼──────────────┬──────────────┐
                        │              │   │  │               │              │
                    (1:M)          (1:M)  (1:M)            (1:M)          (1:M)
                        │              │   │  │               │              │
                        ▼              ▼   ▼  ▼               ▼              ▼
                   ┌─────────┐   ┌─────────┐ ┌─────────────┐ ┌────────┐  ┌──────────┐
                   │  CART   │   │  ORDER  │ │   REVIEW    │ │WISHLIST│  │  (more)  │
                   ├─────────┤   ├─────────┤ ├─────────────┤ ├────────┤  │          │
                   │ id (PK) │   │ id (PK) │ │ id (PK)     │ │id (PK)│  │          │
                   │ userId  │  │ order#  │ │ userId (FK) │ │userId │  │          │
                   │productId│ │ total   │ │ productId   │ │product│  │          │
                   │quantity │   │ status  │ │ rating      │ │id (FK)│  │          │
                   │ price   │   │delivery │ │ title       │ └────────┘  │          │
                   └────┬────┘   │ address │ │ review_text │            │          │
                        │        │ phone   │ │ verified    │            │          │
                        │        │payment  │ │ helpful_cnt │            │          │
                        │        └────┬────┘ └──────┬──────┘            │          │
                        │             │             │                   │          │
                    (M:1)         (1:M)          (M:1)               (M:1)    ...
                        │             │             │                   │
                        │             ▼             │                   │
                        │       ┌──────────────┐    │                   │
                        │       │  ORDER_ITEM  │    │                   │
                        │       ├──────────────┤    │                   │
                        │       │ id (PK)      │    │                   │
                        │       │ orderId (FK) │────┤                   │
                        │       │ productId    │    │                   │
                        │       │ quantity     │    │                   │
                        │       │ price        │    │                   │
                        │       │ total_price  │    │                   │
                        │       └──┬───────────┘    │                   │
                        │          │                │                   │
                        │      (M:1)                │                   │
                        │          ▼                ▼                   ▼
                        │    ┌──────────────────────────────────────────────────┐
                        └─→  │              PRODUCT                             │
                             ├──────────────────────────────────────────────────┤
                             │ id (PK)                                          │
                             │ name                                             │
                             │ description                                      │
                             │ short_description                                │
                             │ price                                            │
                             │ categoryId (FK) ────┐                           │
                             │ image_url           │                           │
                             │ additional_images   │                           │
                             │ stock               │                           │
                             │ rating              │                           │
                             │ number_of_reviews   │                           │
                             │ is_featured         │                           │
                             │ availability        ▼                           │
                             └──────────────────────────────────────────────────┘
                                                    │
                                                (M:1)
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │   CATEGORY   │
                                            ├──────────────┤
                                            │ id (PK)      │
                                            │ name (UQ)    │
                                            │ description  │
                                            │ image_url    │
                                            └──────────────┘
```

---

## Table Structure Details

### USER Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    address VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    zipcode VARCHAR(10),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

Indexes: email (UNIQUE)
```

### CATEGORY Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

Indexes: name (UNIQUE)
```

### PRODUCT Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    categoryId INTEGER NOT NULL,
    image_url VARCHAR(255),
    additional_images JSON,
    stock INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    number_of_reviews INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    availability ENUM('in_stock', 'out_of_stock', 'discontinued') DEFAULT 'in_stock',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);

Indexes: categoryId
```

### CART_ITEMS Table
```sql
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    price DECIMAL(10,2),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

Indexes: userId, productId
```

### ORDER Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    userId INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
    delivery_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    payment_method ENUM('credit_card','debit_card','upi','net_banking','cash_on_delivery'),
    payment_status ENUM('pending','completed','failed') DEFAULT 'pending',
    shipping_date DATETIME,
    delivery_date DATETIME,
    tracking_number VARCHAR(100),
    special_notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

Indexes: userId, order_number (UNIQUE), status
```

### ORDER_ITEMS Table
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT
);

Indexes: orderId, productId
```

### REVIEWS Table
```sql
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

Indexes: userId, productId
```

### WISHLIST Table
```sql
CREATE TABLE wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, productId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

Indexes: userId, productId, (userId, productId) UNIQUE
```

---

## Data Flow Diagrams

### User Registration & Purchase Flow
```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. REGISTRATION                                                      │
│    User → Create Account → USER Table (hash password)                │
│                                                                      │
│ 2. BROWSE PRODUCTS                                                   │
│    Query PRODUCT → filtered by CATEGORY → display on frontend       │
│                                                                      │
│ 3. ADD TO CART                                                       │
│    Product Selected → INSERT into CART_ITEMS → store quantity       │
│                                                                      │
│ 4. CHECKOUT                                                          │
│    Verify Cart Items → Validate Stock → Calculate Total             │
│                                                                      │
│ 5. PLACE ORDER                                                       │
│    Create ORDER → Create ORDER_ITEMS → Update PRODUCT Stock         │
│    Clear CART → Return Confirmation                                 │
│                                                                      │
│ 6. ORDER TRACKING                                                    │
│    Admin updates ORDER status → User views tracking info            │
│                                                                      │
│ 7. REVIEW AFTER DELIVERY                                             │
│    User writes REVIEW → Aggregate ratings in PRODUCT               │
└──────────────────────────────────────────────────────────────────────┘
```

### Admin Operations Flow
```
┌──────────────────────────────────────────────────────────────────────┐
│ ADMIN DASHBOARD                                                      │
│                                                                      │
│ PRODUCT MANAGEMENT:                                                  │
│  - Add Product → INSERT PRODUCT + set CATEGORY                      │
│  - Edit Product → UPDATE PRODUCT (stock, price, images)             │
│  - Delete Product → DELETE with FK constraints                      │
│  - View Stock → Monitor PRODUCT.stock for low inventory             │
│                                                                      │
│ ORDER MANAGEMENT:                                                    │
│  - View Orders → Query ORDER + JOIN ORDER_ITEMS + PRODUCT           │
│  - Update Status → Change ORDER.status + notify user (manual)       │
│  - Add Tracking → Set tracking_number, shipping_date                │
│                                                                      │
│ CUSTOMER INSIGHTS:                                                   │
│  - View Users → Query USER table (exclude passwords)                │
│  - Order History → Query ORDER where userId = X                     │
│  - Revenue Report → SUM(ORDER.total_amount) grouped by date         │
│  - Product Performance → Count reviews, avg rating                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Important Relationships Reference

### One-to-Many (1:M) Relationships
| Parent | Child | Foreign Key | Cascade |
|--------|-------|-------------|---------|
| User | Cart Items | userId | CASCADE |
| User | Orders | userId | CASCADE |
| User | Reviews | userId | CASCADE |
| User | WishList | userId | CASCADE |
| Category | Products | categoryId | CASCADE |
| Product | Cart Items | productId | CASCADE |
| Product | Order Items | productId | RESTRICT |
| Product | Reviews | productId | CASCADE |
| Product | WishList | productId | CASCADE |
| Order | Order Items | orderId | CASCADE |

### Many-to-One (M:1) Relationships (Reverse of above)
These are automatically created by Sequelize through the 1:M relationships.

---

## Query Performance Tips

### Frequently Used Queries

**1. Get Product with Category & Reviews**
```javascript
Product.findByPk(id, {
  include: ['Category', 'Reviews']
});
```
Best indexes: `id`, `productId` on reviews

**2. List Products with Filters**
```javascript
Product.findAll({
  where: { categoryId, price: { [Op.between]: [min, max] } },
  include: ['Category']
});
```
Best indexes: `categoryId`, `price`

**3. Get User Orders with Items**
```javascript
Order.findAll({
  where: { userId },
  include: [{ model: OrderItem, include: ['Product'] }]
});
```
Best indexes: `userId` on orders, `orderId` on order_items

---

## Constraints & Business Rules

### Validation Rules
| Field | Rule | Enforcement |
|-------|------|-------------|
| Email | Must be unique and valid | UNIQUE, isEmail validator |
| Password | Minimum 8 chars, hashed | Business logic |
| Rating | 1-5 stars | CHECK constraint |
| Quantity | Minimum 1 | Validator |
| Stock | Cannot be negative | Business logic |
| Price | Must be positive | Validator |
| WishList | No duplicates per user | UNIQUE(userId, productId) |

### Cascade Rules
- Delete User → Deletes all their Cart, Order, Review, WishList entries
- Delete Category → Deletes all Products in it
- Delete Product → Cannot delete if it has Order Items (RESTRICT)
- Delete Order → Deletes all Order Items

---

## Status/Enum Values

### User Roles
- `'customer'` - Regular user with shopping permissions
- `'admin'` - Administrator with full access

### Order Status
- `'pending'` - Order received, awaiting confirmation
- `'confirmed'` - Payment confirmed
- `'processing'` - Being prepared for shipment
- `'shipped'` - In transit
- `'delivered'` - Received by customer
- `'cancelled'` - Order cancelled

### Payment Status
- `'pending'` - Awaiting payment
- `'completed'` - Payment successful
- `'failed'` - Payment failed

### Product Availability
- `'in_stock'` - Available for purchase
- `'out_of_stock'` - Temporarily unavailable
- `'discontinued'` - No longer available

### Payment Methods
- `'credit_card'` - Credit card payment
- `'debit_card'` - Debit card payment
- `'upi'` - UPI payment
- `'net_banking'` - Net banking transfer
- `'cash_on_delivery'` - COD payment

---

## Database Size Estimation

For 1,000,000 products, 100,000 users, 1,000,000 orders:

| Table | Estimated Size | Growth Rate |
|-------|---|---|
| Users | ~10 MB | Slow |
| Categories | < 1 MB | Very Slow |
| Products | ~200 MB | Moderate |
| Cart Items | ~50 MB | Variable |
| Orders | ~100 MB | Daily |
| Order Items | ~150 MB | Daily |
| Reviews | ~200 MB | Daily |
| Wishlist | ~50 MB | Variable |
| **Total** | **~760 MB** | **~1-2 GB / year** |

---

## Migration to Production Database

### From SQLite to PostgreSQL
```javascript
// Change in models/index.js
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false
});
```

Install: `npm install pg pg-hstore`

---

**Database Design**: Optimized for e-commerce with strong data integrity
**Created**: February 2026
**Status**: Production-Ready
