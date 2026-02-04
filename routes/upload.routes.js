const express = require('express');
const { validateUploadRequest } = require('../middleware/validation');
const uploadController = require('../controllers/upload.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/uploads/presigned-url
 * @desc Get a presigned URL for direct S3 upload
 * @access Private
 */
router.post('/presigned-url', 
  requireAuth, 
  validateUploadRequest,
  uploadController.getPresignedUrl
);

/**
 * @route POST /api/uploads/complete
 * @desc Complete an upload and process the document
 * @access Private
 */
router.post('/complete',
  requireAuth,
  uploadController.completeUpload
);

module.exports = router;
