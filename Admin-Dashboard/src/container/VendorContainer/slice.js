// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   vendors: [],
//   loading: false,
//   error: null
// };

// const vendorSlice = createSlice({
//   name: 'vendors',
//   initialState,
//   reducers: {
//     // GET VENDORS
//     getVendorsRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     getVendorsSuccess: (state, action) => {
//       state.loading = false;
//       state.vendors = action.payload;
//     },
//     getVendorsFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     // ADD VENDOR
//     addVendorRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     addVendorSuccess: (state, action) => {
//       state.loading = false;
//       state.vendors.push(action.payload);
//     },
//     addVendorFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     // DELETE VENDOR
//     deleteVendorRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     deleteVendorSuccess: (state, action) => {
//       state.loading = false;
//       state.vendors = state.vendors.filter(
//         (vendor) => vendor._id !== action.payload
//       );
//     },
//     deleteVendorFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     }
//   }
// });

// export const {
//   getVendorsRequest,
//   getVendorsSuccess,
//   getVendorsFailure,
//   addVendorRequest,
//   addVendorSuccess,
//   addVendorFailure,
//   deleteVendorRequest,
//   deleteVendorSuccess,
//   deleteVendorFailure
// } = vendorSlice.actions;

// export default vendorSlice.reducer;












import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  loading: false,
  error: null
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    // GET VENDORS
    getVendorsRequest: (state) => { state.loading = true; state.error = null; },
    getVendorsSuccess: (state, action) => { state.loading = false; state.vendors = action.payload; },
    getVendorsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // ADD VENDOR
    addVendorRequest: (state) => { state.loading = true; state.error = null; },
    addVendorSuccess: (state, action) => { state.loading = false; state.vendors.push(action.payload); },
    addVendorFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // EDIT VENDOR ✅
    editVendorRequest: (state) => { state.loading = true; state.error = null; },
    editVendorSuccess: (state, action) => {
      state.loading = false;
      state.vendors = state.vendors.map(v =>
        v._id === action.payload._id ? action.payload : v
      );
    },
    editVendorFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // DELETE VENDOR
    deleteVendorRequest: (state) => { state.loading = true; state.error = null; },
    deleteVendorSuccess: (state, action) => {
      state.loading = false;
      state.vendors = state.vendors.filter(v => v._id !== action.payload);
    },
    deleteVendorFailure: (state, action) => { state.loading = false; state.error = action.payload; }
  }
});

export const {
  getVendorsRequest, getVendorsSuccess, getVendorsFailure,
  addVendorRequest, addVendorSuccess, addVendorFailure,
  editVendorRequest, editVendorSuccess, editVendorFailure,  // ✅
  deleteVendorRequest, deleteVendorSuccess, deleteVendorFailure
} = vendorSlice.actions;

export default vendorSlice.reducer;