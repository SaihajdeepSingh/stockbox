// routes/auth.js — Authentication routes (Syllabus: Lecture 21-24)
const router = require('express').Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validate, signupRules, loginRules } = require('../middleware/validate');

// Public routes
router.post('/register', signupRules, validate, register);
router.post('/login',    loginRules,  validate, login);

// Protected routes
router.get('/me',                requireAuth, getMe);
router.put('/profile',           requireAuth, updateProfile);
router.put('/change-password',   requireAuth, changePassword);

module.exports = router;
