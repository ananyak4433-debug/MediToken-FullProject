
import { createSlice } from '@reduxjs/toolkit';

const supportSlice = createSlice({
  name: 'support',

  initialState: {
    departments:    [],
    myRequests:     [],
    loading:        false,
    requestLoading: false,
    submitLoading:  false,
    submitSuccess:  false,
    error:          null
  },

  reducers: {
    /* ===== GET SUPPORT TYPES ===== */
    getDepartments: (state) => { state.loading = true; },
    getDepartmentsSuccess: (state, action) => {
      state.loading = false;
      state.departments = action.payload?.supportTypes || action.payload?.departments || action.payload?.data || action.payload || [];
    },
    getDepartmentsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===== SUBMIT SUPPORT ===== */
    submitSupport: (state) => {
      state.submitLoading = true;
      state.submitSuccess = false;
      state.error = null;
    },
    submitSupportSuccess: (state) => {
      state.submitLoading = false;
      state.submitSuccess = true;
    },
    submitSupportFail: (state, action) => {
      state.submitLoading = false;
      state.error = action.payload;
    },

    /* ===== GET MY REQUESTS ===== */
    getMyRequests: (state) => { state.requestLoading = true; },
    getMyRequestsSuccess: (state, action) => {
      state.requestLoading = false;
      state.myRequests = action.payload?.requests || action.payload || [];
    },
    getMyRequestsFail: (state, action) => {
      state.requestLoading = false;
      state.error = action.payload;
    },

    /* ===== RESET ===== */
    resetSubmitSuccess: (state) => { state.submitSuccess = false; }
  }
});

export const {
  getDepartments, getDepartmentsSuccess, getDepartmentsFail,
  submitSupport, submitSupportSuccess, submitSupportFail,
  getMyRequests, getMyRequestsSuccess, getMyRequestsFail,
  resetSubmitSuccess
} = supportSlice.actions;

export default supportSlice.reducer;