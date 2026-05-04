// import { createSlice } from '@reduxjs/toolkit';

// const staffSlice = createSlice({
//   name: 'staff',

//   initialState: {
//     staffList: [],
//     loading: false,
//     error: null
//   },

//   reducers: {
//     /* ===== GET STAFF ===== */
//     getStaff: (state) => {
//       state.loading = true;
//     },
//     getStaffSuccess: (state, action) => {
//       state.loading = false;
//       state.staffList = action.payload?.data || action.payload || [];
//     },
//     getStaffFail: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     /* ===== ADD STAFF ===== */
//     addStaff: (state) => {
//       state.loading = true;
//     },
//     addStaffSuccess: (state) => {
//       state.loading = false;
//     },
//     addStaffFail: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     /* ===== EDIT STAFF ===== */
//     editStaff: (state) => {
//       state.loading = true;
//     },
//     editStaffSuccess: (state) => {
//       state.loading = false;
//     },
//     editStaffFail: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     /* ===== DELETE STAFF ===== */
//     deleteStaff: (state) => {
//       state.loading = true;
//     },
//     deleteStaffSuccess: (state) => {
//       state.loading = false;
//     },
//     deleteStaffFail: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     }
//   }
// });

// /* ✅ EXPORT ACTIONS */
// export const {
//   getStaff,
//   getStaffSuccess,
//   getStaffFail,
//   addStaff,
//   addStaffSuccess,
//   addStaffFail,
//   editStaff,
//   editStaffSuccess,
//   editStaffFail,
//   deleteStaff,
//   deleteStaffSuccess,
//   deleteStaffFail
// } = staffSlice.actions;

// /* ✅ EXPORT REDUCER */
// export default staffSlice.reducer;











import { createSlice } from '@reduxjs/toolkit';

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staffList: [],
    loading: false,
    error: null
  },
  reducers: {
    getStaff: (state) => {
      state.loading = true;
    },
    getStaffSuccess: (state, action) => {
      state.loading = false;
      // ✅ handle both array and { data: [] } response shapes
      state.staffList = Array.isArray(action.payload)
        ? action.payload
        : action.payload?.data || [];
    },
    getStaffFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addStaff: (state) => {
      state.loading = true;
    },
    addStaffSuccess: (state) => {
      state.loading = false;  // ✅ list will be refreshed by getStaff dispatch in saga
    },
    addStaffFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    editStaff: (state) => {
      state.loading = true;
    },
    editStaffSuccess: (state) => {
      state.loading = false;
    },
    editStaffFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteStaff: (state) => {
      state.loading = true;
    },
    deleteStaffSuccess: (state) => {
      state.loading = false;
    },
    deleteStaffFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  getStaff, getStaffSuccess, getStaffFail,
  addStaff, addStaffSuccess, addStaffFail,
  editStaff, editStaffSuccess, editStaffFail,
  deleteStaff, deleteStaffSuccess, deleteStaffFail
} = staffSlice.actions;

export default staffSlice.reducer;