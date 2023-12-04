import { Box } from '@chakra-ui/react';
import { ChatProvider } from '../../Context/ContextProvider';
import SingleChat from './Chats/SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatProvider();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems='center'
      flexDir='column'
      p={3}
      bg='white'
      w={{ base: '100%', md: '68%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
