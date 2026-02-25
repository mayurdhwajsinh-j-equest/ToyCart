const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

// ========== REGISTER ==========
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role = 'customer' } = req.body;

    // Validations
    if (!name || !email || !password || !confirmPassword) {
      return next(new AppError('Please fill all fields', 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    if (password.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return next(new AppError('Email and password required', 400));
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
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
    next(error);
  }
});

// ========== GET PROFILE ==========
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// ========== UPDATE PROFILE ==========
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { name, address, city, state, zipcode, phone } = req.body;

    const user = await User.findByPk(req.user.id);

    await user.update({
      name: name || user.name,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      zipcode: zipcode || user.zipcode,
      phone: phone || user.phone
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode
      }
    });
  } catch (error) {
    next(error);
  }
});

// ========== CHANGE PASSWORD ==========
router.put('/change-password', authMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new AppError('Please fill all password fields', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError('New passwords do not match', 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }

    // Get user with password
    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
