const mongoose = require('mongoose');

const Backup = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
    },
    content: {
      type: String,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
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
