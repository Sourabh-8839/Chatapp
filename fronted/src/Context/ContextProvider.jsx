import { useContext, useRef } from 'react';
import { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { io } from 'socket.io-client';

export const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [notification, setNotification] = useState([]);

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // console.log('context provider', userInfo);

    setAccount(userInfo);

    if (!userInfo) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const socket = useRef();

  useEffect(() => {
    socket.current = io('https://chatapp-j7en.onrender.com');

    // socket.current = io('http://localhost:5000');
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        socket,
        notification,
        setNotification,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const ChatProvider = () => {
  return useContext(AccountContext);
};

export default AccountProvider;
