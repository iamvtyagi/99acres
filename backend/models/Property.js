const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide an address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a city']
    },
    state: {
      type: String,
      required: [true, 'Please provide a state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide a pincode'],
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  type: {
    type: String,
    enum: ['flat', 'house', 'villa', 'plot', 'commercial', 'office', 'shop'],
    required: [true, 'Please provide a property type']
  },
  status: {
    type: String,
    enum: ['rent', 'sale'],
    required: [true, 'Please specify if the property is for rent or sale']
  },
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative']
  },
  size: {
    type: Number,
    required: [true, 'Please provide the size in square feet'],
    min: [0, 'Size cannot be negative']
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: ['default-property.jpg']
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for location search
PropertySchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Property', PropertySchema);
