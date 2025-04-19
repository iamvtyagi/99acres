const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  verifyEmail,
  uploadProfilePhoto,
  logout,
} = require("../controllers/authController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/update-details", protect, updateDetails);
router.put("/update-password", protect, updatePassword);
router.put("/upload-photo", protect, uploadProfilePhoto);

module.exports = router;
