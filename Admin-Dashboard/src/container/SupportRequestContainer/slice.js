import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [],
  loading:  false,
  replyLoading: false,
  error:    null
};

const supportRequestSlice = createSlice({
  name: 'supportRequests',
  initialState,
  reducers: {
    // GET ALL
    getAllRequestsRequest: (state) => { state.loading = true; },
    getAllRequestsSuccess: (state, action) => {
      state.loading  = false;
      state.requests = action.payload?.requests || action.payload || [];
    },
    getAllRequestsFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    // UPDATE STATUS
    updateStatusRequest: (state) => { state.loading = true; },
    updateStatusSuccess: (state, action) => {
      state.loading  = false;
      state.requests = state.requests.map(r =>
        r._id === action.payload._id ? action.payload : r
      );
    },
    updateStatusFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    // REPLY
    replyToRequestRequest: (state) => { state.replyLoading = true; },
    replyToRequestSuccess: (state, action) => {
      state.replyLoading = false;
      state.requests     = state.requests.map(r =>
        r._id === action.payload._id ? action.payload : r
      );
    },
    replyToRequestFailure: (state, action) => {
      state.replyLoading = false;
      state.error        = action.payload;
    },

    // DELETE
    deleteRequestRequest: (state) => { state.loading = true; },
    deleteRequestSuccess: (state, action) => {
      state.loading  = false;
      state.requests = state.requests.filter(r => r._id !== action.payload);
    },
    deleteRequestFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    }
  }
});

export const {
  getAllRequestsRequest, getAllRequestsSuccess, getAllRequestsFailure,
  updateStatusRequest,  updateStatusSuccess,  updateStatusFailure,
  replyToRequestRequest, replyToRequestSuccess, replyToRequestFailure,
  deleteRequestRequest, deleteRequestSuccess, deleteRequestFailure
} = supportRequestSlice.actions;

export default supportRequestSlice.reducer;