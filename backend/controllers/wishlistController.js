const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate({
      path: 'propertyIds',
      populate: {
        path: 'ownerId',
        select: 'name email mobile'
      }
    });

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = await Wishlist.create({
        userId: req.user.id,
        propertyIds: []
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add property to wishlist
// @route   POST /api/wishlist/:propertyId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      // Create new wishlist if it doesn't exist
      wishlist = await Wishlist.create({
        userId: req.user.id,
        propertyIds: [req.params.propertyId]
      });
    } else {
      // Check if property is already in wishlist
      if (wishlist.propertyIds.includes(req.params.propertyId)) {
        return res.status(400).json({
          success: false,
          message: 'Property already in wishlist'
        });
      }

      // Add property to wishlist
      wishlist.propertyIds.push(req.params.propertyId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove property from wishlist
// @route   DELETE /api/wishlist/:propertyId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Check if property is in wishlist
    if (!wishlist.propertyIds.includes(req.params.propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property not in wishlist'
      });
    }

    // Remove property from wishlist
    wishlist.propertyIds = wishlist.propertyIds.filter(
      id => id.toString() !== req.params.propertyId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (err) {
    next(err);
  }
};
