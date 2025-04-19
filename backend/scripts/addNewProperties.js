const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/99acres-clone')
  .then(async () => {
    try {
      console.log('Connected to MongoDB');
      
      // Create a test user if none exists
      let owner = await User.findOne();
      
      if (!owner) {
        // Create a new user
        owner = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          mobile: '9876543210',
          role: 'seller',
          verified: true
        });
        console.log('Created new test user:', owner.name);
      } else {
        console.log(`Using existing user: ${owner.name} (${owner.email})`);
      }
      
      // Sample properties data
      const sampleProperties = [
        {
          title: 'Luxury 3BHK Apartment in Mumbai',
          description: 'Beautiful 3BHK apartment with modern amenities, spacious rooms, and a stunning view of the city skyline. Located in a prime area with easy access to schools, hospitals, and shopping centers.',
          price: 9500000,
          status: 'sale',
          type: 'flat',
          size: 1500,
          bedrooms: 3,
          bathrooms: 2,
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
          amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Power Backup', 'Parking', 'Garden'],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6bb0267',
            'https://images.unsplash.com/photo-1560448204-603b3fc33dddc'
          ],
          ownerId: owner._id,
          featured: true,
          verified: true
        },
        {
          title: 'Modern 2BHK Flat for Rent in Delhi',
          description: 'Fully furnished 2BHK flat available for rent in a gated community. Features include modular kitchen, air conditioning, and premium flooring. Close to metro station and market.',
          price: 35000,
          status: 'rent',
          type: 'flat',
          size: 1200,
          bedrooms: 2,
          bathrooms: 2,
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
          amenities: ['Furnished', 'Air Conditioning', 'Lift', 'Security', 'Parking', 'Club House'],
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
            'https://images.unsplash.com/photo-1560185127-6ed189bf02f4'
          ],
          ownerId: owner._id,
          featured: true,
          verified: true
        },
        {
          title: 'Spacious 4BHK Villa in Bangalore',
          description: 'Luxurious 4BHK villa with private garden and terrace. Features include Italian marble flooring, designer kitchen, and smart home automation. Located in a premium gated community.',
          price: 15000000,
          status: 'sale',
          type: 'villa',
          size: 3200,
          bedrooms: 4,
          bathrooms: 4,
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
          amenities: ['Swimming Pool', 'Garden', 'Smart Home', 'Security', 'Parking', 'Gym'],
          images: [
            'https://images.unsplash.com/photo-1580587771525-78b9dba33b914',
            'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83'
          ],
          ownerId: owner._id,
          featured: true,
          verified: true
        },
        {
          title: 'Commercial Office Space in Hyderabad',
          description: 'Premium office space available in a corporate park. Ideal for IT companies, startups, or corporate offices. Includes dedicated parking, 24/7 security, and power backup.',
          price: 12000000,
          status: 'sale',
          type: 'commercial',
          size: 2500,
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
          amenities: ['24/7 Access', 'Power Backup', 'Security', 'Parking', 'Conference Room', 'Cafeteria'],
          images: [
            'https://images.unsplash.com/photo-1497366754035-f200968aa6e72',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2'
          ],
          ownerId: owner._id,
          featured: true,
          verified: true
        },
        {
          title: 'Residential Plot in Pune',
          description: 'Prime residential plot in a developing area with excellent appreciation potential. All utilities available. Ready for construction with approved building plans.',
          price: 7500000,
          status: 'sale',
          type: 'plot',
          size: 2400,
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
          amenities: ['Gated Community', 'Park', 'Water Supply', 'Electricity', 'Road Access'],
          images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
            'https://images.unsplash.com/photo-1542889601-399c4f3a8402'
          ],
          ownerId: owner._id,
          featured: true,
          verified: true
        },
        {
          title: 'Retail Shop in Chennai Mall',
          description: 'Commercial retail shop available in a high-footfall shopping mall. Perfect for retail brands, restaurants, or service businesses. Ready to move in with all fixtures.',
          price: 85000,
          status: 'rent',
          type: 'shop',
          size: 800,
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
          amenities: ['Air Conditioning', 'Power Backup', 'Security', 'Parking', 'Storage Room'],
          images: [
            'https://images.unsplash.com/photo-1604014237800-1c9102c219da',
            'https://images.unsplash.com/photo-1582037928769-59cc0f2d1f1d'
          ],
          ownerId: owner._id,
          featured: true,
          verified: true
        }
      ];
      
      // Delete existing properties
      await Property.deleteMany({});
      console.log('Deleted all existing properties');
      
      // Insert the sample properties
      const result = await Property.insertMany(sampleProperties);
      console.log(`Added ${result.length} sample properties to the database`);
      
      // Verify the properties were added
      const count = await Property.countDocuments();
      console.log(`Total properties in database: ${count}`);
      
      // Verify featured properties
      const featuredCount = await Property.countDocuments({ featured: true });
      console.log(`Featured properties in database: ${featuredCount}`);
      
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
