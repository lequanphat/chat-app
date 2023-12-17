import { Box, Stack } from '@mui/material';
import { Chat_History } from '../../data';
import { DocMessage, LinkMessage, MediaMessage, ReplyMessage, TextMessage, TimeLine } from './MessageTypes';
import { useSelector } from 'react-redux';
import { stateType } from '../../store/interface';
import { useEffect } from 'react';

const Message = () => {
    const { recieveMessage } = useSelector((state: stateType) => state.chat);
    useEffect(() => {
        Chat_History.push({
            type: 'msg',
            message: recieveMessage,
            incoming: true,
            outgoing: false,
        });
    }, [recieveMessage]);
    return (
        <Box p={2}>
            <Stack spacing={3}>
                {Chat_History.map((msg, index) => {
                    switch (msg.type) {
                        case 'divider':
                            return <TimeLine key={index} text={msg.text} />;
                        case 'msg':
                            switch (msg.subtype) {
                                case 'img':
                                    return <MediaMessage key={index} msg={msg} />;
                                case 'doc':
                                    return <DocMessage key={index} msg={msg} />;
                                case 'link':
                                    return <LinkMessage key={index} msg={msg} />;
                                case 'reply':
                                    return <ReplyMessage key={index} msg={msg} />;
                                default:
                                    return <TextMessage key={index} msg={msg} />;
                            }
                        default:
                            return <></>;
                    }
                })}
            </Stack>
        </Box>
    );
};

export default Message;
