const express = require('express');
const { Review, Product, User, Order, OrderItem } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

// ========== ADD REVIEW ==========
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { productId, rating, title, review_text } = req.body;

    // Validations
    if (!productId || !rating) {
      return next(new AppError('Product ID and rating required', 400));
    }

    if (rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }

    // Check product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    // Check if user has purchased this product
    const purchaseVerified = await Order.findOne({
      include: [{
        model: OrderItem,
        where: { productId },
        required: true
      }],
      where: { userId: req.user.id, status: 'delivered' }
    });

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      title: title || null,
      review_text: review_text || null,
      is_verified_purchase: !!purchaseVerified
    });

    // Update product rating
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2);

    await Product.update(
      { rating: parseFloat(avgRating), number_of_reviews: allReviews.length },
      { where: { id: productId } }
    );

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['id', 'name'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: reviewWithUser
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET PRODUCT REVIEWS ==========
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    // Check product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const order = [];
    switch (sort) {
      case 'helpful':
        order.push(['helpful_count', 'DESC']);
        break;
      case 'rating_high':
        order.push(['rating', 'DESC']);
        break;
      case 'rating_low':
        order.push(['rating', 'ASC']);
        break;
      default:
        order.push(['createdAt', 'DESC']);
    }

    const { count, rows } = await Review.findAndCountAll({
      where: { productId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order,
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      reviews: rows,
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

// ========== UPDATE REVIEW ==========
router.put('/:reviewId', authMiddleware, async (req, res, next) => {
  try {
    const { rating, title, review_text } = req.body;

    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (review.userId !== req.user.id) {
      return next(new AppError('Unauthorized to edit this review', 403));
    }

    if (rating && (rating < 1 || rating > 5)) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }

    await review.update({
      rating: rating || review.rating,
      title: title || review.title,
      review_text: review_text || review.review_text
    });

    // Update product rating
    const allReviews = await Review.findAll({ where: { productId: review.productId } });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2);

    await Product.update(
      { rating: parseFloat(avgRating) },
      { where: { id: review.productId } }
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    next(error);
  }
});

// ========== DELETE REVIEW ==========
router.delete('/:reviewId', authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (review.userId !== req.user.id) {
      return next(new AppError('Unauthorized', 403));
    }

    const productId = review.productId;
    await review.destroy();

    // Update product rating
    const allReviews = await Review.findAll({ where: { productId } });
    if (allReviews.length > 0) {
      const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2);
      await Product.update(
        { rating: parseFloat(avgRating), number_of_reviews: allReviews.length },
        { where: { id: productId } }
      );
    } else {
      await Product.update(
        { rating: 0, number_of_reviews: 0 },
        { where: { id: productId } }
      );
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ========== MARK REVIEW AS HELPFUL ==========
router.post('/:reviewId/helpful', async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    await review.increment('helpful_count');

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpful_count: review.helpful_count + 1
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
