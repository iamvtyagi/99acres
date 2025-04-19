const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');

// Load environment variables
dotenv.config();

// Valid, accessible image URLs for properties
const validImageUrls = {
  'flat': [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6bb026',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc'
  ],
  'villa': [
    'https://images.unsplash.com/photo-1580587771525-78b9dba33b91',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83'
  ],
  'commercial': [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2'
  ],
  'plot': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    'https://images.unsplash.com/photo-1542889601-399c4f3a8402'
  ],
  'shop': [
    'https://images.unsplash.com/photo-1604014237800-1c9102c219da',
    'https://images.unsplash.com/photo-1582037928769-59cc0f2d1f1d'
  ],
  'default': [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
  ]
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/99acres-clone')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Get all properties
      const properties = await Property.find();
      console.log(`Found ${properties.length} properties`);
      
      // Update each property with valid image URLs
      for (const property of properties) {
        // Select appropriate images based on property type
        const imageSet = validImageUrls[property.type] || validImageUrls.default;
        
        // Add a random variation to ensure different properties have different images
        const randomImages = [
          ...imageSet,
          validImageUrls.default[Math.floor(Math.random() * validImageUrls.default.length)]
        ];
        
        // Update the property
        property.images = randomImages;
        await property.save();
        console.log(`Updated images for property: ${property.title}`);
      }
      
      console.log('All property images updated successfully');
      
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
