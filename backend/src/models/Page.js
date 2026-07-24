const mongoose = require('mongoose');

// Schema representing individual content blocks
const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header', 'paragraph', 'list', 'table', 'equation', 'code'],
    required: true
  },
  // Dynamic object containing content parameters based on the block type
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
});

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A page title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  blocks: [BlockSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Page', PageSchema);
module.exports.BlockSchema = BlockSchema;
