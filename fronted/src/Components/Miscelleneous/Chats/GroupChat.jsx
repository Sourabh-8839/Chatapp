import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

import ChatLoading from '../../ListIems/ChatLoading';
import UserListItem from '../../ListIems/UserListItem';
import { GetUser, createGroup } from '../../../service/api';
import { ChatProvider } from '../../../Context/ContextProvider';
import UserBadgeItem from '../../ListIems/UserBadgeItem';

const GroupChat = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { setChats, chats } = ChatProvider();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // console.log(chats);
  const handleSearch = async (query) => {
    setSearch(query);

    // console.log(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}}`,
        },
      };

      const getUser = await GetUser(config);

      const user = getUser.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );

      // console.log(user);

      setLoading(false);

      setSearchResult(user);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the user',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };
  const handleSubmit = async () => {
    try {
      // console.log(token);

      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      };

      const group = {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      };

      const data = await createGroup(group, config);
      setChats([data, ...chats]);

      onClose();

      toast({
        title: 'New Group Created',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      toast({
        title: 'Failed to create Group',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  //remove user in selected area
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add Users eg: John, Piyush, Jane'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w='100%' d='flex' flexWrap='wrap'>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              // <div>Loading...</div>
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme='blue'>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChat;
