const express = require('express');
const { Order, OrderItem, Cart, Product, User } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

// ========== CREATE ORDER (CHECKOUT) ==========
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { delivery_address, city, state, zipcode, phone, payment_method, special_notes } = req.body;

    // Validations
    if (!delivery_address || !city || !state || !zipcode || !phone) {
      return next(new AppError('Please fill all delivery details', 400));
    }

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }]
    });

    if (cartItems.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    // Check stock availability
    for (let item of cartItems) {
      if (item.Product.stock < item.quantity) {
        return next(new AppError(`${item.Product.name} has insufficient stock`, 400));
      }
    }

    // Calculate total
    const total_amount = cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);

    // Create order
    const orderNumber = `ORD-${Date.now()}-${req.user.id}`;
    const order = await Order.create({
      order_number: orderNumber,
      userId: req.user.id,
      total_amount: parseFloat(total_amount.toFixed(2)),
      delivery_address,
      city,
      state,
      zipcode,
      phone,
      payment_method: payment_method || 'cash_on_delivery',
      special_notes: special_notes || null
    });

    // Create order items and update stock
    const orderItems = [];
    for (let item of cartItems) {
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
        total_price: item.Product.price * item.quantity
      });
      orderItems.push(orderItem);

      // Update product stock
      await item.Product.decrement('stock', { by: item.quantity });

      // Update availability
      const updatedProduct = await Product.findByPk(item.productId);
      if (updatedProduct.stock <= 0) {
        await updatedProduct.update({ availability: 'out_of_stock' });
      }
    }

    // Clear cart
    await Cart.destroy({ where: { userId: req.user.id } });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        ...order.toJSON(),
        items: orderItems
      }
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET USER ORDERS ==========
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, include: [{ model: Product, attributes: ['name', 'image_url'] }] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      orders: rows,
      pagination: {
        total: count,
        pages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET ORDER DETAILS ==========
router.get('/:orderId', authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['id', 'name', 'image_url', 'price'] }]
      }]
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Check authorization
    if (order.userId !== req.user.id) {
      return next(new AppError('Unauthorized to view this order', 403));
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

// ========== CANCEL ORDER ==========
router.put('/:orderId/cancel', authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.userId !== req.user.id) {
      return next(new AppError('Unauthorized', 403));
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return next(new AppError('Can only cancel pending orders', 400));
    }

    // Restore stock
    const orderItems = await OrderItem.findAll({ where: { orderId: order.id } });
    for (let item of orderItems) {
      const product = await Product.findByPk(item.productId);
      await product.increment('stock', { by: item.quantity });
      await product.update({ availability: 'in_stock' });
    }

    // Cancel order
    await order.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
