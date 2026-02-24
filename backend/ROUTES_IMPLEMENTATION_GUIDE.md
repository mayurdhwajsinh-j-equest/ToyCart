# ToyCart API Routes Implementation Guide

This guide provides example implementations for all API endpoints using the Sequelize models.

---

## Table of Contents
1. [User Routes](#user-routes)
2. [Category Routes](#category-routes)
3. [Product Routes](#product-routes)
4. [Cart Routes](#cart-routes)
5. [Order Routes](#order-routes)
6. [Review Routes](#review-routes)
7. [WishList Routes](#wishlist-routes)
8. [Admin Routes](#admin-routes)

---

## User Routes

### Register User
```javascript
async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Login User
```javascript
async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Get User Profile
```javascript
async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Update User Profile
```javascript
async (req, res) => {
  try {
    const { name, address, city, state, zipcode, phone } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    await user.update({
      name,
      address,
      city,
      state,
      zipcode,
      phone
    });
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Category Routes

### Get All Categories
```javascript
async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url']
      }]
    });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Get Category with Products
```javascript
async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        where: { stock: { [Op.gt]: 0 } }
      }]
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Create Category (Admin)
```javascript
async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    
    const category = await Category.create({
      name,
      description,
      image_url
    });
    
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Product Routes

### Get All Products (with Filters & Sorting)
```javascript
async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort = 'newest', page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (category) where.categoryId = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    
    const order = [];
    if (sort === 'price_low') order.push(['price', 'ASC']);
    if (sort === 'price_high') order.push(['price', 'DESC']);
    if (sort === 'rating') order.push(['rating', 'DESC']);
    if (sort === 'newest') order.push(['createdAt', 'DESC']);
    
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
}
```

### Get Product Details
```javascript
async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
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
}
```

### Create Product (Admin)
```javascript
async (req, res) => {
  try {
    const { name, description, short_description, price, categoryId, image_url, stock, is_featured } = req.body;
    
    const product = await Product.create({
      name,
      description,
      short_description,
      price,
      categoryId,
      image_url,
      additional_images: [],
      stock,
      is_featured,
      availability: stock > 0 ? 'in_stock' : 'out_of_stock'
    });
    
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Update Product (Admin)
```javascript
async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update availability based on stock
    if (updateData.stock !== undefined) {
      updateData.availability = updateData.stock > 0 ? 'in_stock' : 'out_of_stock';
    }
    
    await product.update(updateData);
    
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Delete Product (Admin)
```javascript
async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.destroy();
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Cannot delete product with existing orders' });
    }
    res.status(500).json({ error: error.message });
  }
}
```

---

## Cart Routes

### Get Cart Items
```javascript
async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Add to Cart
```javascript
async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    let cartItem = await Cart.findOne({
      where: { userId: req.user.id, productId }
    });
    
    if (cartItem) {
      // Update quantity if already in cart
      await cartItem.update({ quantity: cartItem.quantity + quantity });
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
        price: product.price
      });
    }
    
    res.status(201).json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Update Cart Item
```javascript
async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;
    
    const cartItem = await Cart.findByPk(cartId);
    
    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json({ message: 'Item removed from cart' });
    }
    
    await cartItem.update({ quantity });
    
    res.json({ message: 'Cart updated', cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Remove from Cart
```javascript
async (req, res) => {
  try {
    const { cartId } = req.params;
    
    const cartItem = await Cart.findByPk(cartId);
    
    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    await cartItem.destroy();
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Clear Cart
```javascript
async (req, res) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Order Routes

### Create Order (Checkout)
```javascript
async (req, res) => {
  try {
    const { delivery_address, city, state, zipcode, phone, payment_method, special_notes } = req.body;
    
    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }]
    });
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    const total_amount = cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);
    
    // Create order
    const orderNumber = `ORD-${Date.now()}`;
    const order = await Order.create({
      order_number: orderNumber,
      userId: req.user.id,
      total_amount,
      delivery_address,
      city,
      state,
      zipcode,
      phone,
      payment_method,
      special_notes
    });
    
    // Create order items
    const orderItems = await Promise.all(
      cartItems.map(item => OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
        total_price: item.Product.price * item.quantity
      }))
    );
    
    // Update product stock
    await Promise.all(
      cartItems.map(item => 
        item.Product.decrement('stock', { by: item.quantity })
      )
    );
    
    // Clear cart
    await Cart.destroy({ where: { userId: req.user.id } });
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        ...order.toJSON(),
        items: orderItems
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Get Order Details
```javascript
async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['name', 'image_url'] }]
      }]
    });
    
    if (!order || (order.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Get User Orders
```javascript
async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Update Order Status (Admin)
```javascript
async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, shipping_date, delivery_date, tracking_number } = req.body;
    
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.update({
      status,
      shipping_date,
      delivery_date,
      tracking_number
    });
    
    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Review Routes

### Add Review
```javascript
async (req, res) => {
  try {
    const { productId, rating, title, review_text } = req.body;
    
    // Check if user purchased the product
    const order = await Order.findOne({
      include: [{
        model: OrderItem,
        where: { productId },
        required: true
      }],
      where: { userId: req.user.id }
    });
    
    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      title,
      review_text,
      is_verified_purchase: !!order
    });
    
    // Update product rating
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2);
    
    await Product.update(
      { rating: avgRating, number_of_reviews: allReviews.length },
      { where: { id: productId } }
    );
    
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Get Product Reviews
```javascript
async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.findAll({
      where: { productId },
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## WishList Routes

### Add to WishList
```javascript
async (req, res) => {
  try {
    const { productId } = req.body;
    
    const wishlistItem = await WishList.create({
      userId: req.user.id,
      productId
    });
    
    res.status(201).json({ message: 'Added to wishlist', wishlistItem });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Already in wishlist' });
    }
    res.status(500).json({ error: error.message });
  }
}
```

### Get WishList
```javascript
async (req, res) => {
  try {
    const wishlist = await WishList.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image_url', 'rating'] }]
    });
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Remove from WishList
```javascript
async (req, res) => {
  try {
    const { productId } = req.params;
    
    await WishList.destroy({
      where: { userId: req.user.id, productId }
    });
    
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Admin Routes

### Get All Users (Admin)
```javascript
async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: { role: 'customer' }
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Get All Orders (Admin)
```javascript
async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    res.json({
      orders: rows,
      total: count,
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Error Handling

Always wrap database operations in try-catch blocks and return appropriate HTTP status codes:
- `200/201`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

For validation errors, provide clear error messages to help API consumers fix their requests.
