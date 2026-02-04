const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config/config');
const logger = require('../utils/logger');

// Initialize S3 client
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

/**
 * Generate a presigned URL for uploading objects to S3
 * @param {string} bucket - S3 bucket name
 * @param {string} objectKey - S3 object key
 * @param {number} expirySeconds - URL expiry time in seconds
 * @returns {Promise<string>} - Presigned URL
 */
const generatePresignedUrl = async (bucket, objectKey, expirySeconds = 3600) => {
  const params = {
    Bucket: bucket,
    Key: objectKey,
    Expires: expirySeconds
  };
  
  try {
    const command = new PutObjectCommand(params);
    return await getSignedUrl(s3Client, command, { expiresIn: expirySeconds });
  } catch (error) {
    logger.error(`Failed to generate presigned URL: ${error.message}`);
    throw new Error('Failed to generate upload URL');
  }
};

/**
 * Generate a presigned URL for downloading objects from S3
 * @param {string} bucket - S3 bucket name
 * @param {string} objectKey - S3 object key
 * @param {number} expirySeconds - URL expiry time in seconds
 * @returns {Promise<string>} - Presigned URL
 */
const generateDownloadUrl = async (bucket, objectKey, expirySeconds = 3600) => {
  const params = {
    Bucket: bucket,
    Key: objectKey,
    Expires: expirySeconds
  };
  
  try {
    const command = new GetObjectCommand(params);
    return await getSignedUrl(s3Client, command, { expiresIn: expirySeconds });
  } catch (error) {
    logger.error(`Failed to generate download URL: ${error.message}`);
    throw new Error('Failed to generate download URL');
  }
};

/**
 * Delete an object from S3
 * @param {string} bucket - S3 bucket name
 * @param {string} objectKey - S3 object key
 * @returns {Promise<void>}
 */
const deleteObject = async (bucket, objectKey) => {
  const params = {
    Bucket: bucket,
    Key: objectKey
  };
  
  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    logger.info(`Successfully deleted object ${objectKey} from bucket ${bucket}`);
  } catch (error) {
    logger.error(`Failed to delete object: ${error.message}`);
    throw new Error('Failed to delete object');
  }
};

module.exports = {
  generatePresignedUrl,
  generateDownloadUrl,
  deleteObject
};
