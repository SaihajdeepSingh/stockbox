// models/Trade.js — Trade history record (Syllabus: Lecture 33-36)
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  symbol:      { type: String, required: true, uppercase: true },
  companyName: { type: String, default: '' },
  exchange:    { type: String, default: 'NSE' },
  type:        { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity:    { type: Number, required: true, min: 1 },
  price:       { type: Number, required: true, min: 0 },    // price per share at execution
  total:       { type: Number, required: true, min: 0 },    // quantity × price
  balanceBefore:{ type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  profitLoss:  { type: Number, default: 0 },                // only for SELL trades
  status:      { type: String, enum: ['executed', 'failed'], default: 'executed' },
  note:        { type: String, default: '' },
}, { timestamps: true });

tradeSchema.index({ userId: 1, createdAt: -1 });
tradeSchema.index({ userId: 1, symbol: 1 });

module.exports = mongoose.model('Trade', tradeSchema);
