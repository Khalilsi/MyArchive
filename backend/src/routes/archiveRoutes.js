const express = require('express');
const router = express.Router();
const archiveController = require('../controllers/archiveController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// Protected routes (require user auth)
router.post('/', authMiddleware.authenticate, archiveController.createArchive);
router.get('/', authMiddleware.authenticate, archiveController.getUserArchives);
router.delete('/:archiveId', authMiddleware.authenticate, archiveController.deleteArchive);

module.exports = router;