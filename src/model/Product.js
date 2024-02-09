const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  watchType: String,
  brandName: String,
  condition: String,
  reasonForSelling: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
