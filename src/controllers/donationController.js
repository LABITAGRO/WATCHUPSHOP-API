const Donation = require('../model/Donation');

exports.createDonation = async (req, res) => {
  try {
    const {
      donationType,
      donationAmount,
      donorName,
      selectedNGO,
      percentage,
      productName,
      selectedWatchType,
      watchYear,
      selectedBrand,
    } = req.body;

    const newDonation = new Donation({
      donationType,
      donationAmount,
      donorName,
      donorPhoto: req.file ? req.file.path : null,
      selectedNGO,
      percentage,
      productName,
      selectedWatchType,
      watchYear,
      selectedBrand,
    });

    await newDonation.save();
    res.status(201).json({ message: 'Donation saved successfully', donation: newDonation });
  } catch (error) {
    console.error('Error saving donation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
