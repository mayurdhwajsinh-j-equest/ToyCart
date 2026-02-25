const express = require('express');
const { Cart, Product, User } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

// ========== GET CART ITEMS ==========
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url', 'stock', 'availability']
      }],
      order: [['createdAt', 'DESC']]
    });

    const total = cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      items: cartItems,
      summary: {
        itemCount,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
});

// ========== ADD TO CART ==========
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validations
    if (!productId || quantity < 1) {
      return next(new AppError('Product ID and quantity required', 400));
    }

    // Check product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check stock availability
    if (product.stock < quantity) {
      return next(new AppError(`Only ${product.stock} items available`, 400));
    }

    // Check if already in cart
    let cartItem = await Cart.findOne({
      where: { userId: req.user.id, productId }
    });

    if (cartItem) {
      // Update quantity if already in cart
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return next(new AppError(`Only ${product.stock} items available`, 400));
      }
      await cartItem.update({ quantity: newQuantity });
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
        price: product.price
      });
    }

    const updatedCart = await Cart.findByPk(cartItem.id, {
      include: [{ model: Product }]
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cartItem: updatedCart
    });
  } catch (error) {
    next(error);
  }
});

// ========== UPDATE CART ITEM ==========
router.put('/:cartId', authMiddleware, async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return next(new AppError('Invalid quantity', 400));
    }

    const cartItem = await Cart.findByPk(req.params.cartId);
    if (!cartItem || cartItem.userId !== req.user.id) {
      return next(new AppError('Cart item not found', 404));
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await cartItem.destroy();
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    // Check stock
    const product = await Product.findByPk(cartItem.productId);
    if (product.stock < quantity) {
      return next(new AppError(`Only ${product.stock} items available`, 400));
    }

    await cartItem.update({ quantity });

    res.json({
      success: true,
      message: 'Cart updated',
      cartItem
    });
  } catch (error) {
    next(error);
  }
});

// ========== REMOVE FROM CART ==========
router.delete('/:cartId', authMiddleware, async (req, res, next) => {
  try {
    const cartItem = await Cart.findByPk(req.params.cartId);

    if (!cartItem || cartItem.userId !== req.user.id) {
      return next(new AppError('Cart item not found', 404));
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
});

// ========== CLEAR CART ==========
router.delete('/', authMiddleware, async (req, res, next) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
