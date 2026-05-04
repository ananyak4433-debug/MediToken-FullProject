import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  loading: false,
  error: null
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    getPatientsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getPatientsSuccess: (state, action) => {
      state.loading = false;
      state.patients = action.payload;
    },

    getPatientsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  getPatientsRequest,
  getPatientsSuccess,
  getPatientsFailure
} = patientSlice.actions;

export default patientSlice.reducer;