import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointmentsList: [],
    loading: false,
    error: null
  },
  reducers: {
    getAppointments: (state) => { state.loading = true; },
    getAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.appointmentsList = action.payload?.data || [];
    },
    getAppointmentsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateAppointmentStatus: (state) => { state.loading = true; },
    updateAppointmentStatusSuccess: (state) => { state.loading = false; },
    updateAppointmentStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
});

export const {
  getAppointments, getAppointmentsSuccess, getAppointmentsFail,
  updateAppointmentStatus, updateAppointmentStatusSuccess, updateAppointmentStatusFail
} = appointmentSlice.actions;

export default appointmentSlice.reducer;