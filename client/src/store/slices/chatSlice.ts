import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/internal';
import { MessageType } from '../../section/chat/types';
import { acceptFriendRequests } from './relationshipSlice';
import { CallType, chatType } from '../types';
import { ContactMessageDTO } from '../types/dto';
const initialState: chatType = {
  unseenMessage: 0,
  chats: [],
  contacts: [],
  currentContact: undefined,
  call: {
    contact: undefined,
    open: false,
    calling: false,
    pending: false,
    accepted: false,
    owner: undefined,
    type: undefined,
  },
  isLoading: false,
  isMessagesLoading: false,
};
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentContact(state, action) {
      state.currentContact = action.payload;
    },
    resetContacts(state) {
      state.currentContact = undefined;
      state.contacts = [];
    },
    resetChatSlice(state) {
      state.unseenMessage = 0;
      state.chats = [];
      state.contacts = [];
      state.currentContact = undefined;
      state.isLoading = false;
      state.isMessagesLoading = false;
    },

    addMessageToCurrentMessages(state, action) {
      if (action.payload.toGroup) {
        state.chats.forEach((item) => {
          if (item.id === action.payload.to) {
            const contact = state.contacts.find((contact) => contact.contact._id === action.payload.from);
            if (item.messages.length === 0) {
              action.payload.avatar = contact.contact.avatar;
              action.payload.authorName = contact.contact.displayName;
            } else if (
              item.messages[item.messages.length - 1].from !== action.payload.from ||
              item.messages[item.messages.length - 1].type === MessageType.SYSTEM
            ) {
              action.payload.avatar = contact.contact.avatar;
              action.payload.authorName = contact.contact.displayName;
            }
            item.messages.push(action.payload);
          }
        });
        state.contacts.forEach((item) => {
          if (item.contact._id === action.payload.to) {
            item.recentMessage.type = action.payload.type;
            item.recentMessage.text = action.payload.text;
            item.recentMessage.createdAt = action.payload.createdAt;
            if (action.payload.to !== state.currentContact?._id) {
              item.total += 1;
            }
          }
        });
        if (action.payload.to !== state.currentContact?._id) {
          state.unseenMessage += 1;
        }
      } else {
        state.chats.forEach((item) => {
          if (item.id === action.payload.from) {
            const contact = state.contacts.find((contact) => contact.contact._id === action.payload.from);
            if (item.messages.length === 0) {
              action.payload.avatar = contact.contact.avatar;
            } else if (
              item.messages[item.messages.length - 1].to !== action.payload.to ||
              item.messages[item.messages.length - 1].type === MessageType.SYSTEM
            ) {
              action.payload.avatar = contact.contact.avatar;
            }
            item.messages.push(action.payload);
          }
        });
        state.contacts.forEach((item) => {
          if (item.contact._id === action.payload.from) {
            item.recentMessage.type = action.payload.type;
            item.recentMessage.text = action.payload.text;
            item.recentMessage.createdAt = action.payload.createdAt;
            if (action.payload.from !== state.currentContact?._id) {
              item.total += 1;
            }
          }
        });
        if (action.payload.from !== state.currentContact?._id) {
          state.unseenMessage += 1;
        }
      }
    },
    addNewContact(state, action) {
      state.contacts.push(action.payload);
      state.unseenMessage += 1;
    },
    clearMessages(state) {
      state.chats = [];
    },
    openVideoCall(state, action) {
      state.call.contact = state.currentContact;
      state.call.open = true;
      state.call.pending = true;
      state.call.calling = false;
      state.call.accepted = false;
      state.call.owner = action.payload;
      state.call.type = CallType.VIDEO_CALL;
    },
    openVoiceCall(state, action) {
      state.call.contact = state.currentContact;
      state.call.open = true;
      state.call.pending = true;
      state.call.calling = false;
      state.call.accepted = false;
      state.call.owner = action.payload;
      state.call.type = CallType.VOICE_CALL;
    },
    closCall(state) {
      state.call.contact = undefined;
      state.call.open = false;
      state.call.pending = false;
      state.call.calling = false;
      state.call.accepted = false;
      state.call.owner = undefined;
      state.call.type = undefined;
    },
    interruptCall(state) {
      state.call.pending = false;
      state.call.calling = false;
      state.call.accepted = true;
    },
    friendRefuseCall(state) {
      state.call.accepted = false;
      state.call.pending = false;
      state.call.calling = false;
    },
    friendAcceptCall(state, action) {
      state.call.pending = false;
      state.call.calling = true;
      state.call.accepted = true;
      state.call.contact = state.contacts.find((contact) => contact.contact._id === action.payload.from).contact;
    },
    receiveVideoCall(state, action) {
      state.call.open = true;
      state.call.calling = false;
      state.call.pending = true;
      state.call.accepted = false;
      state.call.owner = action.payload.from;
      state.call.contact = state.contacts.find((contact) => contact.contact._id === action.payload.from).contact;
      state.call.type = CallType.VIDEO_CALL;
    },
    receiveVoiceCall(state, action) {
      state.call.open = true;
      state.call.calling = false;
      state.call.pending = true;
      state.call.accepted = false;
      state.call.owner = action.payload.from;
      state.call.contact = state.contacts.find((contact) => contact.contact._id === action.payload.from).contact;
      state.call.type = CallType.VOICE_CALL;
    },
    acceptIncomingCall(state) {
      state.call.calling = true;
      state.call.pending = false;
      state.call.accepted = true;
      // reset incoming call
    },
    refuseIncomingCall(state) {
      state.call.open = false;
      state.call.accepted = false;
      state.call.pending = false;
      state.call.contact = undefined;
    },
    recall(state, action) {
      state.call.contact = state.currentContact;
      state.call.pending = true;
      state.call.calling = false;
      state.call.accepted = false;
      state.call.owner = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.contacts = [...action.payload.contacts];
        state.unseenMessage = state.contacts.reduce((total, current) => total + current.total, 0);
        state.isLoading = false;
      })
      .addCase(getAllContacts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.chats.push(action.payload);
        state.isMessagesLoading = false;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })
      .addCase(addTextMessage.pending, () => {})
      .addCase(addTextMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            item.messages.push(action.payload.message);
          }
        });
        state.contacts.forEach((item) => {
          if (item.contact._id === action.payload.id) {
            item.recentMessage.type = action.payload.message.type;
            item.recentMessage.text = action.payload.message.text;
            item.recentMessage.createdAt = action.payload.message.createdAt;
          }
        });
      })
      .addCase(addTextMessage.rejected, () => {})
      .addCase(addContactMessage.pending, () => {})
      .addCase(addContactMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            item.messages.push(action.payload.message);
          }
        });
        state.contacts.forEach((item) => {
          if (item.contact._id === action.payload.id) {
            item.recentMessage.type = action.payload.message.type;
            item.recentMessage.text = action.payload.message.text;
            item.recentMessage.createdAt = action.payload.message.createdAt;
          }
        });
      })
      .addCase(addContactMessage.rejected, () => {})
      .addCase(addImageMessage.pending, () => {})
      .addCase(addImageMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            if (action.payload.data.messages) {
              // image message and text message
              item.messages.push(...action.payload.data.messages);
            } else {
              // only image message
              item.messages.push(action.payload.data.message);
            }
          }
        });
      })
      .addCase(addImageMessage.rejected, () => {})
      .addCase(addDocMessage.pending, () => {})
      .addCase(addDocMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            if (action.payload.data.messages) {
              // image message and text message
              item.messages.push(...action.payload.data.messages);
            } else {
              // only image message
              item.messages.push(action.payload.data.message);
            }
          }
        });
      })
      .addCase(addDocMessage.rejected, () => {})
      .addCase(addVoiceMessage.pending, () => {})
      .addCase(addVoiceMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            item.messages.push(action.payload.data.message);
          }
        });
      })
      .addCase(addVoiceMessage.rejected, () => {})
      .addCase(addVideoCallMessage.pending, () => {})
      .addCase(addVideoCallMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            item.messages.push(action.payload.message);
          }
        });
        state.contacts.forEach((item) => {
          if (item.contact._id === action.payload.id) {
            item.recentMessage.type = action.payload.message.type;
            item.recentMessage.text = action.payload.message.text;
            item.recentMessage.createdAt = action.payload.message.createdAt;
          }
        });
      })
      .addCase(addVideoCallMessage.rejected, () => {})
      .addCase(addVoiceCallMessage.pending, () => {})
      .addCase(addVoiceCallMessage.fulfilled, (state, action) => {
        state.chats.forEach((item) => {
          if (item.id === action.payload.id) {
            item.messages.push(action.payload.message);
          }
        });
        state.contacts.forEach((item) => {
          if (item.contact._id === action.payload.id) {
            item.recentMessage.type = action.payload.message.type;
            item.recentMessage.text = action.payload.message.text;
            item.recentMessage.createdAt = action.payload.message.createdAt;
          }
        });
      })
      .addCase(addVoiceCallMessage.rejected, () => {})
      .addCase(seenMessages.pending, () => {})
      .addCase(seenMessages.fulfilled, (state, action) => {
        for (const contact of state.contacts) {
          if (contact.contact._id === action.payload.contactId) {
            state.unseenMessage -= contact.total;
            contact.total = 0;
          }
        }
      })
      .addCase(seenMessages.rejected, () => {})
      .addCase(createGroup.pending, () => {})
      .addCase(createGroup.fulfilled, (state) => {
        state.unseenMessage += 1;
      })
      .addCase(createGroup.rejected, () => {})
      .addCase(acceptFriendRequests.pending, () => {})
      .addCase(acceptFriendRequests.fulfilled, (state) => {
        state.unseenMessage += 1;
      })
      .addCase(acceptFriendRequests.rejected, () => {});
  },
});
export const getAllContacts = createAsyncThunk('contacts/getAllContacts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/contacts/all-contacts`);
    return { contacts: response.data };
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const getAllUsers = createAsyncThunk('contacts/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/get-all-users`);
    return { users: response.data };
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const getMessages = createAsyncThunk('chat/getAllMessages', async (contactId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/messages/${contactId}`);
    return { messages: response.data.messages, id: contactId };
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const addTextMessage = createAsyncThunk(
  'chat/addTextMessage',
  async (data: { to: string; text: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages/add-text-message', data);

      return {
        id: data.to,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue({ error: error.response.data.message });
    }
  },
);
export const addVideoCallMessage = createAsyncThunk(
  'chat/addVideoCallMessage',
  async (data: { to: string; text: string; owner: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages/add-video-call-message', data);
      return {
        id: data.to,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue({ error: error.response.data.message });
    }
  },
);
export const addVoiceCallMessage = createAsyncThunk(
  'chat/addVoiceCallMessage',
  async (data: { to: string; text: string; owner: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages/add-voice-call-message', data);
      return {
        id: data.to,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue({ error: error.response.data.message });
    }
  },
);
export const addContactMessage = createAsyncThunk(
  'chat/addContactMessage',
  async (data: ContactMessageDTO, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages/add-contact-message', data);
      return {
        id: data.to,
        message: response.data,
      };
    } catch (error) {
      return rejectWithValue({ error: error.response.data.message });
    }
  },
);
export const addImageMessage = createAsyncThunk('chat/addImageMessage', async (data: FormData, { rejectWithValue }) => {
  try {
    const response = await api.post('/messages/add-image-message', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      id: data.get('to'),
      data: response.data,
    };
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const addDocMessage = createAsyncThunk('chat/addDocMessage', async (data: FormData, { rejectWithValue }) => {
  try {
    const response = await api.post('/messages/add-doc-message', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      id: data.get('to'),
      data: response.data,
    };
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const addVoiceMessage = createAsyncThunk('chat/addVoiceMessage', async (data: FormData, { rejectWithValue }) => {
  try {
    const response = await api.post('/messages/add-voice-message', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      id: data.get('to'),
      data: response.data,
    };
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const seenMessages = createAsyncThunk('chat/seenMessages', async (contactId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/messages/seen/${contactId}`);
    console.log(response);

    return response.data;
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const createGroup = createAsyncThunk('chat/createGroup', async (data: FormData, { rejectWithValue }) => {
  try {
    const response = await api.post('/groups/create-group', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export const getMemberOfGroup = createAsyncThunk('chat/getMemberOfGroup', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/groups/members/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message });
  }
});
export default chatSlice.reducer;
export const {
  setCurrentContact,
  resetContacts,
  resetChatSlice,
  addMessageToCurrentMessages,
  clearMessages,
  addNewContact,
  acceptIncomingCall,
  refuseIncomingCall,
  openVideoCall,
  closCall,
  friendRefuseCall,
  friendAcceptCall,
  receiveVideoCall,
  interruptCall,
  recall,
  openVoiceCall,
  receiveVoiceCall,
} = chatSlice.actions;
