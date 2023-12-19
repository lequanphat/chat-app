import { Box, IconButton, Stack, useTheme } from '@mui/material';
import { IoSendSharp } from 'react-icons/io5';
import ChatInput from './ChatInput';
import { useChatSocket } from '../../hooks/useChatSocket';
import { useDispatch, useSelector } from 'react-redux';
import { stateType } from '../../store/interface';
import { addDocMessage, addImageMessage, addMessage, resetAllField, resetMessage } from '../../store/slices/chatSlice';
import { FormEvent } from 'react';
import { openSnackbar } from '../../store/slices/appSlice';

const ChatFooter = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dispatch = useDispatch<any>();
    const { id } = useSelector((state: stateType) => state.auth);
    const { contacts, currentContact } = useSelector((state: stateType) => state.contacts);
    const { text, image, doc } = useSelector((state: stateType) => state.chat);
    const { emitMessage } = useChatSocket();
    const theme = useTheme();

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (image) {
            console.log(image);
            const formData = new FormData();
            formData.append('image', image);
            formData.append('from', id);
            formData.append('to', contacts[currentContact]._id);
            formData.append('text', text);
            const response = await dispatch(addImageMessage(formData));
            console.log(response);
            const result = response.payload.messages;
            if (result) {
                emitMessage({
                    type: 'image',
                    image: result[0].image,
                    from: result[0].from,
                    to: result[0].to,
                });
                emitMessage({
                    type: 'text',
                    text: result[1].text,
                    from: result[1].from,
                    to: result[1].to,
                });
            } else {
                emitMessage({
                    type: 'image',
                    image: response.payload.message.image,
                    from: response.payload.message.from,
                    to: response.payload.message.to,
                });
            }

            dispatch(resetAllField());
            return;
        }
        if (doc) {
            console.log(image);
            const formData = new FormData();
            formData.append('file', doc);
            formData.append('from', id);
            formData.append('to', contacts[currentContact]._id);
            formData.append('text', text);
            const response = await dispatch(addDocMessage(formData));
            console.log(response);
            if (response.error) {
                dispatch(openSnackbar({ message: response.payload.error, serverity: 'error' }));
                return;
            }
            
            const result = response.payload.messages;
            if (result) {
                emitMessage({
                    type: 'doc',
                    text: result[0].text,
                    doc: result[0].doc,
                    from: result[0].from,
                    to: result[0].to,
                });
                emitMessage({
                    type: 'text',
                    text: result[1].text,
                    from: result[1].from,
                    to: result[1].to,
                });
            } else {
                emitMessage({
                    type: 'doc',
                    text: response.payload.message.text,
                    doc: response.payload.message.doc,
                    from: response.payload.message.from,
                    to: response.payload.message.to,
                });
            }
            dispatch(resetAllField());
            return;
        }
        if (text.trim() === '') {
            return;
        }
        emitMessage({ type: 'text', text, from: id, to: contacts[currentContact]._id });
        dispatch(resetMessage());
        dispatch(addMessage({ from: id, to: contacts[currentContact]._id, text }));
    };
    return (
        <Box
            p={2}
            sx={{
                width: '100%',
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper,
                boxShadow: '0px 0px 2px rgba(0,0,0, .25)',
            }}
        >
            <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    handleSendMessage(e);
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <ChatInput />
                    <Stack alignItems="center" justifyContent="center" sx={{ width: 46, height: 42 }}>
                        <IconButton type="submit">
                            <IoSendSharp color={theme.palette.primary.main} size={34} />
                        </IconButton>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
};

export default ChatFooter;
