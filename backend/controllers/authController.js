// controllers/authController.js — Auth business logic (Syllabus: Lecture 41-44)
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');
const Portfolio = require('../models/Portfolio');

// Generate signed JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check for existing user
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered. Please log in.' });
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ name, email, phone: phone || '', password });

    // Auto-create portfolio with ₹10 lakh paper money
    await Portfolio.create({ userId: user._id, cashBalance: 1000000 });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to StockBox.',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'No account found with that email.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Account has been deactivated.' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, country } = req.body;
    const user = await User.findById(req.user._id);

    if (name)    user.name    = name;
    if (phone)   user.phone   = phone;
    if (country) user.country = country;

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Profile updated.', user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
    }

    user.password = newPassword; // will be hashed in pre-save
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
