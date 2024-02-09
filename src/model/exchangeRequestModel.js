const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  productName: String,
  watchType: String,
  watchYear: Number,
  watchBrand: String,
  watchCondition: String,
  watchPhoto: String // Assuming you're storing the file path in the database
});

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
