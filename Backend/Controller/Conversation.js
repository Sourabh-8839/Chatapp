const Chat = require('../models/ChatModule.js');
const User = require('../models/User.js');

const setConversation = async (req, res) => {
  try {
    const { senderId, recieverId } = req.body;

    // console.log(senderId, recieverId);

    var isChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [senderId, recieverId] },
    }).populate('users', '-password');

    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    }

    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [senderId, recieverId],
    };

    const createdChat = await Chat.create(chatData);

    // const FullChat = await Chat.findOne({ _id: createdChat._id })
    // // res.status(200).json(FullChat);

    // console.log(FullChat);

    return res.status(200).json(createdChat);
  } catch (error) {
    console.log('error=>', error.message);
    res.status(500).json(error.message);
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { setConversation, fetchChats };
