const Lead = require('../models/Lead');
const Property = require('../models/Property');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create new lead
// @route   POST /api/leads
// @access  Public
exports.createLead = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Create lead
    const lead = await Lead.create({
      userId: req.user ? req.user.id : null,
      propertyId,
      name,
      email,
      phone,
      message
    });

    // Create notification for property owner
    await Notification.create({
      userId: property.ownerId,
      type: 'lead',
      message: `New lead for your property: ${property.title}`,
      relatedId: lead._id,
      onModel: 'Lead'
    });

    // Send email to property owner
    const owner = await User.findById(property.ownerId);
    
    const emailMessage = `
      <h1>New Lead</h1>
      <p>You have received a new lead for your property: ${property.title}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    try {
      await sendEmail({
        email: owner.email,
        subject: 'New Lead for Your Property',
        message: emailMessage
      });
    } catch (err) {
      console.error('Email could not be sent', err);
    }

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all leads for a property
// @route   GET /api/properties/:propertyId/leads
// @access  Private
exports.getPropertyLeads = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is property owner or admin
    if (
      property.ownerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these leads'
      });
    }

    const leads = await Lead.find({ propertyId: req.params.propertyId }).sort('-timestamp');

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all leads for current user
// @route   GET /api/leads
// @access  Private
exports.getUserLeads = async (req, res, next) => {
  try {
    // For sellers/agents/admin - get leads for their properties
    if (['seller', 'agent', 'admin'].includes(req.user.role)) {
      // Get user's properties
      const properties = await Property.find({ ownerId: req.user.id });
      const propertyIds = properties.map(property => property._id);

      // Get leads for those properties
      const leads = await Lead.find({
        propertyId: { $in: propertyIds }
      })
        .populate('propertyId', 'title images')
        .sort('-timestamp');

      return res.status(200).json({
        success: true,
        count: leads.length,
        data: leads
      });
    }

    // For buyers - get leads they've submitted
    const leads = await Lead.find({ userId: req.user.id })
      .populate('propertyId', 'title images')
      .sort('-timestamp');

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Get property to check ownership
    const property = await Property.findById(lead.propertyId);

    // Check if user is property owner or admin
    if (
      property.ownerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    // Update status
    lead.status = req.body.status;
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    next(err);
  }
};
