import { createSlice } from '@reduxjs/toolkit';

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctorsList: [],
    loading: false,
    error: null
  },
  reducers: {
    /* ===== GET ===== */
    getDoctors: (state) => { state.loading = true; },
    getDoctorsSuccess: (state, action) => {
      console.log('👨‍⚕️ doctors payload:', action.payload);
      state.loading = false;
      state.doctorsList = action.payload?.data || action.payload || [];
    },
    getDoctorsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===== ADD ===== */
    addDoctor: (state) => { state.loading = true; },
    addDoctorSuccess: (state) => { state.loading = false; },
    addDoctorFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===== EDIT ===== */
    editDoctor: (state) => { state.loading = true; },
    editDoctorSuccess: (state) => { state.loading = false; },
    editDoctorFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===== DELETE ===== */
    removeDoctor: (state) => { state.loading = true; },
    removeDoctorSuccess: (state) => { state.loading = false; },
    removeDoctorFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  getDoctors, getDoctorsSuccess, getDoctorsFail,
  addDoctor, addDoctorSuccess, addDoctorFail,
  editDoctor, editDoctorSuccess, editDoctorFail,
  removeDoctor, removeDoctorSuccess, removeDoctorFail
} = doctorsSlice.actions;

export default doctorsSlice.reducer;