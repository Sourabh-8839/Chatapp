import { Box } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AccountContext } from '../Context/ContextProvider';
import SideDrawer from '../Components/Miscelleneous/SideDrawer';
import MyChats from '../Components/Miscelleneous/MyChats.jsx';
import ChatBox from '../Components/Miscelleneous/ChatBox.jsx';

const Chatpage = () => {
  const { account } = useContext(AccountContext);

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {account && <SideDrawer />}

      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
      >
        {account && <MyChats fetchAgain={fetchAgain} />}
        {account && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
