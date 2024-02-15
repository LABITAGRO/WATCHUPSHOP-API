const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationType: String,
  
  donorName: String,
  
  selectedCause: String,
  selectedOrganization: String,
  percentage: Number,
  productName: String,
  selectedWatchType: String,  
  watchYear: Number,
  selectedBrand: String,
  image: String,
});

module.exports = mongoose.model('Donation', donationSchema);