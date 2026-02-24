# ToyCart Models Quick Reference

A quick reference guide for common operations with Sequelize models in ToyCart.

---

## Model Overview Table

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Authentication & Profile | id, email, password, role, address |
| **Category** | Product Organization | name, description, image_url |
| **Product** | Toy Products | name, price, stock, rating, image_url |
| **Cart** | Shopping Cart | userId, productId, quantity, price |
| **Order** | Customer Orders | order_number, status, total_amount, tracking |
| **OrderItem** | Order Line Items | orderId, productId, quantity, price |
| **Review** | Product Reviews | userId, productId, rating, review_text |
| **WishList** | Saved Products | userId, productId |

---

## Import Models

```javascript
const {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  Order,
  OrderItem,
  Review,
  WishList
} = require('./models');
```

---

## Common Operations

### READ Operations

#### Get by Primary Key
```javascript
// Single record
const user = await User.findByPk(1);

// With relations
const product = await Product.findByPk(1, {
  include: ['Category', 'Reviews']
});
```

#### Find One Record
```javascript
const user = await User.findOne({ where: { email: 'test@example.com' } });
```

#### Find All Records
```javascript
// All records
const users = await User.findAll();

// With conditions
const customers = await User.findAll({
  where: { role: 'customer' }
});

// With pagination
const { count, rows } = await User.findAndCountAll({
  limit: 10,
  offset: 0
});
```

#### With Relations (Include)
```javascript
const order = await Order.findByPk(1, {
  include: [
    {
      model: OrderItem,
      include: [{ model: Product }]
    },
    { model: User }
  ]
});

// With where clause on included model
const products = await Product.findAll({
  include: [{
    model: Category,
    where: { name: 'Action Figures' }
  }]
});
```

### CREATE Operations

```javascript
// Single record
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
  role: 'customer'
});

// Multiple records
const categories = await Category.bulkCreate([
  { name: 'Action Figures' },
  { name: 'Board Games' },
  { name: 'Dolls' }
]);
```

### UPDATE Operations

```javascript
// Find and update
const user = await User.findByPk(1);
await user.update({
  name: 'Jane Doe',
  phone: '1234567890'
});

// Update all matching
await Product.update(
  { stock: 0 },
  { where: { availability: 'discontinued' } }
);

// Increment/Decrement
await Product.increment('stock', {
  by: 5,
  where: { id: 1 }
});

await Product.decrement('stock', {
  by: 2,
  where: { id: 1 }
});
```

### DELETE Operations

```javascript
// Delete single record
const user = await User.findByPk(1);
await user.destroy();

// Delete all matching
await Cart.destroy({
  where: { userId: 1 }
});

// With cascade (automatically deletes related records)
// Defined in model associations
```

---

## Filtering & Querying

### Operators
```javascript
const { Op } = require('sequelize');

// Price range
where: {
  price: { [Op.between]: [10, 100] }
}

// Greater/Less than
where: {
  stock: { [Op.gt]: 5 },      // >
  price: { [Op.gte]: 20 },    // >=
  rating: { [Op.lt]: 4 },     // <
  discount: { [Op.lte]: 0.5 } // <=
}

// In array
where: {
  status: { [Op.in]: ['pending', 'confirmed'] }
}

// NOT in array
where: {
  role: { [Op.notIn]: ['admin'] }
}

// Like (text search)
where: {
  name: { [Op.like]: '%toy%' }
}

// NULL checks
where: {
  deletedAt: { [Op.is]: null }
}

// OR conditions
where: {
  [Op.or]: [
    { price: { [Op.lt]: 50 } },
    { is_featured: true }
  ]
}

// AND conditions
where: {
  [Op.and]: [
    { stock: { [Op.gt]: 0 } },
    { rating: { [Op.gte]: 4 } }
  ]
}
```

### Sorting
```javascript
// Single field
order: [['createdAt', 'DESC']]

// Multiple fields
order: [
  ['category', 'ASC'],
  ['price', 'DESC']
]

// By included model
order: [[{ model: Product }, 'price', 'ASC']]
```

### Limiting Results
```javascript
// Limit and offset
limit: 10,
offset: 0  // Page 1

offset: 10 // Page 2 (with limit 10)
offset: 20 // Page 3 (with limit 10)
```

---

## Aggregation

### Count
```javascript
// Count all
const count = await Product.count();

// Count with where
const inStockCount = await Product.count({
  where: { availability: 'in_stock' }
});
```

### Sum
```javascript
const { sequelize } = require('sequelize');

const totalSales = await Order.sum('total_amount');

// With where condition
const pendingTotal = await Order.sum('total_amount', {
  where: { status: 'pending' }
});
```

### Average
```javascript
const avgRating = await Review.avg('rating', {
  where: { productId: 1 }
});
```

### Min/Max
```javascript
const minPrice = await Product.min('price');
const maxPrice = await Product.max('price');
```

---

## Transactions

For operations that must succeed or fail together:

```javascript
const t = await sequelize.transaction();

try {
  // All operations in transaction
  const order = await Order.create(orderData, { transaction: t });
  
  // Create order items
  await Promise.all(
    cartItems.map(item =>
      OrderItem.create(itemData, { transaction: t })
    )
  );
  
  // Update product stock
  for (let item of cartItems) {
    await item.Product.decrement('stock', {
      by: item.quantity,
      transaction: t
    });
  }
  
  // Clear cart
  await Cart.destroy({
    where: { userId: userId },
    transaction: t
  });
  
  // Commit transaction
  await t.commit();
  res.json({ order });
} catch (error) {
  // Rollback on error
  await t.rollback();
  res.status(500).json({ error: error.message });
}
```

---

## Validation

Models include built-in validators:

```javascript
// Email validation
email: {
  type: DataTypes.STRING,
  validate: {
    isEmail: true
  }
}

// Numeric validation
phone: {
  type: DataTypes.STRING,
  validate: {
    isNumeric: true
  }
}

// Min/Max values
rating: {
  type: DataTypes.DECIMAL(3, 2),
  validate: {
    min: 0,
    max: 5
  }
}

// Custom validation
price: {
  type: DataTypes.DECIMAL(10, 2),
  validate: {
    isDecimal: true,
    min: 0
  }
}
```

---

## Common Queries by Feature

### Home Page - Featured & Recent Products
```javascript
const featuredProducts = await Product.findAll({
  where: { is_featured: true },
  limit: 8,
  include: ['Category']
});

const recentProducts = await Product.findAll({
  order: [['createdAt', 'DESC']],
  limit: 8,
  include: ['Category']
});
```

### Product Listing - Full Search & Filter
```javascript
const { category, minPrice, maxPrice, search, sort, page } = req.query;

const where = {};
if (category) where.categoryId = category;
if (search) where.name = { [Op.like]: `%${search}%` };
if (minPrice || maxPrice) {
  where.price = {};
  if (minPrice) where.price[Op.gte] = minPrice;
  if (maxPrice) where.price[Op.lte] = maxPrice;
}

const order = [];
switch(sort) {
  case 'price_low': order.push(['price', 'ASC']); break;
  case 'price_high': order.push(['price', 'DESC']); break;
  case 'rating': order.push(['rating', 'DESC']); break;
  default: order.push(['createdAt', 'DESC']);
}

const products = await Product.findAll({
  where,
  include: ['Category'],
  order,
  limit: 12,
  offset: (page - 1) * 12
});
```

### Product Details with Reviews
```javascript
const product = await Product.findByPk(productId, {
  include: [
    { model: Category },
    {
      model: Review,
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 5
    }
  ]
});
```

### Cart Total Calculation
```javascript
const cartItems = await Cart.findAll({
  where: { userId },
  include: [{ model: Product }]
});

const total = cartItems.reduce((sum, item) => 
  sum + (item.Product.price * item.quantity), 0
);

const itemCount = cartItems.reduce((sum, item) => 
  sum + item.quantity, 0
);
```

### Order History with Items
```javascript
const orders = await Order.findAll({
  where: { userId },
  include: [{
    model: OrderItem,
    include: [{ model: Product, attributes: ['name', 'image_url'] }]
  }],
  order: [['createdAt', 'DESC']]
});
```

### Admin - Dashboard Stats
```javascript
// Total revenue
const totalRevenue = await Order.sum('total_amount', {
  where: { status: 'delivered' }
});

// Total customers
const totalCustomers = await User.count({
  where: { role: 'customer' }
});

// Total products
const totalProducts = await Product.count();

// Low stock alerts
const lowStockProducts = await Product.findAll({
  where: { stock: { [Op.lt]: 5 } },
  limit: 10
});

// Recent orders
const recentOrders = await Order.findAll({
  limit: 10,
  order: [['createdAt', 'DESC']],
  include: [{ model: User }]
});
```

---

## Error Handling

### Common Errors

```javascript
// Unique constraint violation (duplicate email)
if (error.name === 'SequelizeUniqueConstraintError') {
  return res.status(400).json({ error: 'Email already exists' });
}

// Validation error
if (error.name === 'SequelizeValidationError') {
  const messages = error.errors.map(e => e.message);
  return res.status(400).json({ errors: messages });
}

// Foreign key constraint
if (error.name === 'SequelizeForeignKeyConstraintError') {
  return res.status(400).json({ error: 'Invalid reference' });
}
```

---

## Best Practices

1. **Always authenticate requests** - Verify user role before admin operations
2. **Validate input** - Check types and values before database operations
3. **Use transactions** - For operations involving multiple tables
4. **Handle relations** - Use `include` to fetch related data in one query
5. **Paginate results** - Use `limit` and `offset` for large datasets
6. **Selective attributes** - Use `attributes` to exclude sensitive fields:
   ```javascript
   attributes: { exclude: ['password'] }
   ```
7. **Cache frequently accessed data** - Categories, products list
8. **Optimize queries** - Avoid N+1 queries by using `include`
9. **Set appropriate foreign key constraints** - Use CASCADE or RESTRICT
10. **Log errors properly** - For debugging and monitoring
