import { useEffect, useState } from 'react';
import { ChatProvider } from '../../Context/ContextProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { getConversation } from '../../service/api';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ListIems/ChatLoading';
import { getSender } from '../Config/ChatLogics';
import GroupChat from './Chats/GroupChat';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, chats, setChats } = ChatProvider();

  const toast = useToast();

  // it Uses for getting conversation and set loginUser
  const handleConversation = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      // console.log('acc', userInfo.token);

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      };

      const data = await getConversation(config);

      // console.log(conversation.data);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));

    handleConversation();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <GroupChat>
          <Button
            d='flex'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChat>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
