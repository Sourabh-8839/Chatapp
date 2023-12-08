const mongoose = require('mongoose');

const Backup = mongoose.Schema(
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

const BackupTable = mongoose.model('Backup', Backup);

module.exports = BackupTable;
