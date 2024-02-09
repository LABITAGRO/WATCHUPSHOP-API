const express = require('express');
const router = express.Router();
const exchangeRequestController = require('../controllers/exchangeRequestController');

router.post('/', exchangeRequestController.submitExchangeRequest);

module.exports = router;

