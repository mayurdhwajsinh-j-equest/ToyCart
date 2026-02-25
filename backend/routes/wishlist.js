const express = require('express');
const { WishList, Product } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

// ========== GET WISHLIST ==========
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const wishlist = await WishList.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url', 'rating', 'stock', 'availability']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      items: wishlist,
      count: wishlist.length
    });
  } catch (error) {
    next(error);
  }
});

// ========== ADD TO WISHLIST ==========
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return next(new AppError('Product ID required', 400));
    }

    // Check product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if already in wishlist
    const existing = await WishList.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existing) {
      return next(new AppError('Product already in wishlist', 400));
    }

    // Create wishlist item
    const wishlistItem = await WishList.create({
      userId: req.user.id,
      productId
    });

    const item = await WishList.findByPk(wishlistItem.id, {
      include: [{ model: Product }]
    });

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      wishlistItem: item
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new AppError('Product already in wishlist', 400));
    }
    next(error);
  }
});

// ========== REMOVE FROM WISHLIST ==========
router.delete('/:productId', authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const removed = await WishList.destroy({
      where: { userId: req.user.id, productId }
    });

    if (removed === 0) {
      return next(new AppError('Item not in wishlist', 404));
    }

    res.json({
      success: true,
      message: 'Removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
});

// ========== CHECK IF PRODUCT IN WISHLIST ==========
router.get('/check/:productId', authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const exists = await WishList.findOne({
      where: { userId: req.user.id, productId }
    });

    res.json({
      success: true,
      inWishlist: !!exists
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
