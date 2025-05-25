// src/routes/profileRoutes.js
const express = require("express");
const { check } = require("express-validator");
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", authMiddleware.authenticate, profileController.getProfile);
router.put(
  "/",
  [
    authMiddleware.authenticate,
    check("username", "Username is required").optional().not().isEmpty(),
    check("email", "Please include a valid email").optional().isEmail(),
  ],
  profileController.updateProfile
);
router.post('/change-password', authMiddleware.authenticate, profileController.changePassword);
router.get('/connection-history', authMiddleware.authenticate, profileController.getConnectionHistory);

module.exports = router;
 