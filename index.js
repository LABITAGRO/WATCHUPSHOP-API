const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500
const bodyParser = require('body-parser');
const productRoutes = require('./src/routes/productRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const exchangeRequestRoutes = require('./src/routes/exchangeRequestRoutes');
const authRouter = require('./src/routes/auth'); 
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');




// Enable CORS for all origins
app.use(cors());


app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/exchange', exchangeRequestRoutes);


// Multer middleware for handling file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const uploadDisk = multer({ storage: storage });


// Multer middleware for handling file uploads (Memory Storage)
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

// Connect to MongoDB Atlas
const mongoURI = "mongodb+srv://labitagropvtltd:LABIT%402024@cluster0.gmzbzrw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define a Mongoose model for product sell
mongoose.models = {};
const Product = mongoose.model('Product', {
  productName: String,
  watchType: String,
  brandName: String,
  condition: String,
  reasonForSelling: String,
  image: String,
});

// Define a Mongoose model for donate
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

const Donation = mongoose.model('Donation', donationSchema);

// model for exchnage
const exchangeRequestSchema = new mongoose.Schema({
  productName: String,
  watchType: String,
  watchYear: Number,
  watchBrand: String,
  watchCondition: String,
  watchPhoto: String,
});

// Define User schema




// const authRouter = require('./src/routes/auth');
// app.use(bodyParser.json());

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);

// Import routes

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
})

// Create a mongoose model based on the schema
const User = mongoose.model("User", userSchema)







// API endpoint for handling form submissions for product selll
app.post('/api/products', upload.single('image'), async (req, res) => {
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
});







// API endpoint for handling form submissions for donate
app.post('/api/donations', upload.single('donorPhoto'), async (req, res) => {
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
});


// API endpoint for handling form submissions for exchnage
app.post('/api/exchangerequests', async (req, res) => {
  try {
    const { productName, watchType, watchYear, watchBrand, watchCondition, watchPhoto } = req.body;

    // Create a new exchange request
    const exchangeRequest = new ExchangeRequest({
      productName,
      watchType,
      watchYear,
      watchBrand,
      watchCondition,
      watchPhoto,
    });

    // Save the exchange request to the database
    await exchangeRequest.save();

    res.status(201).json({ message: 'Exchange request submitted successfully' });
  } catch (error) {
    console.error('Error submitting exchange request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to handle user registration
// Register endpoint




//login

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body)    // Create a new user based on the request body
    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Error: ", error)
    res.status(500).json({ error: "Error occurred while registering the user" })
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });   // Find the user by email and password

    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Login failed" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});





// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
