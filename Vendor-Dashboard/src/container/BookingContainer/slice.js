
import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookingsList: [],
    loading: false,
    error: null
  },
  reducers: {
    getBookings: (state) => { state.loading = true; },
    getBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookingsList = action.payload?.data || [];
    },
    getBookingsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    cancelBooking: (state) => { state.loading = true; },
    cancelBookingSuccess: (state) => { state.loading = false; },
    cancelBookingFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ add this
    updateBookingStatus: (state) => { state.loading = true; },
    updateBookingStatusSuccess: (state) => { state.loading = false; },
    updateBookingStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
});

export const {
  getBookings, getBookingsSuccess, getBookingsFail,
  cancelBooking, cancelBookingSuccess, cancelBookingFail,
  updateBookingStatus, updateBookingStatusSuccess, updateBookingStatusFail // ✅
} = bookingSlice.actions;

export default bookingSlice.reducer;