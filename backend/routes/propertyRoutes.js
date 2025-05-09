const express = require("express");
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesInRadius,
  propertyImageUpload,
} = require("../controllers/propertyController");

const { getPropertyLeads } = require("../controllers/leadController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/radius/:zipcode/:distance").get(getPropertiesInRadius);

router
  .route("/")
  .get(getProperties)
  .post(protect, authorize("seller", "agent", "admin"), createProperty);

router
  .route("/:id")
  .get(getProperty)
  .put(protect, authorize("seller", "agent", "admin"), updateProperty)
  .delete(protect, authorize("seller", "agent", "admin"), deleteProperty);

router
  .route("/:id/images")
  .put(protect, authorize("seller", "agent", "admin"), propertyImageUpload);

router.route("/:propertyId/leads").get(protect, getPropertyLeads);

module.exports = router;
