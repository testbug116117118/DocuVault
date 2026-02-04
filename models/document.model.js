const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  objectKey: {
    type: String,
    required: true,
    unique: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 0
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'archived', 'deleted'],
    default: 'pending'
  },
  tags: [{
    type: String,
    trim: true
  }],
  sharedWith: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
DocumentSchema.index({ owner: 1, folder: 1 });
DocumentSchema.index({ 'sharedWith.user': 1 });
DocumentSchema.index({ status: 1 });

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
