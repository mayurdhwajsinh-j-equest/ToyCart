# ToyCart Server Setup Guide

Complete guide for setting up the Sequelize models with your Express server.

---

## Prerequisites

Ensure you have installed the required packages:

```bash
npm install sequelize sqlite3
npm install bcryptjs jsonwebtoken  # For authentication
npm install dotenv                  # For environment variables
```

---

## Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# Database
DB_PATH=./database.sqlite

# JWT
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## Update server.js

Here's how to integrate the Sequelize models with your Express server:

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const { connectDB, sequelize, User, Category, Product, Cart, Order, OrderItem, Review, WishList } = require('./config/db');

// Import routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Database connected and synced');

    // Start listening
    app.listen(PORT, () => {
      console.log(`ToyCart API Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
```

---

## Authentication Middleware

Create `middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
```

---

## Example Routes Implementation

### User Routes (`routes/user.js`)

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, address, city, state, zipcode, phone } = req.body;

    const user = await User.findByPk(req.user.id);

    await user.update({
      name: name || user.name,
      address,
      city,
      state,
      zipcode,
      phone
    });

    res.json({
      message: 'Profile updated',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Product Routes (`routes/product.js`)

```javascript
const express = require('express');
const { Op } = require('sequelize');
const { Product, Category, Review, User } = require('../config/db');

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort = 'newest', page = 1, limit = 12 } = req.query;

    const where = {};
    if (category) where.categoryId = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const order = [];
    switch (sort) {
      case 'price_low':
        order.push(['price', 'ASC']);
        break;
      case 'price_high':
        order.push(['price', 'DESC']);
        break;
      case 'rating':
        order.push(['rating', 'DESC']);
        break;
      default:
        order.push(['createdAt', 'DESC']);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['name'] }],
      order,
      limit: parseInt(limit),
      offset
    });

    res.json({
      products: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        {
          model: Review,
          include: [{ model: User, attributes: ['name'] }]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Database Seeding

Create `scripts/seed.js` to populate initial data:

```javascript
const { sequelize, Category, Product, User } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Warning: Clears all data

    // Create categories
    const categories = await Category.bulkCreate([
      { name: 'Action Figures', description: 'Action figures and collectibles' },
      { name: 'Board Games', description: 'Board games for all ages' },
      { name: 'Dolls', description: 'Dolls and accessories' },
      { name: 'Puzzles', description: 'Puzzles and brain teasers' },
      { name: 'Building Sets', description: 'LEGO and building blocks' },
      { name: 'Educational', description: 'Educational toys' }
    ]);

    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: 'Super Action Hero',
        description: 'An amazing action figure',
        short_description: 'Classic action figure',
        price: 29.99,
        categoryId: categories[0].id,
        stock: 50,
        is_featured: true,
        availability: 'in_stock'
      },
      // Add more products...
    ]);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@toycart.com',
      password: adminPassword,
      role: 'admin'
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
```

Run with: `node scripts/seed.js`

---

## Testing the Setup

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get Protected Route
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Debugging Tips

1. **Enable SQL Logging**: In `models/index.js`, change `logging: false` to `logging: console.log`
2. **Check Database File**: On Windows, use SQLite browser to inspect `database.sqlite`
3. **Test Models Directly**: Create a test script to verify model operations
4. **Validate Relationships**: Ensure all `include` queries return expected data
5. **Monitor Errors**: Check terminal output for detailed Sequelize error messages

---

## Production Deployment

For production:

1. Use PostgreSQL or MySQL instead of SQLite
2. Update connection in `models/index.js`:
   ```javascript
   const sequelize = new Sequelize({
     dialect: 'postgres',
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     username: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
   });
   ```

2. Use `sequelize.sync({ alter: false })` - Set `alter: false` to prevent accidental drops
3. Create database migrations for schema changes
4. Set strong JWT_SECRET in environment variables
5. Use HTTPS for all API calls
6. Implement rate limiting on sensitive endpoints
7. Regular database backups

---

## Next Steps

1. Create all route files (user, product, cart, order, review, wishlist, admin)
2. Implement authentication middleware
3. Add input validation using packages like `joi` or `express-validator`
4. Set up error logging
5. Create API documentation using Swagger/OpenAPI
6. Implement unit and integration tests
7. Deploy to production server
