const Product = require('../model/Product');

const createProduct = async (req, res) => {
  const { productName, watchType, brandName, condition, reasonForSelling } = req.body;
  const imagePath = req.file ? req.file.path : '';

  try {
    const product = new Product({
      productName,
      watchType,
      brandName,
      condition,
      reasonForSelling,
      image: imagePath,
    });

    await product.save();
    res.json({ success: true, message: 'Product saved successfully' });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
};
