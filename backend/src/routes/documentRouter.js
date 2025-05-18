const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware.authenticate, documentController.uploadDocument);
router.get('/', authMiddleware.authenticate, documentController.getAllDocuments);
router.get('/archive/:archiveId', authMiddleware.authenticate, documentController.getDocumentsByArchive);
router.delete('/:documentId', authMiddleware.authenticate, documentController.deleteDocument);

module.exports = router;