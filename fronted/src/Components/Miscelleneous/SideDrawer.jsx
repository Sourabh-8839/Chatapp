import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import './Chats/style.css';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatProvider } from '../../Context/ContextProvider';

import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';

import UserListItem from '../ListIems/UserListItem';
import { GetUser, setConversation } from '../../service/api';

import { getSender } from '../Config/ChatLogics';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    account,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatProvider();

  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  //Logout Handler
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');

    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
    let response;

    const config = {
      headers: {
        authorization: `Bearer ${account.token}`,
      },
    };

    response = await GetUser(config);

    // console.log(response);

    const filterData = response.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResult(filterData);

    return;
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const accessChat = async (sender_id, reciever_id) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          authorization: `Bearer ${account.token}`,
        },
      };

      const data = await setConversation(
        { senderId: sender_id, recieverId: reciever_id },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);

      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip hasArrow label='Search User' bg='gray.300' color='black'>
          <Button>
            <i class='fa-solid fa-magnifying-glass'></i>
            <Text
              display={{ base: 'none', md: 'flex' }}
              px={4}
              onClick={onOpen}
            >
              {' '}
              Search
            </Text>
          </Button>
        </Tooltip>
        <Box>
          <Menu>
            <MenuButton>
              <div
                className={notification.length !== 0 ? 'bellIcon' : 'none'}
                current-counter={notification.length}
              >
                <BellIcon fontSize={'4xl'} mr={5} />
              </div>
            </MenuButton>
            <MenuList pl={2} style={{ cursor: 'pointer' }}>
              {!notification.length && 'no new Message'}
              {notification.map((notif) => (
                <menuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chatId);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chatId.isGroupChat
                    ? `New Message in ${notif.chatId.chatName}`
                    : // : 'heelo'
                      `new Message From ${getSender(
                        account,
                        notif.chatId.users
                      )}`}
                </menuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} name={account.name} src={account.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={account}>
                <MenuItem>My Profile</MenuItem>{' '}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {searchResult.map(
              (user) =>
                user._id !== account._id && (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      accessChat(account._id, user._id);
                    }}
                  />
                )
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
