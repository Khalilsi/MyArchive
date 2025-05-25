const express = require("express");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const {
  submitRequest,
  getRequests,
  getRequest,
  updateRequestStatus,
  getCompanyInfo,
  updateCompanyInfo
} = require("../controllers/requestController");

const router = express.Router();


router.post("/", submitRequest);

router.get("/", authenticate, isAdmin, getRequests);
router.get("/:id", authenticate, getRequest);
router.patch("/:id/status", authenticate, isAdmin, updateRequestStatus);
router.get('/company/info', authenticate, getCompanyInfo);
router.patch('/company/update', authenticate,updateCompanyInfo);

module.exports = router;
