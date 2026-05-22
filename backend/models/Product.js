const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  marketingCaption: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
