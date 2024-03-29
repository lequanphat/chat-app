import { Avatar, Button, Stack, Typography, useTheme } from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import { User } from './types';
import { useDispatch } from 'react-redux';
import { createFriendRequests } from '../../store/slices/relationshipSlice';
import { openSuccessSnackbar } from '../../store/slices/appSlice';
import { useState } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { useSocket } from '../../hooks/useSocket';
export const FriendItem = ({ user }: { user: User }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const [userInstance, setUserInstance] = useState(user);

  const { emitFriendRequest } = useSocket();
  // handle
  const handleSendFriendRequest = (receiveId: string) => {
    (async () => {
      const response = await dispatch(createFriendRequests({ receiveId, text: 'Hello! How are you today?' }));
      if (!response.payload.error) {
        emitFriendRequest(response.payload);
        dispatch(openSuccessSnackbar('Successfully'));
      }
      setUserInstance({ ...userInstance, status: 'Pending' });
    })();
  };
  const friendStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Typography variant="body2" color={theme.palette.primary.main} fontSize={12}>
            Peding...
          </Typography>
        );
      case 'Friend':
        return (
          <Stack direction="row" alignContent="center">
            <Typography variant="body2" color={theme.palette.primary.main} fontSize={12}>
              Friend
            </Typography>
            <Typography variant="body2" color={theme.palette.success.main} fontSize={12}>
              <IoCheckmark size={15} />
            </Typography>
          </Stack>
        );

      default:
        return (
          <Button
            variant="outlined"
            sx={{ fontSize: 12, py: 0.4, px: 2, borderRadius: 1 }}
            onClick={() => {
              handleSendFriendRequest(userInstance._id);
            }}
          >
            Add
            <FiPlus />
          </Button>
        );
    }
  };

  // render
  return (
    <Stack px={3} direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1.4}>
        <Avatar src={userInstance.avatar} />
        <Stack>
          <Typography variant="body2" fontSize={15}>
            {userInstance.displayName}
          </Typography>
          <Typography variant="body1" fontSize={15} sx={{ opacity: 0.8 }}>
            {userInstance.email}
          </Typography>
        </Stack>
      </Stack>
      {friendStatus(userInstance.status)}
    </Stack>
  );
};
