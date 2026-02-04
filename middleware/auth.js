const { UnauthorizedError } = require('../utils/errors');

/**
 * Middleware to verify the user is authenticated
 */
exports.requireAuth = (req, res, next) => {
  // Express-jwt middleware already verified the token
  // and attached the user to the request object
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }
  next();
};

/**
 * Middleware to verify the user has admin role
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles.includes('admin')) {
    return res.status(403).json({
      message: 'Admin access required'
    });
  }
  next();
};

/**
 * Check if the user has permission to access a resource
 */
exports.checkResourceAccess = (resourceField) => {
  return (req, res, next) => {
    const resourceId = req.params[resourceField];
    const userId = req.user.id;
    
    // This is a simplified check - in a real app you'd verify against the database
    // or a permission service that the user has access to the resource
    if (!resourceId) {
      return next(new UnauthorizedError('Resource ID is required'));
    }
    
    // If the user is an admin, allow access
    if (req.user.roles && req.user.roles.includes('admin')) {
      return next();
    }
    
    // In a real app, you'd check if the resource belongs to the user
    // For now, we'll just pass through for the demo
    next();
  };
};
