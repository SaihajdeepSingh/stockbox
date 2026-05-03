const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const signupRules = [
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional({ checkFalsy: true }).matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const tradeRules = [
  body('symbol').trim().notEmpty().withMessage('Stock symbol is required').toUpperCase(),
  body('type').isIn(['BUY', 'SELL']).withMessage('Trade type must be BUY or SELL'),
  body('quantity').isInt({ min: 1, max: 10000 }).withMessage('Quantity must be between 1 and 10000'),
];

const contactRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().optional(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

module.exports = { validate, signupRules, loginRules, tradeRules, contactRules };