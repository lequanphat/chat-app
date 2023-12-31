import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { IoPersonAddOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { Search, SearchIconWrapper, StyledInputBase } from '../input/SearchInput';
import { MdOutlineArchive } from 'react-icons/md';
import ChatElement from './ChatElement';
import { Scrollbar } from '../scrollbar/Scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { stateType } from '../../store/interface';
import { getAllContacts } from '../../store/slices/chatSlice';
import Loading from '../loading/Loading';
import { useNavigate } from 'react-router-dom';
import { AddFriendsDialog } from '../dialog/AddFriendsDialog';
const Chats = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const navigate = useNavigate();
  const { contacts, currentContact, isLoading } = useSelector((state: stateType) => state.chat);
  const contactsList = [...contacts];
  const [openAddFriends, setOpenAddFriends] = useState<boolean>(false);
  useEffect(() => {
    dispatch(getAllContacts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePickContact = async (id: string) => {
    navigate(`/app/chat/${id}`);
  };
  const handleCloseAddFriends = () => {
    setOpenAddFriends(false);
  };
  const handleOpenAddFriends = () => {
    setOpenAddFriends(true);
  };
  return (
    <Box
      sx={{
        position: 'relative',
        width: 320,
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper,
        boxShadow: '0px 0px 2px rgba(0,0,0,.2)',
      }}
    >
      <Stack px={3} py={2} spacing={2} sx={{ height: '100vh' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Chats</Typography>
          <IconButton onClick={handleOpenAddFriends}>
            <IoPersonAddOutline size={20} />
          </IconButton>
        </Stack>
        <Stack sx={{ width: '100%' }}>
          <Search>
            <SearchIconWrapper>
              <CiSearch size={18} />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
          </Search>
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={0.4}>
            <MdOutlineArchive size={22} />
            <Button>Archive</Button>
          </Stack>
          <Divider />
        </Stack>
        <Scrollbar direction="column" sx={{ flexGrow: 1, overflow: 'auto', height: '100%' }} spacing={2}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Stack spacing={1.6}>
                <Typography variant="subtitle2" sx={{ color: '#676767' }}>
                  All Chats
                </Typography>
                {contactsList.length ? (
                  <>
                    {contactsList
                      .sort((a, b) => {
                        const dateA = new Date(a.recentMessage.createdAt).getTime();
                        const dateB = new Date(b.recentMessage.createdAt).getTime();
                        return dateB - dateA;
                      })
                      .map((item, index) => {
                        return (
                          <ChatElement
                            key={item.contact._id}
                            {...item.contact}
                            {...item.recentMessage}
                            selected={currentContact?._id === contactsList[index].contact._id}
                            online={item.contact.status === 'online'}
                            onClick={() => {
                              handlePickContact(item.contact._id);
                            }}
                          />
                        );
                      })}
                  </>
                ) : (
                  <Stack alignItems="center" justifyContent="center">
                    <Typography variant="body1" mb={1.6}>
                      You have no friends
                    </Typography>
                    <Button variant="contained" sx={{ fontSize: 12, px: 2, py: 0.8 }} onClick={handleOpenAddFriends}>
                      Add friends
                    </Button>
                  </Stack>
                )}
              </Stack>
              <Stack spacing={1.6}></Stack>
            </>
          )}
        </Scrollbar>
      </Stack>
      {openAddFriends && <AddFriendsDialog open={openAddFriends} handleClose={handleCloseAddFriends} />}
    </Box>
  );
};

export default Chats;
