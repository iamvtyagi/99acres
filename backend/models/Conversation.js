const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participantA: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  participantB: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  unreadCountA: {
    type: Number,
    default: 0
  },
  unreadCountB: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique conversations between two users
ConversationSchema.index(
  { participantA: 1, participantB: 1 },
  { unique: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);
