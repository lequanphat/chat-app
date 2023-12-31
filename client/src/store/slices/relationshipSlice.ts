import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/internal';
import { CreateFriendRequestDTO, DeleteFriendRequestDTO, relationshipType } from '../types';

const initialState: relationshipType = {
  friendRequests: {
    send: [],
    receive: [],
  },
  isLoading: false,
};

export const relationshipSlice = createSlice({
  name: 'relationship',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFriendRequests.fulfilled, (state, action) => {
        state.friendRequests.receive = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllFriendRequests.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllFriendRequestsFromSelf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFriendRequestsFromSelf.fulfilled, (state, action) => {
        state.friendRequests.send = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllFriendRequestsFromSelf.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFriendRequests.fulfilled, (state, action) => {
        if (action.payload.type === 'send') {
          state.friendRequests.send = state.friendRequests.send.filter(
            (value) => value._id !== action.payload.friendRequest._id,
          );
        } else {
          state.friendRequests.receive = state.friendRequests.receive.filter(
            (value) => value._id !== action.payload.friendRequest._id,
          );
        }
        state.isLoading = false;
      })
      .addCase(deleteFriendRequests.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(acceptFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptFriendRequests.fulfilled, (state, action) => {
        state.friendRequests.receive = state.friendRequests.receive.filter((value) => value._id !== action.payload.id);
        state.isLoading = false;
      })
      .addCase(acceptFriendRequests.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const searchUsersForAddFriend = createAsyncThunk(
  'relationship/searchUsersForAddFriend',
  async (search: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contacts/search-users/${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);
export const getRecommendedUsersForAddFriends = createAsyncThunk(
  'relationship/getRecommendedUsersForAddFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts/get-recommended-users');
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);
export const createFriendRequests = createAsyncThunk(
  'relationship/createFriendRequests',
  async (data: CreateFriendRequestDTO, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts/create-friend-request', data);
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);
export const deleteFriendRequests = createAsyncThunk(
  'relationship/deleteFriendRequests',
  async (data: DeleteFriendRequestDTO, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts/delete-friend-request', data);
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);
export const acceptFriendRequests = createAsyncThunk(
  'relationship/acceptFriendRequests',
  async (data: { friendRequestId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts/accept-friend-request', data);
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);
export const getAllFriendRequests = createAsyncThunk(
  'relationship/getAllFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts/get-all-friend-requests');
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);
export const getAllFriendRequestsFromSelf = createAsyncThunk(
  'relationship/getAllFriendRequestsFromSelf',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts/get-all-friend-requests-from-self');
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'error' });
    }
  },
);

export default relationshipSlice.reducer;
