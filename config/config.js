require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES || 60 * 24 * 7, // 7 days
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      documentsBucket: process.env.S3_DOCUMENTS_BUCKET || 'docuvault-documents',
      expirySeconds: parseInt(process.env.S3_SIGNED_URL_EXPIRY_SECONDS || '3600', 10),
    }
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/docuvault'
  }
};
