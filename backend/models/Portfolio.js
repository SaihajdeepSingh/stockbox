const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol:       { type: String, required: true, uppercase: true },
  companyName:  { type: String, default: '' },
  exchange:     { type: String, default: 'NSE' },
  quantity:     { type: Number, required: true, min: 0 },
  avgBuyPrice:  { type: Number, required: true, min: 0 },
  totalInvested:{ type: Number, required: true, min: 0 },
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  cashBalance: {
    type: Number,
    default: 1000000,
    min: 0,
  },
  holdings: [holdingSchema],
  totalDeposited: { type: Number, default: 1000000 },
}, { timestamps: true });

portfolioSchema.virtual('totalInvestedValue').get(function () {
  return this.holdings.reduce((sum, h) => sum + h.totalInvested, 0);
});

portfolioSchema.methods.getHolding = function (symbol) {
  return this.holdings.find(h => h.symbol === symbol.toUpperCase()) || null;
};

module.exports = mongoose.model('Portfolio', portfolioSchema);