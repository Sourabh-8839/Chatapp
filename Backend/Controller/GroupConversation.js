const { json } = require('body-parser');
const Chat = require('../models/ChatModule.js');

const createGroupChat = async (req, res) => {
  try {
    if (!req.body.name || !req.body.users) {
      res.status(400).json({ message: 'Please Fill all the Fields' });
    }

    const name = req.body.name;

    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
      res
        .status(400)
        .JSON({ message: 'More Than 2 users are required to create Group' });
    }

    users.push(req.user);

    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(501).json({ success: false, message: error.message });
  }
};

const UpdateGroupName = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    // console.log(chatId, chatName);

    const updateName = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(updateName);
  } catch (error) {
    console.log(error);

    res.status(400).json({ success: false, message: error.message });
  }
};

const AddUSerInGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      res.status(404).json('Chat not Found');
    }

    res.status(200).json(added);
  } catch (error) {
    console.log(error.message);

    res.status(400).json({ success: false, message: error.message });
  }
};

const RemoveUSerInGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      res.status(404).json('Chat not Found');
    }

    res.status(200).json(added);
  } catch (error) {
    console.log(error.message);

    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGroupChat,
  UpdateGroupName,
  AddUSerInGroup,
  RemoveUSerInGroup,
};
