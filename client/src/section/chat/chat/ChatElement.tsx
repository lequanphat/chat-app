import { Badge, Box, Stack, Typography, useTheme } from '@mui/material';
import { Avatar } from '@mui/material';
import StyledBadge from '../../../components/avatar/StyledBadge';
import React, { useMemo } from 'react';
import { formatMongoTime } from '../../../utils/formatTime';
import { MessageType } from '../types';
import { IoDocumentTextOutline, IoImageOutline } from 'react-icons/io5';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaRegAddressCard } from 'react-icons/fa6';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { Contact, ContactType, RecentMessage } from '../../../store/types';
interface ChatElementProps {
  contact: Contact;
  recentMessages: RecentMessage;
  unseen: number;
  selected?: boolean;
  onClick: () => void;
}
const ChatElement: React.FC<ChatElementProps> = ({
  contact,
  recentMessages,
  unseen,
  selected = false,
  onClick,
  ...props
}) => {
  const theme = useTheme();
  const recentMessageFormat = useMemo(() => {
    switch (recentMessages.type) {
      case MessageType.TEXT:
      case MessageType.SYSTEM:
        return (
          <Typography
            variant="body1"
            fontSize={15}
            color={selected ? '#eee8e8' : unseen === 0 ? '#7f8c8d' : theme.palette.primary.main}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '140px',
            }}
          >
            {recentMessages.text}
          </Typography>
        );
      case MessageType.IMAGE:
        return (
          <>
            <Typography variant="body1">
              <IoImageOutline size={16} />
            </Typography>
            <Typography variant="body1" fontSize={15}>
              image
            </Typography>
          </>
        );
      case MessageType.VOICE:
        return (
          <>
            <Typography variant="body1">
              <MdOutlineKeyboardVoice size={16} />
            </Typography>
            <Typography variant="body1" fontSize={15}>
              voice
            </Typography>
          </>
        );
      case MessageType.DOC:
        return (
          <>
            <Typography variant="body1">
              <IoDocumentTextOutline size={16} />
            </Typography>
            <Typography variant="body1" fontSize={15}>
              document
            </Typography>
          </>
        );
      case MessageType.CONTACT:
        return (
          <>
            <Typography variant="body1" pt={0.5}>
              <FaRegAddressCard size={16} />
            </Typography>
            <Typography variant="body1" fontSize={15}>
              contact
            </Typography>
          </>
        );
      default:
        return (
          <Typography variant="body1" fontSize={15}>
            ...
          </Typography>
        );
    }
  }, [recentMessages.text, recentMessages.type, selected, theme.palette.primary.main, unseen]);

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        height: 70,
        borderRadius: 1,
        padding: 1.4,
        cursor: 'pointer',
        backgroundColor: selected
          ? theme.palette.primary.main
          : theme.palette.mode === 'light'
          ? '#fff'
          : theme.palette.background.default,
        color: selected ? '#eee8e8' : '#7f8c8d',
      }}
      {...props}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" height="100%">
        <Stack direction="row" alignItems="center" spacing={2}>
          {contact.status === 'online' ? (
            <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
              <Avatar alt="avatar" src={contact.avatar} />
            </StyledBadge>
          ) : contact.type === ContactType.USER ? (
            <Avatar alt="avatar" src={contact.avatar} />
          ) : (
            <Badge
              badgeContent={<HiMiniUserGroup size={18} />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt="avatar" src={contact.avatar} />
            </Badge>
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2" color={selected ? '#eee8e8' : theme.palette.text.primary}>
              {contact.displayName || contact.groupName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.6}>
              {recentMessageFormat}
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" alignItems="center" justifyContent="end" spacing={1.4}>
          <Typography variant="body1" fontSize={13} color={selected ? '#eee8e8' : '#7f8c8d'}>
            {formatMongoTime(recentMessages.createdAt)}
          </Typography>
          {!selected && <Badge color="primary" badgeContent={unseen} max={5} sx={{ pb: 1.2 }} />}
        </Stack>
      </Stack>
    </Box>
  );
};

export default React.memo(ChatElement);
