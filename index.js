const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
aapp.use(cors({
  origin: 'https://watchupshop.onrender.com', // Replace with your frontend URL on Render
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/exchange', exchangeRequestRoutes);
app.use('/api/auth', authRouter);


//rout
// app.use('/api/auth', require('./src/routes/auth'));

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

// Define a Mongoose model for product
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
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// const authRouter = require('./src/routes/auth');
app.use(bodyParser.json());

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);

// Import routes
// const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');






// API endpoint for handling form submissions for product
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






// API endpoint for handling form submissions for product donate
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
    const exchangeRequest = new ExchangeRequest(req.body);
    await exchangeRequest.save();
    res.status(201).json({ message: 'Exchange request submitted successfully' });
  } catch (error) {
    console.error('Error submitting exchange request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to handle user registration
// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      username,
      password
    });

    // Save user to database
    await newUser.save();

    // Respond with success message
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});



//login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Password is correct, return success response
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// //server  for login
// app.use('/api/auth', authRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
