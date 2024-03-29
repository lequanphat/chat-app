import { Stack } from '@mui/material';
import {
  ContactMessage,
  DocMessage,
  MediaMessage,
  SystemMessage,
  TextMessage,
  VideoCallMessage,
  VoiceCallMessage,
  VoiceMessage,
} from './MessageTypes';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { Scrollbar } from '../../../components/scrollbar/Scrollbar';
import Loading from '../../../components/loading/Loading';
import { MessageType } from '../types';
import { stateType } from '../../../store/types';

const Message = ({ currentMessages }) => {
  const { id } = useSelector((state: stateType) => state.auth);

  const { isMessagesLoading } = useSelector((state: stateType) => state.chat);
  const scrollRef = useRef(null);

  // effect
  useEffect(() => {
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [scrollRef, currentMessages]);

  //render
  return isMessagesLoading ? (
    <Loading />
  ) : (
    <Scrollbar
      sx={{
        flexGrow: 1,
        width: '100%',
        boxShadow: '0px 0px 2px rgba(0,0,0, .25)',
      }}
      ref={scrollRef}
      p={2}
    >
      <Stack spacing={1.5}>
        {currentMessages.map(
          (
            msg: { _id: string; type: string; text: string; from: string; to: string; image?: string },
            index: number,
          ) => {
            switch (msg.type) {
              case MessageType.TEXT:
                return <TextMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              case MessageType.IMAGE:
                return <MediaMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              case MessageType.DOC:
                return <DocMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              case MessageType.VOICE:
                return <VoiceMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              case MessageType.SYSTEM:
                return <SystemMessage key={index} msg={msg} />;
              case MessageType.CONTACT:
                return <ContactMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              case MessageType.VIDEO_CALL:
                return <VideoCallMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              case MessageType.VOICE_CALL:
                return <VoiceCallMessage key={index} msg={msg} fromSelf={msg.from === id} />;
              default:
                return '';
            }
          },
        )}
      </Stack>
    </Scrollbar>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default Message;
