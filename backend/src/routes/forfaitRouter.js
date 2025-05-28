const express = require('express');
const router = express.Router();
const forfaitController = require('../controllers/forfaitController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// GET all forfaits (for admin or user)
router.get('/',forfaitController.getAllForfaits);

// GET one forfait
router.get('/:id', forfaitController.getForfaitById);

// PUT update forfait (admin only)
router.put('/:id', authenticate, isAdmin, forfaitController.updateForfait);

module.exports = router;
