import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supportTypes: [],
  loading: false,
  error: null
};

const supportTypeSlice = createSlice({
  name: 'supportTypes',
  initialState,
  reducers: {
    // GET
    getSupportTypesRequest: (state) => { state.loading = true; },
    getSupportTypesSuccess: (state, action) => {
      state.loading = false;
      state.supportTypes = action.payload;
    },
    getSupportTypesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ADD
    addSupportTypeRequest: (state) => { state.loading = true; },
    addSupportTypeSuccess: (state, action) => {
      state.loading = false;
      state.supportTypes.push(action.payload);
    },
    addSupportTypeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // EDIT
    editSupportTypeRequest: (state) => { state.loading = true; },
    editSupportTypeSuccess: (state, action) => {
      state.loading = false;
      state.supportTypes = state.supportTypes.map(s =>
        s._id === action.payload._id ? action.payload : s
      );
    },
    editSupportTypeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // DELETE
    deleteSupportTypeRequest: (state) => { state.loading = true; },
    deleteSupportTypeSuccess: (state, action) => {
      state.loading = false;
      state.supportTypes = state.supportTypes.filter(s => s._id !== action.payload);
    },
    deleteSupportTypeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  getSupportTypesRequest, getSupportTypesSuccess, getSupportTypesFailure,
  addSupportTypeRequest, addSupportTypeSuccess, addSupportTypeFailure,
  editSupportTypeRequest, editSupportTypeSuccess, editSupportTypeFailure,
  deleteSupportTypeRequest, deleteSupportTypeSuccess, deleteSupportTypeFailure
} = supportTypeSlice.actions;

export default supportTypeSlice.reducer;