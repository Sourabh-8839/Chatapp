import React, { useEffect, useState } from 'react';
import './style.css';
import { ChatProvider } from '../../../Context/ContextProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  flexbox,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, AttachmentIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../Config/ChatLogics';
import ProfileModal from '../ProfileModal';
import GroupChatModal from './GroupChatModal';
import { SendMessage, fetchAllMessages } from '../../../service/api';
import ScrollableChat from './ScrollableChat';
import animation from '../../../Animation/typing.json';
var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [file, setFile] = useState();

  const [socketConnected, setSocketConnected] = useState(false);

  const {
    account,
    selectedChat,
    setSelectedChat,
    socket,
    notification,
    setNotification,
  } = ChatProvider();

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    socket.current.on();

    socket.current.emit('setup', account);

    socket.current.on('typing', () => setIsTyping(true));
    socket.current.on('stop typing', () => setIsTyping(false));

    socket.current.on('connected', () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.current.on('message received', (newMessageReceived) => {
      console.log('message recieved');
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chatId._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        console.log('receive messagae');
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  //get messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          authorization: `Bearer ${account.token}`,
        },
      };

      setLoading(true);

      const getMessages = await fetchAllMessages(selectedChat._id, config);

      setMessages(getMessages);

      setLoading(false);
      socket.current.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };
  //Send messages
  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.current.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
        };

        setNewMessage('');

        const contentMessage = {
          content: newMessage,
          chatId: selectedChat._id,
        };

        const data = await SendMessage(contentMessage, config);
        socket.current.emit('new message', data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occured!',
          description: 'Failed to send Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        });
      }
    }
  };

  //Typing
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit('typing', selectedChat._id);
    }

    let lastTyping = new Date().getTime();

    let timer = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();

      let diff = timeNow - lastTyping;

      if (diff >= timer && typing) {
        socket.current.emit('stop typing', selectedChat._id);

        setTyping(false);
      }
    }, timer);
  };

  const onFileChange = (file) => {
    // console.log(e.target.files[0]);

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const data = new FormData();

      data.append('file', file);
      data.append('upload_preset', 'chatapp');
      data.append('cloud_name', 'sourabhsst');

      fetch('https://api.cloudinary.com/v1_1/sourabhsst/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setNewMessage(data.url.toString());
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(account, selectedChat.users)}

                <ProfileModal
                  user={getSenderFull(account, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <GroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                ></GroupChatModal>
              </>
            )}
          </Text>

          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              // style={{ display: flexbox }}
              onKeyDown={sendMessage}
              id='first-name'
              isRequired
              mt={3}
            >
              {istyping ? <div>typing...</div> : <></>}

              <div className='container'>
                <label htmlFor='fileInput'>
                  <AttachmentIcon className='clip' />
                </label>

                <input
                  type='file'
                  id='fileInput'
                  style={{ display: 'none' }}
                  onChange={(e) => onFileChange(e.target.files[0])}
                />
                <Input
                  variant='filled'
                  bg='#E0E0E0'
                  placeholder='Enter a message..'
                  value={newMessage}
                  onChange={typingHandler}
                />
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'
        >
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
