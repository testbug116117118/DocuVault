const Joi = require('joi');

/**
 * Validate upload request
 */
exports.validateUploadRequest = (req, res, next) => {
  const schema = Joi.object({
    fileName: Joi.string().required(),
    contentType: Joi.string().required(),
    folderId: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }

  // Validate file extension
  const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png'];
  const extension = req.body.fileName.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return res.status(400).json({ 
      message: 'Invalid file type', 
      details: `Allowed types: ${allowedExtensions.join(', ')}` 
    });
  }

  next();
};

/**
 * Validate document upload complete request
 */
exports.validateCompleteUploadRequest = (req, res, next) => {
  const schema = Joi.object({
    documentId: Joi.string().required(),
    size: Joi.number().required().min(1)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }

  next();
};
