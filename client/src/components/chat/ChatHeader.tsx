
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import StyledBadge from '../avatar/StyledBadge';
import { IoSearchOutline, IoVideocamOutline } from 'react-icons/io5';
import { PiPhoneLight } from "react-icons/pi";
import { GoChevronDown } from 'react-icons/go';
import { useTheme } from '@emotion/react';
import quanphat from '../../assets/quanphat.jpg';
import { ToggleSidebar } from '../../store/slices/appSlice';
import { useDispatch } from 'react-redux';
const ChatHeader = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
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
                        <StyledBadge
                            onClick={() => {
                                dispatch(ToggleSidebar());
                            }}
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                        >
                            <Avatar alt="Quan Phat" src={quanphat} />
                        </StyledBadge>
                    </Box>
                    <Stack spacing={0}>
                        <Typography variant="subtitle2">Quan Phat</Typography>
                        <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                            Online
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton>
                        <IoVideocamOutline />
                    </IconButton>
                    <IconButton>
                        <PiPhoneLight />
                    </IconButton>
                    <IconButton>
                        <IoSearchOutline />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton>
                        <GoChevronDown />
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
};
export default ChatHeader;
