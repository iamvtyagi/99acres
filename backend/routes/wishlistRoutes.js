const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getWishlist);
router.route('/:propertyId').post(addToWishlist).delete(removeFromWishlist);

module.exports = router;
