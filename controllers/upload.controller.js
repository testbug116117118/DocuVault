const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const config = require('../config/config');
const Document = require('../models/document.model');
const { generatePresignedUrl } = require('../services/s3Service');

/**
 * Generate a presigned URL for direct S3 upload
 */
exports.getPresignedUrl = async (req, res) => {
  try {
    const { fileName, contentType, folderId } = req.body;
    const userId = req.user.id;

    // Generate a unique object key for the file
    const documentId = uuidv4();
    const fileExtension = fileName.split('.').pop();
    
    // Form the key structure: users/{userId}/folders/{folderId}/{documentId}.{ext}
    let objectKey;
    if (folderId) {
      objectKey = `users/${userId}/folders/${folderId}/${documentId}.${fileExtension}`;
    } else {
      objectKey = `users/${userId}/${documentId}.${fileExtension}`;
    }

    // Generate the presigned URL
    const presignedUrl = await generatePresignedUrl(
      config.aws.s3.documentsBucket,
      objectKey,
      config.aws.s3.expirySeconds
    );

    // Create a pending document record
    const document = new Document({
      name: fileName,
      objectKey,
      contentType,
      size: 0, // Will be updated after upload completion
      owner: userId,
      folder: folderId || null,
      status: 'pending'
    });

    await document.save();

    return res.status(200).json({
      presignedUrl,
      documentId: document._id,
      expiresIn: config.aws.s3.expirySeconds
    });
  } catch (error) {
    logger.error(`Error generating presigned URL: ${error.message}`);
    return res.status(500).json({ message: 'Failed to generate upload URL' });
  }
};

/**
 * Complete an upload process
 */
exports.completeUpload = async (req, res) => {
  try {
    const { documentId, size } = req.body;
    const userId = req.user.id;

    // Find the document and verify ownership
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    if (document.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update document status and metadata
    document.status = 'active';
    document.size = size;
    document.updatedAt = new Date();
    await document.save();

    return res.status(200).json({
      message: 'Upload completed successfully',
      document: {
        id: document._id,
        name: document.name,
        size: document.size,
        contentType: document.contentType,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error completing upload: ${error.message}`);
    return res.status(500).json({ message: 'Failed to complete upload' });
  }
};
