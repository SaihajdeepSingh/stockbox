// models/User.js — Mongoose ODM (Syllabus: Lecture 33-36)
// Demonstrates: Schema design, pre-save hooks, instance methods, indexing
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:     { type: String, default: '', trim: true },
  country:   { type: String, default: 'India', trim: true },
  password:  { type: String, required: true, select: true },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive:  { type: Boolean, default: true },
  lastLogin: { type: Date },
  avatar:    { type: String, default: '' },
}, { timestamps: true });

// Compound index for fast lookups
// email index created automatically by unique:true above

// Pre-save hook: hash password only when modified (Bcrypt — Lecture 41-44)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare entered password with stored hash
userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Instance method: return safe public object (no password)
userSchema.methods.toSafeObject = function () {
  const { _id, name, email, phone, country, role, createdAt, lastLogin, avatar } = this;
  return { _id, name, email, phone, country, role, createdAt, lastLogin, avatar };
};

module.exports = mongoose.model('User', userSchema);
