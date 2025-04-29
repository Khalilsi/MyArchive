const express = require("express");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  submitRequest,
  getRequests,
  getRequest,
  updateRequestStatus
} = require("../controllers/requestController");

const router = express.Router();


router.post("/", submitRequest);

router.get("/", authenticate, isAdmin, getRequests);
router.get("/:id", authenticate, getRequest);
router.patch("/:id/status", authenticate, isAdmin, updateRequestStatus);

module.exports = router;
