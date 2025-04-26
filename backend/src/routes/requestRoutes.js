const express = require("express");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  submitRequest,
  getRequests,
  getRequest,
  updateRequestStatus
} = require("../controllers/requestController");

const router = express.Router();

// Public route (no authentication needed)
router.post("/", submitRequest);

// Protected admin route (JWT + role check handled in controller)
router.get("/", authenticate, isAdmin, getRequests);
router.get("/:id", authenticate, getRequest);
router.patch("/:id/status", authenticate, isAdmin, updateRequestStatus);

module.exports = router;
