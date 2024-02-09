const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationType: String,
  donationAmount: Number,
  donorName: String,
  donorPhoto: String,
  selectedNGO: String,
  percentage: Number,
  productName: String,
  selectedWatchType: String,
  watchYear: Number,
  selectedBrand: String,
});

module.exports = mongoose.model('Donation', donationSchema);
