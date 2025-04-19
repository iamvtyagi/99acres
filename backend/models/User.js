const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  mobile: {
    type: String,
    required: [true, "Please provide a mobile number"],
    match: [/^[0-9]{10}$/, "Please provide a valid 10-digit mobile number"],
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "agent", "admin"],
    default: "buyer",
  },
  profilePhoto: {
    type: String,
    default: "default-profile.jpg",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash verification token
UserSchema.methods.getVerificationToken = function () {
  try {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to verificationToken field
    this.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Set expire
    this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    return verificationToken;
  } catch (error) {
    console.error("Error generating verification token:", error);
    throw error;
  }
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  try {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
  } catch (error) {
    console.error("Error generating reset token:", error);
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);
