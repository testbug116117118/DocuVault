const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { expressjwt: jwt } = require('express-jwt');
const config = require('./config/config');
const routes = require('./routes');

const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins }));
app.use(morgan('combined'));

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Authentication middleware
app.use(
  jwt({
    secret: config.jwtSecret,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }).unless({ path: ['/api/auth/login', '/api/auth/register', /\/health.*/] })
);

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DocuVault API running on port ${PORT}`);
});

module.exports = app;
