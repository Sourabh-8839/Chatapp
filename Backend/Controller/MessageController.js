const Chat = require('../models/ChatModule');
const Message = require('../models/Message');
const User = require('../models/User');

const SendMessage = async (req, res) => {
  try {
    const { content, chatId, type } = req.body;

    console.log(type);
    if (!content || !chatId) {
      return res.status(400).Json({ message: 'Invalid Data' });
    }

    let newMessage = {
      sender: req.user._id,
      content: content,
      chatId: chatId,
      type: type,
    };

    let message = await Message.create(newMessage);

    console.log(message);

    message = await message.populate('sender', 'name pic');

    message = await message.populate('chatId');

    message = await User.populate(message, {
      path: 'chatId.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId: chatId })
      .populate('sender', 'name pic email')
      .populate('chatId');

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { SendMessage, fetchMessages };
