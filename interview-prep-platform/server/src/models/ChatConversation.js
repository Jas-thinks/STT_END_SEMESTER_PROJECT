const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    default: null
  },
  resources: {
    type: [{
      title: String,
      url: String,
      snippet: String
    }],
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  messages: [messageSchema],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
chatConversationSchema.index({ userId: 1, lastActive: -1 });

// Auto-delete conversations older than 30 days
chatConversationSchema.index(
  { lastActive: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

module.exports = { ChatConversation };
