const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/99acres-clone')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create a test user
      const testUser = await User.create({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        mobile: '1234567890',
        role: 'buyer',
        verified: true
      });
      
      console.log('Test user created successfully:', testUser);
    } catch (error) {
      console.error('Error creating test user:', error.message);
    } finally {
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
