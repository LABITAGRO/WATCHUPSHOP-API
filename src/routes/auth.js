// const express = require('express');
// const router = express.Router();

// const User = require('../model/User'); // Assuming you have a User model

// // Register route
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, username, password } = req.body;
    
//     // Check if the username or email already exists in the database
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Username or email already exists' });
//     }

//     // Hash the password before saving it to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user object
//     const newUser = new User({ name, email, username, password: hashedPassword });

//     // Save the user to the database
//     await newUser.save();

//     // Return a success response
//     res.status(201).json({ message: 'Registration successful' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if the password is correct
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Password is correct, return success response
//     res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;
