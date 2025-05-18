// src/routes/authRoutes.js
const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authControllers");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  "/signup",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

router.get('/verify', authMiddleware.authenticate, authController.verifyToken);
router.post('/logout', authMiddleware.authenticate, authController.logout);

module.exports = router;
