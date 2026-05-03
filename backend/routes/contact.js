// routes/contact.js — Contact form routes
const router  = require('express').Router();
const Contact = require('../models/Contact');
const { validate, contactRules } = require('../middleware/validate');

// POST /api/contact — submit support form
router.post('/', contactRules, validate, async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, subject, message, newsletter } = req.body;

    const contact = await Contact.create({
      firstName, lastName, email, phone, subject, message,
      newsletter: newsletter || false,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you within 24 hours.",
      id: contact._id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
