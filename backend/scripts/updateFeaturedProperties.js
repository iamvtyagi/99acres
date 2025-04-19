const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/99acres-clone')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Update all properties to be featured
      const result = await Property.updateMany(
        {}, // empty filter to match all documents
        { featured: true }
      );
      
      console.log(`Updated ${result.modifiedCount} properties to be featured`);
      
      // Verify the update
      const featuredProperties = await Property.find({ featured: true });
      console.log(`Total featured properties: ${featuredProperties.length}`);
      
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
