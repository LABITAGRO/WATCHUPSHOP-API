// Remove the following line from your server.js file:
// const User = mongoose.model('User', { ... });

// In the file where you define your User model (e.g., User.js):
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);
