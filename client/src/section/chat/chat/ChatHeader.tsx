import { Avatar, Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import StyledBadge from '../../../components/avatar/StyledBadge';
import { IoSearchOutline, IoVideocamOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { PiPhoneLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleContact } from '../../../store/slices/appSlice';
import { stateType } from '../../../store/types';
import { openVideoCall, openVoiceCall } from '../../../store/slices/chatSlice';
const ChatHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentContact } = useSelector((state: stateType) => state.chat);
  const { contactbar } = useSelector((state: stateType) => state.app);
  const { id } = useSelector((state: stateType) => state.auth);

  // handle
  const handleVideoCall = () => {
    dispatch(openVideoCall(id));
  };

  // handle
  const handleVoiceCall = () => {
    dispatch(openVoiceCall(id));
  };

  // render
  if (currentContact === null || currentContact === undefined) {
    return <></>;
  }

  return (
    <Box
      sx={{
        height: 70,
        width: '100%',
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" height="100%">
        <Stack direction="row" spacing={2}>
          <Box>
            {currentContact.status === 'online' ? (
              <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                <Avatar alt="Remy Sharp" src={currentContact.avatar} />
              </StyledBadge>
            ) : (
              <Avatar alt="Remy Sharp" src={currentContact.avatar} />
            )}
          </Box>
          <Stack spacing={0}>
            <Typography variant="subtitle2">{currentContact.displayName || currentContact.groupName}</Typography>
            <Typography variant="body1" fontSize={13} sx={{ color: '#7f8c8d' }} textTransform="capitalize">
              {currentContact.status || `${currentContact.members.length} members`}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={handleVideoCall}>
            <IoVideocamOutline size={22} />
          </IconButton>
          <IconButton onClick={handleVoiceCall}>
            <PiPhoneLight size={22} />
          </IconButton>
          <IconButton>
            <IoSearchOutline size={22} />
          </IconButton>
          {!contactbar.open && (
            <>
              <Divider orientation="vertical" flexItem />
              <IconButton
                onClick={() => {
                  dispatch(toggleContact());
                }}
              >
                <IoInformationCircleOutline />
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
export default ChatHeader;
