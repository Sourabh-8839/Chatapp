import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatProvider } from '../../../Context/ContextProvider';
import UserBadgeItem from '../../ListIems/UserBadgeItem';
import UserListItem from '../../ListIems/UserListItem';
import {
  AddUSerInGroup,
  GetUser,
  RemoveUSerInGroup,
  RenameGroup,
} from '../../../service/api';

const GroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { account, selectedChat, setSelectedChat } = ChatProvider();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRemove = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== account._id &&
      account._id !== user1._id
    ) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${account.token}`,
        },
      };

      const user = {
        chatId: selectedChat._id,
        userId: user1._id,
      };

      const updateData = await RemoveUSerInGroup(user, config);

      account._id === user1._id
        ? setSelectedChat()
        : setSelectedChat(updateData);

      setFetchAgain(!fetchAgain);

      fetchMessages();

      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }

    setGroupChatName('');
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${account.token}`,
        },
      };

      const GroupeUpdate = {
        chatName: groupChatName,
        chatId: selectedChat._id,
      };

      const updateData = await RenameGroup(GroupeUpdate, config);

      setSelectedChat(updateData);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setRenameLoading(false);
    }

    setGroupChatName('');
  };

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${account.token}}`,
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

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== account._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${account.token}`,
        },
      };

      const user = {
        chatId: selectedChat._id,
        userId: user1._id,
      };

      const updateUser = await AddUSerInGroup(user, config);

      setSelectedChat(updateUser);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }

    setGroupChatName('');
  };

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            d='flex'
            justifyContent='center'
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add User to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(account)} colorScheme='red'>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
