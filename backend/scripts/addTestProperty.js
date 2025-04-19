const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/99acres-clone')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Create a simple test property
      const testProperty = {
        title: 'Test Property',
        description: 'This is a test property',
        price: 1000000,
        status: 'sale',
        type: 'flat',
        size: 1000,
        bedrooms: 2,
        bathrooms: 1,
        location: {
          address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          coordinates: {
            type: 'Point',
            coordinates: [0, 0]
          }
        },
        amenities: ['Test Amenity'],
        images: ['https://via.placeholder.com/400x300?text=Test+Property'],
        ownerId: '67fe4fc2420291185a2d0a3d', // Use the same owner ID as existing properties
        featured: true,
        verified: true
      };
      
      // Insert the test property
      const result = await Property.create(testProperty);
      console.log('Added test property:', result);
      
      // Verify the property was added
      const count = await Property.countDocuments();
      console.log(`Total properties in database: ${count}`);
      
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      mongoose.disconnect();
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
