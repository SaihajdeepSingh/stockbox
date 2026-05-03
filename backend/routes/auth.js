const router = require('express').Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validate, signupRules, loginRules } = require('../middleware/validate');

router.post('/register', signupRules, validate, register);
router.post('/login',    loginRules,  validate, login);

router.get('/me',                requireAuth, getMe);
router.put('/profile',           requireAuth, updateProfile);
router.put('/change-password',   requireAuth, changePassword);

module.exports = router;
