const Property = require("../models/Property");
const User = require("../models/User");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const geocoder = require("../utils/geocoder");

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Handle boolean values for featured
    if (reqQuery.featured === "true") {
      reqQuery.featured = true;
    } else if (reqQuery.featured === "false") {
      reqQuery.featured = false;
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Log the query for debugging
    console.log("Query:", queryStr);

    // Finding resource
    let query = Property.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate owner details
    query = query.populate({
      path: "ownerId",
      select: "name email mobile role profilePhoto",
    });

    // Executing query
    const properties = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: properties,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate({
      path: "ownerId",
      select: "name email mobile role profilePhoto",
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.ownerId = req.user.id;

    // Set property as featured by default
    req.body.featured = true;

    // Check if user is seller or agent or admin
    if (
      req.user.role !== "seller" &&
      req.user.role !== "agent" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to create a property`,
      });
    }

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is property owner or admin
    if (
      property.ownerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this property`,
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is property owner or admin
    if (
      property.ownerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this property`,
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get properties within radius
// @route   GET /api/properties/radius/:zipcode/:distance
// @access  Public
exports.getPropertiesInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    try {
      // Get lat/lng from geocoder
      const loc = await geocoder.geocode(zipcode);

      if (!loc || loc.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid zipcode",
        });
      }

      const lat = loc[0].latitude;
      const lng = loc[0].longitude;

      // Calc radius using radians
      // Divide dist by radius of Earth
      // Earth Radius = 3,963 mi / 6,378 km
      const radius = distance / 3963;

      const properties = await Property.find({
        "location.coordinates": {
          $geoWithin: { $centerSphere: [[lng, lat], radius] },
        },
      });

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
      });
    } catch (geocodeError) {
      console.error("Geocoder error:", geocodeError);

      // Fallback to simple text search if geocoder fails
      const properties = await Property.find({
        $or: [
          { "location.pincode": zipcode },
          { "location.city": { $regex: new RegExp(zipcode, "i") } },
        ],
      });

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
        note: "Using text search instead of radius search due to geocoding error",
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Upload property images
// @route   PUT /api/properties/:id/images
// @access  Private
exports.propertyImageUpload = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is property owner or admin
    if (
      property.ownerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this property`,
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const file = req.files.file;

    console.log("Received file:", file.name, file.mimetype, file.size);

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).json({
        success: false,
        message: `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        }MB`,
      });
    }

    // Create custom filename
    file.name = `photo_${property._id}_${Date.now()}${
      path.parse(file.name).ext
    }`;

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "properties",
        public_id: file.name,
      });

      console.log("Cloudinary upload successful:", result.secure_url);

      // Add image to property
      property.images.push(result.secure_url);
      await property.save();
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({
        success: false,
        message: "Error uploading image to cloud storage",
        error: cloudinaryError.message,
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err) {
    next(err);
  }
};
