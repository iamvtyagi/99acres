const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  propertyIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Property'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one wishlist per user
WishlistSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
