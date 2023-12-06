import React from 'react';
import { ChatProvider } from '../../../Context/ContextProvider';

import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../Config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import ImageMessages from './ImageMessages';

const ScrollableChat = ({ messages }) => {
  const { account } = ChatProvider();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: 'flex' }} key={m._id}>
            {isSameSender(messages, m, i, account._id) ||
              (isLastMessage(messages, i, account._id) && (
                <Tooltip
                  label={m.sender.name}
                  placement='bottom-start'
                  hasArrow
                >
                  <Avatar
                    mt='7px'
                    mr={1}
                    size='sm'
                    cursor='pointer'
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              ))}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === account._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, account._id),
                marginTop: isSameUser(messages, m, i, account._id) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 10px',
                maxWidth: '75%',
              }}
            >
              {m.type !== 'text' ? (
                <ImageMessages src={m.content} format={m.type} />
              ) : (
                m.content
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
