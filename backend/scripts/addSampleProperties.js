const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: '../.env' });

// Sample property data
const sampleProperties = [
  {
    title: 'Luxury 3BHK Apartment in Mumbai',
    description: 'Beautiful 3BHK apartment with modern amenities, spacious rooms, and a stunning view of the city skyline. Located in a prime area with easy access to schools, hospitals, and shopping centers.',
    price: 9500000,
    location: {
      address: 'Palm Beach Road, Vashi',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400705',
      coordinates: {
        type: 'Point',
        coordinates: [72.9915, 19.0760]
      }
    },
    type: 'flat',
    status: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    size: 1500,
    amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Power Backup', 'Parking', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc'
    ],
    featured: true,
    verified: true
  },
  {
    title: 'Modern 2BHK Flat for Rent in Delhi',
    description: 'Fully furnished 2BHK flat available for rent in a gated community. Features include modular kitchen, air conditioning, and premium flooring. Close to metro station and market.',
    price: 35000,
    location: {
      address: 'Sector 15, Dwarka',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110078',
      coordinates: {
        type: 'Point',
        coordinates: [77.0266, 28.5890]
      }
    },
    type: 'flat',
    status: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    amenities: ['Furnished', 'Air Conditioning', 'Lift', 'Security', 'Parking', 'Club House'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4'
    ],
    featured: true,
    verified: true
  },
  {
    title: 'Spacious 4BHK Villa in Bangalore',
    description: 'Luxurious 4BHK villa with private garden and terrace. Features include Italian marble flooring, designer kitchen, and smart home automation. Located in a premium gated community.',
    price: 15000000,
    location: {
      address: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      coordinates: {
        type: 'Point',
        coordinates: [77.7506, 12.9698]
      }
    },
    type: 'villa',
    status: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    size: 3200,
    amenities: ['Swimming Pool', 'Garden', 'Smart Home', 'Security', 'Parking', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83'
    ],
    featured: true,
    verified: true
  },
  {
    title: 'Commercial Office Space in Hyderabad',
    description: 'Premium office space available in a corporate park. Ideal for IT companies, startups, or corporate offices. Includes dedicated parking, 24/7 security, and power backup.',
    price: 12000000,
    location: {
      address: 'HITEC City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      coordinates: {
        type: 'Point',
        coordinates: [78.3800, 17.4400]
      }
    },
    type: 'commercial',
    status: 'sale',
    size: 2500,
    amenities: ['24/7 Access', 'Power Backup', 'Security', 'Parking', 'Conference Room', 'Cafeteria'],
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2'
    ],
    featured: true,
    verified: true
  },
  {
    title: 'Residential Plot in Pune',
    description: 'Prime residential plot in a developing area with excellent appreciation potential. All utilities available. Ready for construction with approved building plans.',
    price: 7500000,
    location: {
      address: 'Hinjewadi Phase 3',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      coordinates: {
        type: 'Point',
        coordinates: [73.7380, 18.5908]
      }
    },
    type: 'plot',
    status: 'sale',
    size: 2400,
    amenities: ['Gated Community', 'Park', 'Water Supply', 'Electricity', 'Road Access'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      'https://images.unsplash.com/photo-1542889601-399c4f3a8402'
    ],
    featured: true,
    verified: true
  },
  {
    title: 'Retail Shop in Chennai Mall',
    description: 'Commercial retail shop available in a high-footfall shopping mall. Perfect for retail brands, restaurants, or service businesses. Ready to move in with all fixtures.',
    price: 85000,
    location: {
      address: 'Phoenix Marketcity, Velachery',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600042',
      coordinates: {
        type: 'Point',
        coordinates: [80.2329, 13.0067]
      }
    },
    type: 'shop',
    status: 'rent',
    size: 800,
    amenities: ['Air Conditioning', 'Power Backup', 'Security', 'Parking', 'Storage Room'],
    images: [
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da',
      'https://images.unsplash.com/photo-1582037928769-59cc0f2d1f1d'
    ],
    featured: true,
    verified: true
  }
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/99acres-clone')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Find a seller user to be the owner of the properties
      const seller = await User.findOne({ role: 'seller' });
      
      if (!seller) {
        console.error('No seller user found. Please create a seller user first.');
        process.exit(1);
      }
      
      console.log(`Using seller: ${seller.name} (${seller.email}) as property owner`);
      
      // Add owner ID to each property
      const propertiesWithOwner = sampleProperties.map(property => ({
        ...property,
        ownerId: seller._id
      }));
      
      // Delete existing properties (optional)
      await Property.deleteMany({});
      console.log('Deleted existing properties');
      
      // Insert sample properties
      const result = await Property.insertMany(propertiesWithOwner);
      console.log(`Added ${result.length} sample properties to the database`);
      
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
