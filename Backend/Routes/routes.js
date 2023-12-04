const express = require('express');
const router = express.Router();

const Authentication = require('../Controller/Authentication');

const Conversation = require('../Controller/Conversation');
const GroupConversation = require('../Controller/GroupConversation');
const MessageController = require('../Controller/MessageController');

const { getUsers } = require('../Controller/User');
const { protect } = require('../middleware/jwttoken');

//SignUp
router.post('/user/Signup', Authentication.addUser);
//Login
router.post('/user/Signin', Authentication.LoginUser);

//Getting All Users
router.get('/getUser', getUsers);

//Create Chat conversation

router.post('/chat/set', protect, Conversation.setConversation);

router.get('/chat/get', protect, Conversation.fetchChats);

// Create Group Chat
router.post('/chat/setGroup', protect, GroupConversation.createGroupChat);

//Update Group Name
router.put('/chat/group/rename', protect, GroupConversation.UpdateGroupName);

//Add user in Group
router.put('/chat/group/addUser', protect, GroupConversation.AddUSerInGroup);

//Remove or Left the Group api
router.put('/chat/group/remove', protect, GroupConversation.RemoveUSerInGroup);

//Send Messages

router.post('/message/send', protect, MessageController.SendMessage);

router.get('/message/get/:chatId', protect, MessageController.fetchMessages);

module.exports = router;
