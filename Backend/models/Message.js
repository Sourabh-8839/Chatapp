const mongoose = require('mongoose');

const MessageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Messages', MessageModel);

module.exports = Message;
