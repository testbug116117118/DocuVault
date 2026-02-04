const express = require('express');
const authRoutes = require('./auth.routes');
const documentRoutes = require('./document.routes');
const folderRoutes = require('./folder.routes');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/folders', folderRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
