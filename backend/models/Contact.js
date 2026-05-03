// models/Contact.js — Mongoose Schema (Syllabus: Lecture 33-36)
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, default: '', trim: true },
  email:      { type: String, required: true, lowercase: true, trim: true },
  phone:      { type: String, default: '' },
  subject:    { type: String, required: true },
  message:    { type: String, required: true },
  newsletter: { type: Boolean, default: false },
  status:     { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

contactSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
