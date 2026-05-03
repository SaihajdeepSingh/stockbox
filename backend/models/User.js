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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toSafeObject = function () {
  const { _id, name, email, phone, country, role, createdAt, lastLogin, avatar } = this;
  return { _id, name, email, phone, country, role, createdAt, lastLogin, avatar };
};

module.exports = mongoose.model('User', userSchema);