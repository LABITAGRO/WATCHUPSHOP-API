const ExchangeRequest = require('../model/exchangeRequestModel');

exports.submitExchangeRequest = async (req, res) => {
  try {
    const exchangeRequest = new ExchangeRequest(req.body);
    await exchangeRequest.save();
    res.status(201).json({ message: 'Exchange request submitted successfully' });
  } catch (error) {
    console.error('Error submitting exchange request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
